import { apply } from "ramda";

export function scaleInCubeScaler(a, size) {
  const longestDimension = apply(Math.min, size);
  return a / longestDimension;
}
