import {
  apply
  , map
  , multiply
} from "ramda";
import{
  Scene
  , Color
  , VertexColors
  , Vector3
  , Geometry
  , Points
  , PointsMaterial
  , CustomBlending
  , MaxEquation
} from "three";
// Internal
import { scaleInCubeScaler } from "/lib/utils/geometry.js";
import { optimalParticleSize } from "/lib/utils/particle.js";

function getColor(pos, rgbaArr) {
  let r = rgbaArr[pos];
  let g = rgbaArr[pos + 1];
  let b = rgbaArr[pos + 2];
  let a = rgbaArr[pos + 3];
  let colorStr = `rgb(${r}, ${g}, ${b})`;
  return new Color(colorStr);
}

/**
 * Populate given geometry (geo) with vertices extracted from the image-data (rgbaArr) of a stack image represented as a vertical montage of its Z-slices.
 * For better performance it also handles the initial transformations of the voxel geometry.
 * @param {Uint8Array} rgbaArr
 * @param {Array} szie x, y and z scales of the stack
 * @param {Number} scaler to scale the voxels into a bounding box
 * @param {Number} zScaler to fix z distortion.
 * @return  {Object} which "vertices" and "colors" property array are populate with the voxel coordinates and colors.
 */
function voxelBuilder(
  rgbaArr
  , size
  , scaler
  , zScaler
  , geo
  , vColorP) {
  const [x_size, y_size, z_size] = size;
  let x, y, z;
  x = y = z = 0;
  for (let pos = 0; pos < rgbaArr.length; pos += 4) {
    // Calculate voxel coordinates
    if (x == x_size) {
      y++;
      x = 0;
      if (y == y_size) {
        z++;
        y = 0;
      }
    }
    let coordinates = new Vector3(
        x * scaler
      , y * scaler
      , z * scaler * zScaler
    );
    geo.vertices.push(coordinates);
    if (vColorP) {
      let color = getColor(pos, rgbaArr);
      geo.colors.push(color);
    }
    x++;
  };
  return geo;
}


export function buildParticleSystem(
  voxelData
  , voxelDimensions
  , zScaler
) {
  /// Calculate constants
  const inCubeScaler = scaleInCubeScaler(100, voxelDimensions);
  const boundingBoxSize =
        map(multiply(inCubeScaler), voxelDimensions);
  const particleSize =
        optimalParticleSize(voxelDimensions, boundingBoxSize);
  let geo = new Geometry();
  let stackGeometry = new Geometry();
  voxelBuilder(
    voxelData
    , voxelDimensions
    , inCubeScaler
    , zScaler
    , stackGeometry);
  console.log(stackGeometry);
  const particleMaterial =
    new PointsMaterial({
      color: 0x6fa2ff
      , size: particleSize
      , lights: false
      , vertexColors: VertexColors
      , transparent: true
      , blending: CustomBlending
      , depthWrite: false
    });
  particleMaterial.blendEquation = MaxEquation;
  const particleSystem =
        new Points(stackGeometry, particleMaterial);
  return particleSystem;
}
