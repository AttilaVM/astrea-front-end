import 'babel-polyfill';
import
{ Scene
  , Vector3
  , Color
} from "three";

export function getColor(pos, rgbaArr) {
  let r = rgbaArr[pos];
  let g = rgbaArr[pos + 1];
  let b = rgbaArr[pos + 2];
  let a = rgbaArr[pos + 3];
  let colorStr = `rgb(${r}, ${g}, ${b})`;
  return new Color(colorStr);
}

export function VoxelGenerator(rgbaArr, size, scaler) {
  const [x_size, y_size, z_size] = size;
  const iterable = {};
  iterable[Symbol.iterator] = function* () {
    for (let z = 0; z < z_size; z++) {
      for (let y = 0; y < y_size; y++) {
        for (let x = 3; x < x_size * 4; x += 4) {
          // build geometry
          let coordinates = new Vector3(
            x / 4 * scaler
            , y * scaler
            , z * scaler);
          // assign vertex colors
          let pos = z * y_size * x_size + y * x_size + x;
          let r = rgbaArr[pos-4];
          let g = rgbaArr[pos-3];
          let b = rgbaArr[pos-2];
          let a = rgbaArr[pos-1];
          let colorStr = `rgb(${r}, ${g}, ${b})`;
          let color = new Color(colorStr);
          yield [coordinates, color];
        }
      }
    }
  };
  return iterable;
}

/**
 * Populate given geometry (geo) with vertices extracted from the image-data (rgbaArr) of a stack image represented as a vertical montage of its Z-slices.
 * For better performance it also handles the initial transformations of the voxel geometry such as scaling it in a bounding box using the scaler variable, fixing Z-distortion usning zScaler and translating its center of mass to the global origin.
 * @param {Uint8Array} rgbaArr
 * @param {Array} szie x, y and z scales of the stack
 * @param {Number} scaler to scale the voxels into a bounding box
 * @param {Number} zScaler to fix z distortion.
 * @return  {Object} which "vertices" and "colors" property array are populate with the voxel coordinates and colors.
 */
export function voxelBuilder(
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
        x * scaler //- 50
      , y * scaler //- 50
      , z * scaler * zScaler // - 50
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
