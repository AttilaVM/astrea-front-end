varying vec2 vUv;

varying float time;
uniform float sliceUvRatio;

uniform sampler2D volTexture;

// The most simpliest method to calculate normalized color intensity

// vec4 rayCast(vec3 rayV, ) {

// }

float calcColorIntensity(vec4 c) {
  return (c.r + c.g + c.b) / 3.0 * c.a;
}

void main() {
  // gl_FragColor = vec4(vUv, 0.0, 0.2);
  // gl_FragColor = vec4(0.4352, 0.6352, 1.0, 0.2);
  // mat2 T = mat2(1.0, 0.0,
  //               0.0, 1.0/Z_SIZE);
  // gl_FragColor = texture2D(
  //                          volTexture
  //                          , T * vUv + vec2(0.0, 4.0/Z_SIZE)
  //                          );
  vec4 fColor = vec4(0.0, 0.0, 0.0, 0.0);
  for (int i = 0; i < SLICE_NUM; i++) {
    mat2 T = mat2(1.0, 0.0,
                  0.0, sliceUvRatio);
    vec4 sColor =
      texture2D(volTexture
                , T * vUv + vec2(0.0, float(i)/Z_SIZE));
    // Compare intensities
    float fIntensity = calcColorIntensity(fColor);
    float sIntensity = calcColorIntensity(sColor);
    if (sIntensity > fIntensity) {
      fColor = sColor;
    }
  }

  gl_FragColor = vec4(0.0
                      , 0.0
                      , (sin(time) + 1.0) / 2.0
                      // , time / 10000000000000.0
                      , 0.0);
}
