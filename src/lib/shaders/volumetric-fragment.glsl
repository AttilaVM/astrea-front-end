#define FRONT_PLANE 1
#define TOP_PLANE 2
#define BACK_PLANE 3
#define BOT_PLANE 4
#define LEFT_PLANE 5
#define RIGHT_PLANE 6
#define NOT_ON_CANONIC_VIEW -1

uniform float sliceUvRatio;
uniform vec3 v;
uniform sampler2D volTexture;
uniform float sliceDistance;
uniform float ambient;
uniform bool zInterpolation;
uniform vec3 rayV;
uniform vec3 rayVn;
uniform int begSliceX;
uniform int endSliceX;
uniform int begSliceY;
uniform int endSliceY;
uniform int begSliceZ;
uniform int endSliceZ;
// Debug
uniform float debug1;
uniform float debug10;
uniform float debug200;

varying vec3 vUv;
varying vec3 pos;
varying mat3 scale;

  float calcColorIntensity(vec4 c) {
    // NOTE OPTIMALIZATION: if I keep using this for comparison only, it shouldn't be normalized.
    return (c.r + c.g + c.b) / 3.0 * c.a;
  }

vec4 rayCast(vec3 P_r, mat3 scale, int samplingRate) {
  vec3 uv;
  vec4 fColor = vec4(0.0);
  float zMax = v.z - 1.0;
  vec3 userTopBound =
    vec3(float(endSliceX)
         , float(endSliceY)
         , float(endSliceZ))
    / v;
  vec3 userBotBound =
    vec3(float(begSliceX)
         , float(begSliceY)
         , float(begSliceZ))
    / v;
  for (int i = 0; i <= V_MAX; i++) {
    vec4 sColor = vec4(0.0);
    float s_r = float(i);
    vec3 D_r = P_r + s_r * (rayVn / v);
    if (   any(greaterThan(D_r, vec3(1.0, 1.0, 1.0)))
           || any(lessThan(D_r, vec3(0.0, 0.0, 0.0))))
      break;
    if (   any(greaterThan(D_r, userTopBound))
           || any(lessThan(D_r, userBotBound)))
      continue;
    float D_rz = D_r.z * zMax;
    // Calculate slice interpolation factor
    float f_i = abs(fract(D_rz));
    uv = scale * vec3(D_r.x
                      , D_r.y
                      + floor(D_rz)
                      , 1.0);
    sColor +=
      texture2D(volTexture, uv.xy)
      * (1.0 - f_i);
    if (zInterpolation) {
      float farZ = ceil(D_rz);
      if (farZ > zMax
          || farZ < 0.0)
        break;
      uv = scale * vec3(D_r.x
                      , D_r.y
                      + farZ
                      , 1.0);
      sColor +=
        texture2D(volTexture, uv.xy)
        * f_i;
    }
    if (debug200 > 0.0){
      fColor +=
        sColor
        / float(samplingRate)
        * ambient
        //* (1.0 - fColor * debug10)
        ;
    }
    else
      fColor += sColor / float(samplingRate) * ambient;
  }
  return fColor;
}

  void main() {
    vec3 P_r = 0.5 * (pos + vec3(1.0, 1.0, 1.0));
    // It could be more precise
    int samplingRate =
      int((  abs(dot(vec3(1.0, 0.0, 0.0), rayV)) * v.x
           + abs(dot(vec3(0.0, 1.0, 0.0), rayV)) * v.y
           + abs(dot(vec3(0.0, 0.0, 1.0), rayV)) * v.z
              ) / 3.0);
    vec4 fColor = rayCast(P_r, scale, samplingRate);

    gl_FragColor = fColor;
  }
