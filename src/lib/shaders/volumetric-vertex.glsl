varying vec2 vUv;
uniform float globalTime;
varying float time;
uniform sampler2D volTexture;

void main() {
  vUv = uv;
  time = globalTime;
  gl_Position =
    projectionMatrix
    * modelViewMatrix
    * vec4(position,1.0);
}
