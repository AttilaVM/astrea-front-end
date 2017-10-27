// external
import { apply
         , map
         , multiply
       } from "ramda";
import Stats from "stats-js";
// import Gui from "dat.gui";
import
{ Scene
  , WebGLRenderer
  , Color
  , PerspectiveCamera
  , AxisHelper
} from "three";
// internal
import { VoxelGenerator } from "./processing/stack-processing.js";
import { scaleInCubeScaler } from "./geometry-utils";
import { buildParticleSystem } from "./build/particle-system";
import { registerTrackballControl } from "./control/trackball";

export function initCellvis(containerElem, voxelData, voxelDimensions, zScaler, metaData) {
  let canvasWidth = containerElem.offsetWidth;
  let canvasHeight = containerElem.offsetHeight;
  let canvasRatio = canvasWidth / canvasHeight;
  // Basic scene setup
  const scene = new Scene();
  scene.background = new Color(0x232323);
  const renderer = new WebGLRenderer();
  renderer.setSize(canvasWidth, canvasHeight);
  /// Adapt to displays with different pixel densities
  renderer.setPixelRatio(devicePixelRatio);
  /// Append canvas, gui and performance monitior
  containerElem.appendChild(renderer.domElement);
  const stats = new Stats();
  stats.domElement.style.position = "absolute";
  stats.domElement.style.top = "0px";
  containerElem.appendChild(stats.domElement);
  const axes = new AxisHelper(20);
  const camera =
    new PerspectiveCamera( 75, canvasRatio , 0.1, 3000);
  camera.name = "p-camera";
  camera.position.x = 50;
  camera.position.y = 50;
  camera.position.z = 120;
  // Stack setup
  const particleSystem = buildParticleSystem(voxelData
                                             , voxelDimensions
                                             , zScaler);
  // Populate Scene
  scene.add(axes);
  scene.add(particleSystem);
  scene.add(camera);

  function render() {
    renderer.render(scene, camera);
  }

  const controls = registerTrackballControl(camera, render);


  function animate() {
    requestAnimationFrame(animate);
    // Only re-render on control events
    controls.update();

  }

  // render initial frame
  render();
  animate();
}
