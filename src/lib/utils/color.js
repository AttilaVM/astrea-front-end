export function numToRgbArr(color) {
  const r = Math.floor(color / Math.pow(256, 2));
  const res = color % Math.pow(256, 2);
  const g = Math.floor(res / 256);
  const b = res % 256;
  return [r, g, b];
}
