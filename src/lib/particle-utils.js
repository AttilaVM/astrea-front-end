import { apply } from "ramda";

export function optimalParticleSize(voxelSize, geometrySize) {
  const shortesGeoDimension = apply(Math.min, geometrySize);
  const shortesVoxelDimension = apply(Math.min, voxelSize);
  return shortesGeoDimension / shortesVoxelDimension;
}
