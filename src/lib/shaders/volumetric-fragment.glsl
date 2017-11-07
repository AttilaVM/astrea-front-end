#define FRONT_PLANE 1
#define TOP_PLANE 2
#define BACK_PLANE 3
#define BOT_PLANE 4
#define LEFT_PLANE 5
#define RIGHT_PLANE 6
#define NOT_ON_CANONIC_VIEW -1

uniform float sliceUvRatio;
uniform sampler2D volTexture;
uniform float sliceDistance;
uniform float ambient;
uniform vec2 rayV;

varying vec2 vUv;
varying float time;
varying vec3 pos;

// The most simpliest method to calculate normalized color intensity
int planeDetect(vec3 pos) {
  if (pos.y == 1.0) {
    return FRONT_PLANE;
  }
  else if (pos.z == 1.0) {
    return TOP_PLANE;
  }
  else if (pos.y == -1.0) {
    return BACK_PLANE;
  }
  else if (pos.z == -1.0) {
    return BOT_PLANE;
  }
else if (pos.x == -1.0) {
    return LEFT_PLANE;
  }
else if (pos.x == 1.0) {
    return RIGHT_PLANE;
  }
  return NOT_ON_CANONIC_VIEW;
}

vec2 paralaxisOffset(int sliceStep) {
  // TODO: it should be handeld as a vec2
  float zDistance = sliceDistance * float(sliceStep);
  float xAngle = atan(rayV.x / 1.0);
  float yAngle = atan(rayV.y / 1.0);
  float xOffset = tan(xAngle) * zDistance;
  float yOffset = tan(yAngle) * zDistance;
  return vec2(xOffset, yOffset);
}

float calcColorIntensity(vec4 c) {
  return (c.r + c.g + c.b) / 3.0 * c.a;
}

void main() {
  vec4 fColor = vec4(0.0, 0.0, 0.0, 0.0);
  for (int i = 0; i < SLICE_NUM; i++) {
    // TODO: This should be a uniform
    mat2 T = mat2(1.0, 0.0,
                  0.0, sliceUvRatio);
    vec2 sliceOffset = vec2(0.0, float(i)/Z_SIZE);
    vec2 paralaxisOffset = paralaxisOffset(i);
    vec2 paralaxisTranslation = sliceOffset + paralaxisOffset;
    vec4 sColor =
      texture2D(volTexture
                , T * vUv
                + paralaxisTranslation
                );
#if defined( MAXIMUM_INTENSITY_MODEL )
    float fIntensity = calcColorIntensity(fColor);
    float sIntensity = calcColorIntensity(sColor);
    if (sIntensity > fIntensity) {
      fColor = sColor;
    }
#endif

#if defined ( ADDITIVE_MODEL )
    fColor =
      ambient * sliceUvRatio * fColor
      + ambient * sliceUvRatio * sColor;
#endif
    // switch statement is not yet supported in every
    // implementations
    int planeType = planeDetect(pos);
    if (planeType == FRONT_PLANE)
      fColor = vec4(1.0, 0.0, 0.0, 1.0);
    else if (planeType == TOP_PLANE)
      fColor = vec4(0.0, 1.0, 0.0, 1.0);
    else if (planeType == BACK_PLANE)
      fColor = vec4(0.0, 0.0, 1.0, 1.0);
    else if (planeType == BOT_PLANE)
      fColor = vec4(0.0, 1.0, 1.0, 1.0);
    else if (planeType == LEFT_PLANE)
      fColor = vec4(1.0, 0.0, 1.0, 1.0);
    else if (planeType == RIGHT_PLANE)
      fColor = vec4(1.0, 1.0, 0.0, 1.0);

    else
      fColor = vec4(0.0);
 };

  gl_FragColor = fColor;
  // gl_FragColor = vec4(pos.x
  //                     , pos.y
  //                     , pos.z
  //                     , 1.0
  //                     );
  // gl_FragColor = vec4(rayV, 1.0);
  // gl_FragColor = vec4(0.0
  //                     , 0.0
  //                     , (sin(time) + 1.0) / 2.0
  //                     // , time / 10000000000000.0
  //                     , 0.0);
}
