uniform float globalTime;
uniform float sliceDistance;
uniform sampler2D volTexture;
uniform float ambient;
uniform vec2 rayV;

varying vec2 vUv;
varying float time;
varying vec3 pos;

void main() {
  vUv = uv;
  time = globalTime;
  pos = position;
  gl_Position =
    projectionMatrix
    * modelViewMatrix
    * vec4(position,1.0);
}
