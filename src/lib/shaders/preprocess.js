// contains functions for one calcuation per frame or scene cases.
import { Vector3, Matrix4 } from "three";
import { cuboidNormalizer } from "../math/geo";

const uHat = new Vector3(1, 0, 0);
const vHat = new Vector3(0, 1, 0);
const kHat = new Vector3(0, 0, 1);

const abs = Math.abs;
const floor = Math.floor;

// per frame

export function maxTraceLength(rayV, voxelDimensions) {
  return (abs(uHat.dot(rayV)) * voxelDimensions[0]
          + abs(vHat.dot(rayV)) * voxelDimensions[1]
          + abs(kHat.dot(rayV)) * voxelDimensions[2]) / 3;
}

// per scene

export function calcVolumeScale(voxelDimensions, zScaler) {
  const volumeScale = cuboidNormalizer(voxelDimensions);
  return new Matrix4().set(
    volumeScale[0], 0.0, 0.0, 0.0,
    0.0, volumeScale[1], 0.0, 0.0,
    0.0, 0.0, volumeScale[2] * zScaler, 0.0,
    0.0, 0.0, 0.0, 1.0);

}
