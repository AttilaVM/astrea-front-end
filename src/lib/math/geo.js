import { map, apply, sum, divide, __ } from "ramda";

const cos = Math.cos;
const asin = Math.asin;
const tan = Math.tan;
const pow = Math.pow;
const sqrt = Math.sqrt;

export function pow2(x) {
  return pow(x, 2);
}

/**
 * Proportional scales a cuboid with arbietary dimension number such a way that its longest dimension will be one.
 * @param {array} cubeDims defines a cuboid by the sequence of its edge lengths
 * @return {array} scaled cuboid
 */
export function cuboidNormalizer(cubeDims) {
  const longestDim = apply(Math.max, cubeDims);
  return map(divide(__, longestDim), cubeDims);
}

export function geoLength(arr) {
  return sqrt(apply(sum
                    , map(pow2, arr)));
}

/**
 * Calculate polar coordinates from 3D cartesian coordinates
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @return {array.<Number>} alpha, beta angles and scale
 */
export function cartesianToPolar3(x, y, z) {
  const s = geoLength([x, y, z]);
  const [x_n, y_n, z_n] = cuboidNormalizer([x, y, z]);
  const b = asin(z_n);
  let a;
  if (y_n >= 0)
    a = asin(x_n / cos(b));
  else
    a = PI - asin(x_n / cos(b));
  return [a, b, s];
}
