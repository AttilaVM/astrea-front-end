uniform float sliceUvRatio;
uniform vec3 volumetricScale;
uniform mat4 volumeScaleMatrix;

uniform float debug1;
uniform float debug10;
uniform float debug200;

varying vec3 pos;

void main() {
  pos = position;
  gl_Position =
    projectionMatrix
    * modelViewMatrix
    * volumeScaleMatrix
    * vec4(position,1.0);
}
