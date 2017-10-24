import
{ Scene
  , Color
  , Geometry
} from "three";

export function buildGeometry(voxelGenerator) {
  const geo = new Geometry();
  for (let voxel of voxelGenerator) {
    geo.vertices.push(voxel[0]);
    geo.colors.push(voxel[1]);
  }
  return geo;
}
