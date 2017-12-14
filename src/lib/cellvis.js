// external
import { apply
         , reduce
         , map
         , multiply
       } from "ramda";
// import dat from "../../submodules/dat.gui/index";
import
{ Scene
  , WebGLRenderer
  , Vector3
  , Color
  , PerspectiveCamera
  , OrthographicCamera
  , AxisHelper
  , BoxBufferGeometry
  , VertexColors
  , DoubleSide
  , CustomBlending
  , TextureLoader
  , ShaderMaterial
  , Mesh
  , NearestFilter
} from "three";
// internal
import { VoxelGenerator } from "./processing/stack-processing.js";
import { fetchFiles } from "./image_loader";
import { scaleInCubeScaler } from "./geometry-utils";
import { buildParticleSystem } from "./build/particle-system";
import { buildVoxelBox } from "./build/voxel-box";
import { registerTrackballControl } from "./control/trackball";
import { registerOrthoControls } from "./control/ortho";
import { registerGui, optionMap } from "./gui";
import { cuboidNormalizer } from "./math/geo";
import { maxTraceLength, calcVolumeScale, clampToMaxSize } from "./shaders/preprocess.js";

// state
const textureLoader = new TextureLoader();
export function initCellvis(containerElem
                            , voxelData
                            , vertexShader
                            , fragmentShader) {
  appDispatcher.renderStart();
  // Extract voxel data
  const voxelSrc = voxelData.voxelSrc;
  const voxelDimensions = voxelData.scale;
  const zScaler = voxelData.zScaler;
  const metaData = voxelData.metaData;


  function AppData() {
    // Development sate
    this.debug1 = 1;
    this.debug10 = 10;
    this.debug200 = 200;
    // Production state
    this.zScaler = zScaler;
    this.bgColor = 0x000000;
    this.ambient = Math.E;
    this.interpolation = "linear";
    this.begSliceX = 0;
    this.endSliceX = voxelDimensions[0];
    this.begSliceY = 0;
    this.endSliceY = voxelDimensions[1];
    this.begSliceZ = 0;
    this.endSliceZ = voxelDimensions[2];
  }
  let appData = new AppData();


  let canvasWidth = containerElem.offsetWidth;
  let canvasHeight = containerElem.offsetHeight;
  let canvasRatio = canvasWidth / canvasHeight;
  // Basic scene setup
  const renderer = new WebGLRenderer();

  let volTexture;
  if (typeof(voxelSrc) === "string")
    volTexture = textureLoader.load(voxelSrc);

  volTexture.minFilter = NearestFilter;

  renderer.setSize(canvasWidth, canvasHeight);
  /// Adapt to displays with different pixel densities
  renderer.setPixelRatio(devicePixelRatio);

  const scene = new Scene();
  scene.background = new Color(appData.bgColor);
  /// Append canvas
  containerElem.appendChild(renderer.domElement);
  const axes = new AxisHelper(20);
  // const camera =
  //   new PerspectiveCamera( 75, canvasRatio , 0.1, 3000);
  const screenSpace = cuboidNormalizer([canvasWidth, canvasHeight]);
  const camera = new OrthographicCamera(
    -2 * screenSpace[0]
    ,  2 * screenSpace[0]
    ,  2 * screenSpace[1]
    , -2 * screenSpace[1]
    , 0.01
    , 25
  );
  camera.name = "main-camera";
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 5;

  const viewBoxGeo = new BoxBufferGeometry(2, 2, 2);

  const uniforms = {
    voxelSize: {value: 1.0}
    , debug1: {value: appData.debug1}
    , debug10: {value: appData.debug10}
    , debug200: {value: appData.debug200}
    , begSliceX: {type: "i", value: 1}
    , endSliceX: {type: "i", value: voxelDimensions[0] + 1}
    , begSliceY: {type: "i", value: 1}
    , endSliceY: {type: "i", value: voxelDimensions[1] + 1}
    , begSliceZ: {type: "i", value: 1}
    , endSliceZ: {type: "i", value: voxelDimensions[2] + 1}
    , volumeScaleMatrix: {
      type: "m4"
      , value: calcVolumeScale(
        voxelDimensions,
        zScaler)}
    , sliceUvRatio: {value: 1.0/voxelDimensions[2]}
    , sliceDistance: {value: 2 / voxelDimensions[2]}
    , discardThreshold: {value: 0.3}
    , ambient: { value: appData.ambient }
    , interpolation: {
      type: "i"
      , value: optionMap("interpolation" ,"linear")}
    , rayV: {type: "3fv", value:
             new Vector3()
             .copy(camera.position)}
    , rayVn: {type: "3fv", value:
              new Vector3()
              .copy(camera.position)
              .normalize()
              .negate()
             }
    , maxTraceLength: {value: voxelDimensions[2]}
    , v: {type: "3fv", value: new Vector3(
      voxelDimensions[0]
      , voxelDimensions[1]
      , voxelDimensions[2]
    )}
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
      , PI: 3.1415926535897932384626433832795
      , Y_SIZE: voxelDimensions[1] + ".0"
      , Z_SIZE: voxelDimensions[2] + ".0"
      , V_MAX:
      Math.ceil(
        Math.sqrt(
          reduce(
            function (v, c) {
              return c+v*v;
            }
            , 0
            , voxelDimensions)))
      , SLICE_NUM: voxelDimensions[2]
      , SLICE_UV_RATIO: 1 / voxelDimensions[2] + ".0"
    }

  });
  const displayBox = new Mesh(viewBoxGeo, volumetricMaterial);
  // Populate Scene
  scene.add(axes);
  scene.add(displayBox);
  scene.add(camera);

  function render() {
    renderer.render(scene, camera);
  }
  volTexture.image.onload = render;

  const guiEmitter = registerGui(
    appData
    , voxelDimensions
    , render);
  guiEmitter.addEventListener("change", function (e) {
    // special cases
    if (e.name == "zScaler") {
      uniforms.volumeScaleMatrix.value =
        calcVolumeScale(voxelDimensions, e.value);
      render();
      return;
    }
    else if(e.name == "interpolation") {
      uniforms[e.name].value = optionMap(e.name, e.value);
      render();
      return;
    }


    if (e.uniformP){
      if (e.transformFun)
        uniforms[e.name].value = e.transformFun(e.value);
      else
        uniforms[e.name].value = e.value;
    }
    render();
  });
  const camCtrlEmitter = registerOrthoControls(
    camera
    , renderer.domElement
    , 1
    , 5);

  camCtrlEmitter.addEventListener("rotate", function (e) {
    uniforms.rayV.value = camera.position; //e.sphericalPosition;
    uniforms.rayVn.value =
      e.sphericalPosition
      .normalize()
      .negate();

    uniforms.maxTraceLength.value = maxTraceLength(camera.position, voxelDimensions);

    render();

  });
  camCtrlEmitter.addEventListener("pan", function () {
    render();
  });
  camCtrlEmitter.addEventListener("zoom", function (e) {
    render();
  });

  appDispatcher.addEventListener(
    "downScale"
    , (voxelDimensions) => uniforms.v = new Vector3(
      voxelDimensions[0]
      , voxelDimensions[1]
      , voxelDimensions[2]
    ) );

  return function teardown() {
    containerElem.removeChild(renderer.domElement);
    guiEmitter.teardownGui();
    appDispatcher.renderStop();
  };
}
