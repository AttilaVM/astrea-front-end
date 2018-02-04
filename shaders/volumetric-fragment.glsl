#define NO_INTERPOLATION 0
#define NEAREST_NEIGHBOUR_INTERPOLATION 1
#define LINEAR_INTERPOLATION 2

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 volumeScaleMatrix;
uniform float sliceUvRatio;
uniform vec3 v;
uniform sampler2D volTexture;
uniform float sliceDistance;
uniform float ambient;
uniform vec3 bgColor;
uniform int interpolation;
uniform vec3 rayV;
uniform vec3 rayVn;
uniform float maxTraceLength;
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

varying vec3 pos;

vec4 rayCast(vec3 P_r) {
  vec2 uv;
  vec4 fColor = vec4(bgColor, 1.0);
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

    if (interpolation == NO_INTERPOLATION) {
      // only sample the slice if it is the ray proximity
      if (fract(D_rz) < 1.0) {
        uv = vec2(D_r.x
                  , sliceUvRatio * (D_r.y + floor(D_rz)));
        sColor += texture2D(volTexture, uv);
        fColor += sColor / maxTraceLength * ambient;

      }
      continue;
    }

    // Calculate slice interpolation factor
    float f_i = abs(fract(D_rz));
    uv = vec2(D_r.x
              , sliceUvRatio * (D_r.y + floor(D_rz)));
    sColor +=
      texture2D(volTexture, uv)
      * (1.0 - f_i);

    // otherwise it will be a simple nearest neighbour;
    if (interpolation == LINEAR_INTERPOLATION) {
      float farZ = ceil(D_rz);
      if (farZ > zMax
          || farZ < 0.0)
        break;
      uv = vec2(D_r.x
                , sliceUvRatio * (D_r.y + farZ));
      sColor +=
        texture2D(volTexture, uv)
        * f_i;
    }
    fColor += sColor / maxTraceLength * ambient;
  }
  return fColor;
}

  void main() {
    // frustrum culling
    vec4 projectedPos =
      projectionMatrix
      * modelViewMatrix
      * volumeScaleMatrix
      * vec4(pos,1.0);
    if(any(greaterThan(projectedPos.xy, vec2(1.0, 1.0)))
       || any(lessThan(projectedPos.xy, vec2(-1.0, -1.0))))
      discard;

    vec3 P_r = 0.5 * (pos + vec3(1.0, 1.0, 1.0));

    vec4 fColor = rayCast(P_r);

    gl_FragColor = fColor;
  }
