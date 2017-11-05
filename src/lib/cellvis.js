// external
import { apply
         , map
         , multiply
       } from "ramda";
import Stats from "stats-js";
import
{ Scene
  , WebGLRenderer
  , Color
  , PerspectiveCamera
  , AxisHelper
  , BoxBufferGeometry
  , VertexColors
  , DoubleSide
  , CustomBlending
  , ImageUtils
  , ShaderMaterial
  , Mesh
} from "three";
// internal
import { VoxelGenerator } from "./processing/stack-processing.js";
import { scaleInCubeScaler } from "./geometry-utils";
import { buildParticleSystem } from "./build/particle-system";
import { buildVoxelBox } from "./build/voxel-box";
import { registerTrackballControl } from "./control/trackball";

function AppData() {
  this.color = [255, 255, 255];
  this.test = 0.5;
}

export function initCellvis(containerElem
                            , voxelData
                            , voxelDimensions
                            , zScaler
                            , metaData
                            , vertexShader
                            , fragmentShader) {
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
  let appData = new AppData();
  let gui = new dat.GUI();
  gui.addColor(appData, "color");
  gui.add(appData, "test", 0.0, 10.0);
  containerElem.appendChild(renderer.domElement);
  const stats = new Stats();
  stats.domElement.style.position = "absolute";
  stats.domElement.style.top = "0px";
  containerElem.appendChild(stats.domElement);
  const axes = new AxisHelper(20);
  const camera =
    new PerspectiveCamera( 75, canvasRatio , 0.1, 3000);
  camera.name = "p-camera";
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 3;
  const viewBoxGeo = new BoxBufferGeometry(2, 2, 2);
  const uniforms = {
    voxelSize: {value: 1.0}
    , globalTime: {value: Date.now()}
    , sliceUvRatio: {value: 1.0/voxelDimensions[2]}
    , discardThreshold: {value: 0.3}
    , volTexture: { type: "t", value: ImageUtils.loadTexture( "/img/voxeldata/generated-3.png" ) }
  };
  const volumetricMaterial = new ShaderMaterial({
    uniforms: uniforms
    , vertexShader: vertexShader
    , fragmentShader: fragmentShader
    // , side: DoubleSide
    , depthWrite: false
    , lights: false
    , morphTargets: false
    // define GLSL constants via #define directive
    , defines: {
      X_SIZE: voxelDimensions[0] + ".0"
      , Y_SIZE: voxelDimensions[1] + ".0"
      , Z_SIZE: voxelDimensions[2] + ".0"
      , SLICE_NUM: voxelDimensions[2]
      , SLICE_UV_RATIO: 1 / voxelDimensions[2] + ".0"
      , DATA_LENGTH: voxelData.length
    }

  });
  const displayBox = new Mesh(viewBoxGeo, volumetricMaterial);
  // Populate Scene
  scene.add(axes);
  // scene.add(particleSystem);
  scene.add(displayBox);
  scene.add(camera);

  function render() {
    renderer.render(scene, camera);
    let time = Date.now() / 2000;
    console.log(time);
    displayBox.material.uniforms.globalTime =
      {value: appData.test};
  }

  const controls = registerTrackballControl(camera, render);


  function animate() {
    requestAnimationFrame(animate);
    render();
    // Only re-render on control events
    controls.update();

  }

  // render initial frame
  render();
  animate();
}
