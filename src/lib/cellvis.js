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
import { registerOrthoControls } from "./control/ortho";
import { registerGui } from "./gui";
import { cuboidNormalizer } from "./math/geo";
import { rgbArrToHex } from "./color-utils";


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
    this.debug1 = 1;
    this.debug10 = 10;
    this.debug200 = 200;
    // Production state
    this.bgColor = 0x000000;
    this.ambient = Math.E;
    this.zInterpolation = true;
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
  const scene = new Scene();
  scene.background = new Color(appData.bgColor);
  const renderer = new WebGLRenderer();
  renderer.setSize(canvasWidth, canvasHeight);
  /// Adapt to displays with different pixel densities
  renderer.setPixelRatio(devicePixelRatio);
  /// Append canvas
  containerElem.appendChild(renderer.domElement);
  const axes = new AxisHelper(20);
  // const camera =
  //   new PerspectiveCamera( 75, canvasRatio , 0.1, 3000);
  const screenSpace = cuboidNormalizer([canvasWidth, canvasHeight]);
  console.log(screenSpace);
  const camera = new OrthographicCamera(
      -2 * screenSpace[0]
    ,  2 * screenSpace[0]
    ,  2 * screenSpace[1]
    , -2 * screenSpace[1]
    , 1
    , 15
  );
  camera.name = "p-camera";
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 5;
  // camera.rotation.x += Math.PI;
  // camera.rotation.y += Math.PI;

  const viewBoxGeo = new BoxBufferGeometry(2, 2, 2);
  const volumetricScale = cuboidNormalizer(voxelDimensions);
  const volTexture = ImageUtils.loadTexture( "/img/voxeldata/mock-img-stack.png");
  volTexture.minFilter = NearestFilter;
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
    , volumetricScale: { type: "3fv", value: new Vector3(
      volumetricScale[0]
      ,volumetricScale[1]
      ,volumetricScale[2] * zScaler)}
    , sliceUvRatio: {value: 1.0/voxelDimensions[2]}
    , sliceDistance: {value: 2 / voxelDimensions[2]}
    , discardThreshold: {value: 0.3}
    , ambient: { value: appData.ambient }
    , zInterpolation: { type: "b", value: appData.zInterpolation }
    , rayV: {type: "3fv", value: camera.position}
    , rayVn: {type: "3fv", value:
              new Vector3()
              .copy(camera.position)
              .normalize()
              .negate()
             }
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
    // console.log(
    //   camera.position
    //   , Math.atan(camera.position.x / camera.position.z));
    renderer.render(scene, camera);
    let matUniforms = displayBox.material.uniforms;
    // update shader
    uniforms.debug1.value = appData.debug1;
    uniforms.debug10.value = appData.debug10;
    uniforms.debug200.value = appData.debug200;
    uniforms.ambient =
      {value: Math.log(appData.ambient)};
    uniforms.zInterpolation.value = appData.zInterpolation;
    uniforms.rayV.value = camera.position;
    uniforms.rayVn.value =
      new Vector3()
      .copy(camera.position)
      .normalize()
      .negate();
    uniforms.begSliceX.value = appData.begSliceX;
    uniforms.endSliceX.value = appData.endSliceX;
    uniforms.begSliceY.value = appData.begSliceY;
    uniforms.endSliceY.value = appData.endSliceY;
    uniforms.begSliceZ.value = appData.begSliceZ;
    uniforms.endSliceZ.value = appData.endSliceZ;
  }

  registerGui(appData, voxelDimensions, render);
  registerOrthoControls(camera
                        , renderer.domElement
                        , 1
                        , 5
                        , {render: render});

  // const controls = registerTrackballControl(
  //   camera
  //   , render
  //   , renderer);


  function animate() {
    requestAnimationFrame(animate);
    // Only re-render on control events
    //controls.update();

  }

  // render initial frame
  render();
  animate();
}
