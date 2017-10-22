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
  , Vector3
  , Color
  , VertexColors
  , PerspectiveCamera
  , Geometry
  , Points
  , PointsMaterial
  , AdditiveBlending
} from "three";
// internal
import { scaleInCubeScaler } from "./geometry-utils";
import { optimalParticleSize } from "./particle-utils";
import { registerTrackballControl } from "./control/trackball";

function voxelWalker(voxelData, size, scaler, geometry) {
  const [x_size, y_size, z_size] = size;
  for (let z = 0; z < z_size; z++) {
    for (let y = 0; y < y_size; y++) {
      for (let x = 4; x < x_size * 4; x += 4) {
        // build geometry
        let vertex = new Vector3(
          x / 4 * scaler
          , y * scaler
          , z * scaler);
        geometry.vertices.push(vertex);
        // assign vertex colors
        let pos = z * y_size * x_size + y * x_size + x;
        let r = voxelData[pos-4];
        let g = voxelData[pos-3];
        let b = voxelData[pos-2];
        let a = voxelData[pos-1];
        let colorStr = `rgb(${r}, ${g}, ${b})`;
        let color = new Color(colorStr);
        geometry.colors.push(color);
      }
    }
  }
  console.log(geometry);
  return geometry;
}

export function initCellvis(containerElem, voxelData, voxelDimensions, metaData) {
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
  const camera =
    new PerspectiveCamera( 75, canvasRatio , 0.1, 1000);
  camera.name = "p-camera";
  camera.position.x = 50;
  camera.position.y = 50;
  camera.position.z = 120;
  // Stack setup
  /// Calculate constants
  const inCubeScaler = scaleInCubeScaler(100, voxelDimensions);
  const geoSize =  map(multiply(inCubeScaler), voxelDimensions);
  const particleSize = optimalParticleSize(voxelDimensions, geoSize);
  console.log("p-szie", particleSize);
  const stackGeometry = new Geometry();
  console.log(inCubeScaler, particleSize);
  voxelWalker(
    voxelData
    , voxelDimensions
    , inCubeScaler
    , stackGeometry
  );
  const particleMaterial =
    new PointsMaterial({
      color: 0x6fa2ff
      , size: particleSize
      , lights: false
      , vertexColors: VertexColors
      , transparent: true
      , blending: AdditiveBlending
    });
  const particleSystem =
        new Points(stackGeometry, particleMaterial);
  // particleSystem.sortP
  // Populate Scene
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
