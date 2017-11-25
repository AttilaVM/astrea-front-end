uniform float sliceUvRatio;

uniform float debug1;
uniform float debug10;
uniform float debug200;

varying vec3 vUv;
varying vec3 pos;
varying mat3 scale;

void main() {
  vUv = vec3(uv, 1.0);
  pos = position;
  scale = mat3(1.0, 0.0,          0.0,
               0.0, sliceUvRatio, 0.0,
               0.0, 0.0,          1.0);
  gl_Position =
    projectionMatrix
    * modelViewMatrix
    * vec4(position,1.0);
}
