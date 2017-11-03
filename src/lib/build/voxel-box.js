import {
  apply
  , map
  , multiply
} from "ramda";
import
{ Scene
  , Color
  , VertexColors
  , Geometry
  , Mesh
  , ShaderMaterial
  , MeshBasicMaterial
  , CustomBlending
  , DoubleSide
  , MaxEquation
  // debug
  , BoxGeometry
  , Points

} from "three";
// Internal
import { attachVoxelFaces , dummyTriangleGeom } from "./general-builder";
import { scaleInCubeScaler } from "../geometry-utils";
import { optimalParticleSize } from "../particle-utils";
import { voxelBuilder } from "../processing/stack-processing.js";
import { createCostumShader } from "../shaders/costum-shader";


export function buildVoxelBox(
  voxelData
  , voxelDimensions
  , zScaler
  , vertexShader
  , fragmentShader
) {
  /// Calculate constants
  const inCubeScaler = scaleInCubeScaler(100, voxelDimensions);
  const boundingBoxSize =
        map(multiply(inCubeScaler), voxelDimensions);
  let geo = new Geometry();
  let stackGeometry = new Geometry();
  voxelBuilder(
    voxelData
    , voxelDimensions
    , inCubeScaler
    , zScaler
    , stackGeometry
    , false);
  attachVoxelFaces(voxelDimensions, stackGeometry, voxelData);
  // stackGeometry.computeFaceNormals();
  console.log(stackGeometry);
  // Instanciate costum material
  const uniforms = {
    voxelSize: {value: 1.0}
    , discardThreshold: {value: 0.3}
  };
  // const volumetricMaterial = new ShaderMaterial({
  //   uniforms: uniforms
  //   , vertexShader: vertexShader
  //   , fragmentShader: fragmentShader
  //   , vertexColors: VertexColors
  //   , side: DoubleSide
  //   , depthWrite: false
  //   , blending: CustomBlending
  // });
  const volumetricMaterial = new MeshBasicMaterial({
    color: 0xff0000
    , wireframe: false
    , lights: false
    , vertexColors: VertexColors
    , transparent: true
    , blending: CustomBlending
    , depthWrite: false
    , side: DoubleSide
  });
  volumetricMaterial.blendEquation = MaxEquation;
  const voxelBox =
        new Mesh(stackGeometry, volumetricMaterial);
  return voxelBox;
}
