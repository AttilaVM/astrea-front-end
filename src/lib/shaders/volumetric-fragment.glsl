varying vec3 vColor;

void main() {
  // gl_FragColor = vec4(0.4352, 0.6352, 1.0, 0.2);
  gl_FragColor = vec4(vColor, 1.0);
}
