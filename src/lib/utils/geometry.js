import { apply } from "ramda";

export function scaleInCubeScaler(a, size) {
  const longestDimension = apply(Math.max, size);
  return a / longestDimension;
}
