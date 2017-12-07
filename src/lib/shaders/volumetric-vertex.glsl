uniform float sliceUvRatio;
uniform vec3 volumetricScale;

uniform float debug1;
uniform float debug10;
uniform float debug200;

varying vec3 vUv;
varying vec3 pos;
varying mat3 scale;
varying mat4 modelView;
varying mat4 projection;
varying mat4 volumeScale;

void main() {
  modelView = modelViewMatrix;
  projection = projectionMatrix;

  volumeScale =
    mat4(volumetricScale.x, 0.0, 0.0, 0.0,
         0.0, volumetricScale.y, 0.0, 0.0,
         0.0, 0.0, volumetricScale.z, 0.0,
         0.0, 0.0, 0.0, 1.0
         );
  vUv = vec3(uv, 1.0);
  pos = position;
  scale = mat3(1.0, 0.0,          0.0,
               0.0, sliceUvRatio, 0.0,
               0.0, 0.0,          1.0);
  gl_Position =
    projectionMatrix
    * modelViewMatrix
    * volumeScale
    * vec4(position,1.0);
}
