import { apply
         , map
         , multiply
       } from "ramda";
import
{ Scene
  , Color
  , VertexColors
  , Geometry
  , Points
  , ShaderMaterial
  , CustomBlending
  , MaxEquation
} from "three";
// Internal
import { buildGeometry } from "./general-builder";
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
  voxelBuilder(voxelData
               , voxelDimensions
               , inCubeScaler
               , zScaler
               , stackGeometry);
  // Instanciate costum material
  const uniforms = {
    voxelSize: {value: 1.0}
    , discardThreshold: {value: 0.3}
  };
  const volumetricMaterial = new ShaderMaterial({
    uniforms: uniforms
    , vertexShader
    , fragmentShader
  });
  const voxelBox =
        new Points(stackGeometry, volumetricMaterial);
  return voxelBox;
}
