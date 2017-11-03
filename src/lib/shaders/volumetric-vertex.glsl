varying vec3 vColor;

void main() {
  #include <color_vertex>
  // vColor = color;
  gl_Position =
    projectionMatrix
    * modelViewMatrix
    * vec4(position,1.0);
}
