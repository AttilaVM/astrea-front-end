uniform float debug1;
uniform float debug10;
uniform float debug200;

varying vec3 vUv;
varying vec3 pos;

void main() {
  vUv = vec3(uv, 1.0);
  pos = position;
  gl_Position =
    projectionMatrix
    * modelViewMatrix
    * vec4(position,1.0);
}
