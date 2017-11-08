uniform float globalTime;
uniform float sliceDistance;
uniform sampler2D volTexture;
uniform float ambient;
uniform vec3 rayV;
uniform int begSlice;
uniform int endSlice;

varying vec3 vUv;
varying float time;
varying vec3 pos;

void main() {
  vUv = vec3(uv, 1.0);
  time = globalTime;
  pos = position;
  gl_Position =
    projectionMatrix
    * modelViewMatrix
    * vec4(position,1.0);
}
