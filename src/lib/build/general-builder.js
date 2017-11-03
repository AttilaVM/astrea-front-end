import
{ Scene
  , Color
  , Geometry
  , Vector3
  , Face3
} from "three";
import { getColor } from "../processing/stack-processing.js";

const FACE_KEYS = ["a", "b", "c"];

function colorizeFace(face, voxelData) {
  for (var i = 0; i < 3; i++) {
    let pos = face[FACE_KEYS[i]] * 4; // R color position
    face.vertexColors[i] = getColor(pos, voxelData);
  }
};

export function buildGeometry(voxelGenerator) {
  const geo = new Geometry();
  for (let voxel of voxelGenerator) {
    geo.vertices.push(voxel[0]);
    geo.colors.push(voxel[1]);
  }
  return geo;
}

export function attachVoxelFaces(size, geom, voxelData) {
  const [x_size, y_size, z_size] = size;
  let x, y, z;
  x = y = z = 0;
  for (let pos = 0; pos < geom.vertices.length; pos++) {
    // Calculate voxel coordinates
    if (x == x_size) {
      y++;
      x = 0;
      console.log(x, y);
      if (y == y_size) {
        z++;
        console.log(x, y, z);
        y = 0;
      }
    }
    if (x < x_size - 1){
      // XY plane
      if (y < y_size - 1) {
        let face1 = new Face3(
          pos
          , pos + 1
          , pos + x_size);
        let face2 = new Face3(
          pos + 1 + x_size
          , pos + x_size
          , pos + 1);
        colorizeFace(face1, voxelData);
        colorizeFace(face2, voxelData);
        geom.faces.push(face1);
        geom.faces.push(face2);
      }
      // XZ plane
      if (z < z_size - 1) {
        let face1 = new Face3(pos
                              , pos + 1
                              , pos + x_size * y_size);
        let face2 = new Face3(pos + x_size * y_size + 1
                             , pos + x_size * y_size
                              , pos + 1);
        colorizeFace(face1, voxelData);
        colorizeFace(face2, voxelData);
        geom.faces.push(face1);
        geom.faces.push(face2);
      }
    }
    // YZ plane
    if (y < y_size - 1 && z < z_size - 1) {
      let face1 = new Face3(
        pos
        , pos + x_size
        , pos + x_size * y_size);
      let face2 = new Face3(
        pos + x_size * y_size + x_size
        , pos + x_size
        , pos + x_size * y_size);

      colorizeFace(face1, voxelData);
      colorizeFace(face2, voxelData);
      geom.faces.push(face1);
      geom.faces.push(face2);
    }
    x++;
  }
}

export function dummyTriangleGeom() {
  let geom = new Geometry();
  let v1 = new Vector3(0,0,10);
  let v2 = new Vector3(0,50,10);
  let v3 = new Vector3(50,50,10);

  geom.vertices.push(v1);
  geom.vertices.push(v2);
  geom.vertices.push(v3);
  geom.faces.push( new Face3( 0, 1, 2 ) );
  geom.computeFaceNormals();
  return geom;
}
