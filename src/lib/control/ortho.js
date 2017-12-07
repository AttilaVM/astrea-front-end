import {
  Matrix3
  , Matrix4
  , Vector3
  , EventDispatcher } from "three";
import { cartesianToPolar3 } from "../math/geo.js";

const DEFUALT_SENSITIVITY = 0.01;
const DEF_ROTATION_SENSITIVITY = 0.1;

function vectorToPolar(vec) {
  const [x, y, z] = [vec.x, vec.y, vec.z];
  return cartesianToPolar3(x, y, z);
}

function calcCamLocAxis(mat) {
  const xAxis = new Vector3();
  const yAxis = new Vector3();
  const zAxis = new Vector3();
  mat.extractBasis(xAxis, yAxis, zAxis);
  mat.makeBasis(xAxis.normalize()
                , yAxis.normalize()
                , zAxis.normalize());
  return mat;
}

function Emitter() {
  this.rotate = function rotate(sphericalPosition) {
    this.dispatchEvent(
      {type: "rotate"
       , sphericalPosition: sphericalPosition});
  };

  this.pan = function pan() {
    this.dispatchEvent({type: "pan"});
  };

  this.zoom = function zoom(zoom) {
    this.dispatchEvent({type: "zoom"
                        , zoom: zoom});
  };
}
Object.assign(Emitter.prototype, EventDispatcher.prototype);

export function registerOrthoControls(camera
                                      , targetElem
                                      , minZoom
                                      , maxZoom
                                      , opts = {}) {

  const emitter = new Emitter();
  const sensitivity = opts.sensitivity || DEFUALT_SENSITIVITY;
  const render = opts.render;

  function zoom(e) {

    if (e.deltaY)
      camera.zoom += -e.deltaY * sensitivity;

    else if (e.keyCode == 113)
      camera.zoom -= 10 * sensitivity;
    else if (e.keyCode == 101)
      camera.zoom += 10 * sensitivity;
    else
      return;

    if (camera.zoom < minZoom)
      camera.zoom = minZoom;
    else if (camera.zoom > maxZoom)
      camera.zoom = maxZoom;

    // Realize state
    camera.updateProjectionMatrix();
    console.log(camera.bottom, e.deltaY);

    emitter.zoom(camera.zoom);
  }

  targetElem.addEventListener("wheel", zoom);
  window.addEventListener("keypress", zoom);

  let animOriginX;
  let animOriginY;
  let cameraOriginalPos = new Vector3().copy(camera.position);
  // State
  // longitude (a), latitude (b), scale (s)
  let a = 0;
  let b = 0;
  let s;
  let panX = 0;
  let panY = 0;
  const speedFactorBase = 1;
  const speedFactorLimit = 4;
  let speedFactor = 1;
  const keypressSens = 0.01;
  // For better performance these objects are preinstanciated
  let camWorldMat = new Matrix4();
  const target = new Vector3(0, 0, 0);
  const worldOrigin = new Vector3(0, 0, 0);
  const newPos = new Vector3(0, 0, 0);
  let vec1 = new Vector3();
  let vec2 = new Vector3();
  let vec3 = new Vector3();
  let camLocalAxis;

  function rotateCam(a, b, s) {
    newPos.x = Math.cos(b) * Math.sin(a);
    newPos.z = Math.cos(b) * Math.cos(a);
    newPos.y = Math.sin(b);

    camera.position
      .copy(newPos)
      .multiplyScalar(s);
    camera.position.add(vec1);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  }

  function panCam() {
    camLocalAxis.extractBasis(vec1, vec2, vec3);
    vec1 =
      vec1
      .multiplyScalar(panX)
      .add(vec2.multiplyScalar(panY));
    camera.position.add(vec1);
    target.add(vec1);
    camera.updateProjectionMatrix();
  }

  function rotate(e) {
    if (e.clientX){
      if ("which" in e && e.which == 3 // Gecko , WebKit
          || "button" in e && e.button == 2) { // IE, Opera
        panX = (e.clientX - animOriginX) * -0.0002;
        panY = (e.clientY - animOriginY) * 0.0002;
        panCam();
        emitter.pan();
        return;
      }
      a +=
        -Math.asin((e.clientX - animOriginX)
                   * 0.0002
                   * devicePixelRatio) * speedFactor;
      let delta_b = Math.asin((e.clientY - animOriginY)
                              * 0.0002
                              * devicePixelRatio) * speedFactor;
      if (  delta_b > 0 && b + delta_b <  Math.PI / 2 - 0.03
         || delta_b < 0 && b + delta_b > -Math.PI / 2 + 0.03)
        b += delta_b;
    }
    else if (e.keyCode) {
      switch (e.keyCode) {
      case 100:
        a += keypressSens * speedFactor;
        break;
      case 97:
        a -= keypressSens * speedFactor;
        break;
      case 119:
        if (b < Math.PI / 2 - 0.03)
          b += keypressSens * speedFactor;
        break;
      case 115:
        if (b > - Math.PI / 2 + 0.03)
          b -= keypressSens * speedFactor;
        break;
      default:
        return;
      }
      if (speedFactor < speedFactorLimit)
        speedFactor *= 1.05;
    }

    rotateCam(a, b, 3);
    emitter.rotate(newPos.clone());
  }
  function rotateEnd(e) {
    if (e.clientX) {
      targetElem.removeEventListener("mousemove", rotate);
      window.removeEventListener("mouseup", rotateEnd);
    }
    else if(e.keyCode) {
      window.removeEventListener("keypress", rotate);
      window.removeEventListener("keyup", rotateEnd);
    }
    speedFactor = speedFactorBase;
  }

  function rotateStart(e) {
    console.log("start");
    if (e.clientX){
      animOriginX = e.clientX;
      animOriginY = e.clientY;
      targetElem.addEventListener("mousemove", rotate);
      window.addEventListener("mouseup", rotateEnd);
      if ("which" in e && e.which == 3 // Gecko , WebKit
          || "button" in e && e.button == 2) {
        camLocalAxis = calcCamLocAxis(camera.matrixWorld);
      }
    }
    else if (e.keyCode){
      window.addEventListener("keypress", rotate);
      window.addEventListener("keyup", rotateEnd);
    }
  }

  // Disable browser context menu
  window.oncontextmenu = function () {
    return false;     // cancel default menu
  };

  targetElem.addEventListener("mousedown", rotateStart);
  window.addEventListener("keydown", rotateStart);

  // return event emitter object
  return emitter;
}
