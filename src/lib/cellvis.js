// external
import { apply
         , map
         , multiply
       } from "ramda";
import Stats from "stats-js";
// import dat from "../../submodules/dat.gui/index";
import
{ Scene
  , WebGLRenderer
  , Vector3
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
  , NearestFilter
} from "three";
// internal
import { VoxelGenerator } from "./processing/stack-processing.js";
import { scaleInCubeScaler } from "./geometry-utils";
import { buildParticleSystem } from "./build/particle-system";
import { buildVoxelBox } from "./build/voxel-box";
import { registerTrackballControl } from "./control/trackball";
import { registerGui } from "./gui";



export function initCellvis(containerElem
                            , voxelData
                            , voxelDimensions
                            , zScaler
                            , metaData
                            , vertexShader
                            , fragmentShader) {
  function AppData() {
    // Development sate
    this.xNormal = 0;
    this.yNormal = 0;
    this.zNormal = 1;
    this.test = 0.5;
    // Production state
    this.ambient = Math.E;
    this.begSlice = 0;
    this.endSlice = voxelDimensions[2];
  }
  let appData = new AppData();

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
  /// Append canvas

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
  camera.position.z = 2.6;
  // camera.rotation.x += Math.PI;
  // camera.rotation.y += Math.PI;

  const viewBoxGeo = new BoxBufferGeometry(2, 2, 2);
  const volTexture = ImageUtils.loadTexture( "/img/voxeldata/generated-4.png");
  volTexture.minFilter = NearestFilter;
  const uniforms = {
    voxelSize: {value: 1.0}
    , globalTime: {value: Date.now()}
    , begSlice: {type: "i", value: 1}
    , endSlice: {type: "i", value: voxelDimensions[2] + 1}
    , sliceUvRatio: {value: 1.0/voxelDimensions[2]}
    , sliceDistance: {value: 2 / voxelDimensions[2]}
    , discardThreshold: {value: 0.3}
    , ambient: { value: appData.ambient }
    , rayV: {type: "3fv", value: new Vector3(
      appData.xNormal
      , appData.yNormal
      , appData.zNormal)}
    , volTexture: { type: "t", value: volTexture }
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
      // x, EMISSION_MODEL: ""
      //, MAXIMUM_INTENSITY_MODEL: ""
      , ADDITIVE_MODEL: ""
      , EMISSION_ABSORTION_MODEL: ""
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
    let matUniforms = displayBox.material.uniforms;
    let time = Date.now() / 2000;
    // update shader
    uniforms.globalTime =
      {value: appData.test};
    uniforms.ambient =
      {value: Math.log(appData.ambient)};
    uniforms.rayV.value =
      new Vector3(
        appData.xNormal
        , appData.yNormal
        , appData.zNormal
      );
    uniforms.begSlice.value = appData.begSlice;
    uniforms.endSlice.value = appData.endSlice;
  }

  registerGui(appData, voxelDimensions, render);

  const controls = registerTrackballControl(
    camera
    , render
    , renderer);


  function animate() {
    requestAnimationFrame(animate);
    // Only re-render on control events
    controls.update();

  }

  // render initial frame
  render();
  animate();
}
