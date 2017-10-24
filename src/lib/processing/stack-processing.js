import 'babel-polyfill';
import
{ Scene
  , Vector3
  , Color
} from "three";

/**
 *
 * TODO: maybe incremeting over dimensions with modular congrounce checking would be faster
 * @param {Uint8Array} rgbaArr
 * @param {Array} szie x, y and z scales of the stack
 * @param {Number} scaler to scale the output voxels coordinates
 * @return  {Iterable.<array>} [coordinates, colors]
 */
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

export function voxelBuilder(rgbaArr, size, scaler, geo) {
  const [x_size, y_size, z_size] = size;
  for (let z = 0; z < z_size; z++) {
    for (let y = 0; y < y_size; y++) {
      for (let x = 3; x < x_size * 4; x += 4) {
        // if (1 === z)
        //   return geo;
        // build geometry
        let coordinates = new Vector3(
          (x + 1) / 4 * scaler
          , y * scaler
          , z * scaler);
        // assign vertex colors
        let pos = z * y_size * x_size * 4 + y * x_size * 4 + x;
        // console.log(pos);
        let r = rgbaArr[pos-3];
        let g = rgbaArr[pos-2];
        let b = rgbaArr[pos-1];
        let a = rgbaArr[pos];
        let colorStr = `rgb(${r}, ${g}, ${b})`;
        let color = new Color(colorStr);
        // update geometry
        // console.log((x + 1) / 4, y, r, pos);
        geo.vertices.push(coordinates);
        geo.colors.push(color);
      }
    }
  };
  return geo;
}
