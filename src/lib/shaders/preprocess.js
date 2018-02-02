// contains functions for one calcuation per frame or scene cases.
import { Vector3, Matrix4, WebGLRenderer } from "three";
import { cuboidNormalizer } from "/lib/math/geo.js";

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

export function raydzDistortionCorrection(ray, zScaler) {
  ray.x *= zScaler;
  ray.y *= zScaler;
  return ray;
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

// TODO Ask to Three.js developers to expose thei clamipng function.
export function clampToMaxSize( voxelDimensions, zScaler) {
  const renderer = new WebGLRenderer();
  const maxSize = renderer.capabilities.maxTextureSize;

  const imgWidht = voxelDimensions[0];
  const imgHeight = voxelDimensions[1] * voxelDimensions[2];

  let changed = false;
  if ( imgWidht > maxSize || imgHeight > maxSize ) {
    changed = true;
    const scale = maxSize / Math.max( imgWidht, imgHeight );
    voxelDimensions[0] = Math.floor( voxelDimensions[0] * scale );
    voxelDimensions[1] = Math.floor( voxelDimensions[1] * scale );
    zScaler = scale * zScaler;
  }
  return {voxelDimensions: voxelDimensions
          , zScaler: zScaler
          , changed: changed};

}
