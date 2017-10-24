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
  , PointsMaterial
  , CustomBlending
  , MaxEquation
} from "three";
// Internal
import { buildGeometry } from "./general-builder";
import { scaleInCubeScaler } from "../geometry-utils";
import { optimalParticleSize } from "../particle-utils";
import { voxelBuilder } from "../processing/stack-processing.js";


export function buildParticleSystem(voxelData
                                    , voxelDimensions
                                   ) {
  /// Calculate constants
  const inCubeScaler = scaleInCubeScaler(100, voxelDimensions);
  const boundingBoxSize =
        map(multiply(inCubeScaler), voxelDimensions);
  const particleSize =
        optimalParticleSize(voxelDimensions, boundingBoxSize);
  let geo = new Geometry();
  let stackGeometry = new Geometry();
  voxelBuilder(voxelData
               , voxelDimensions
               , inCubeScaler
               , stackGeometry);
  console.log(stackGeometry);
  const particleMaterial =
    new PointsMaterial({
      color: 0x6fa2ff
      , size: particleSize
      , lights: false
      , vertexColors: VertexColors
      , transparent: true
      , blending: CustomBlending
      , depthWrite: false
    });
  particleMaterial.blendEquation = MaxEquation;
  const particleSystem =
        new Points(stackGeometry, particleMaterial);
  return particleSystem;
}
