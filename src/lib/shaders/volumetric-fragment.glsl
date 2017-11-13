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
uniform vec3 rayV;
uniform int begSlice;
uniform int endSlice;
// Debug
uniform float debug1;
uniform float debug10;
uniform float debug200;

varying vec3 vUv;
varying vec3 pos;

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

  float calcColorIntensity(vec4 c) {
    // TODO: if I keep using this for comparison only, it shouldn't be normalized.
    return (c.r + c.g + c.b) / 3.0 * c.a;
  }

float fround(float x) {
  float fraction = fract(x);
  if (fraction < 0.5)
    return floor(x);
  else
    return ceil(x);
}

float stepper(float x, int stepNum) {
  float interVal = float(stepNum);
  return fround(x * interVal)/interVal;
}

vec2 xFlip(vec2 v) {
  return mat2(-1.0, 0.0,
               0.0, 1.0) * v + vec2(1.0, 0.0);
}

vec3 rotate(vec3 v, float p, float y) {
  return mat3(1.0,  0.0,    0.0,
              0.0,  cos(p), sin(p),
              0.0, -sin(p), cos(p))
    * mat3(cos(y), 0.0, -sin(y),
           0.0,    1.0,  0.0,
           sin(y), 0.0,  cos(y))
    * v;
}

vec4 rayCast(vec2 planeCoo, mat3 scale, vec3 stepV, vec3 offsetV) {
    vec4 fColor = vec4(0.0, 0.0, 0.0, 0.0);
    vec4 sColor = fColor;
    // Plane specific variables
    // NOTE: both the initialization and condition of a GLSL loop must depend on constant values, hence the not C idiomatic control flow.
    for (int i = 0; i < 256; i++) {
      if (i < begSlice)
        continue;
      if (i == endSlice)
        break;

      float s = float(i);
      vec3 posV = offsetV + s * stepV;
      mat3 translation =
        mat3(1.0, 0.0, 0.0,
             0.0, 1.0, 0.0,
             posV.x, posV.y + posV.z, 1.0
             );

      vec3 tUv = translation * vUv;
      tUv = scale * tUv;
      vec2 pUv = tUv.xy;

      if (stepV.z == 1.0)
        pUv = xFlip(pUv);

      sColor = texture2D(volTexture, pUv);

#if defined( MAXIMUM_INTENSITY_MODEL )
      float fIntensity = calcColorIntensity(fColor);
      float sIntensity = calcColorIntensity(sColor);
      if (sIntensity > fIntensity) {
        fColor = sColor;
      }
#endif

#if defined ( ADDITIVE_MODEL )
      fColor += ambient * sliceUvRatio * sColor;
#endif

#if defined ( EMISSION_ABSORTION_MODEL )
      fColor =
        fColor
        + ambient
        * sliceUvRatio
        // * (1.0 - dist * 0.5)
        * sColor;

#endif

    }
    return fColor;
  }

  void main() {

    vec4 fColor;
    mat3 scale = mat3(1.0, 0.0,          0.0,
                      0.0, sliceUvRatio, 0.0,
                      0.0, 0.0,          1.0);
    // Adapt shader to the planes of the canonical cube.
    // NOTES:
    // 1. switch statement is not yet supported in every GLSL implementations
    // 2. Using one viewing cube with one shader is way faster than 6 plane objects with separate shaders.
    int planeType = planeDetect(pos);
    if (planeType == FRONT_PLANE) {
      vec2 piercingPoint = 0.5 * (pos.xz + vec2(1.0, 1.0));
      vec3 offsetV = vec3(0.0, 0.0,
                          stepper(piercingPoint.y, 40) * float(SLICE_NUM)
                          );
      vec3 stepV = vec3(-sin(rayV.x / (rayV.y  / sliceUvRatio))
                        , -1.0 / float(SLICE_NUM)
                        , -sin(rayV.z / (rayV.y / sliceUvRatio)* float(SLICE_NUM)));
      fColor = rayCast(pos.xz
                       , scale
                       , stepV
                       , offsetV);
    }
    else if (planeType == TOP_PLANE) {
      vec3 offsetV = vec3(0.0, 0.0, SLICE_NUM - 1);
      vec3 stepV = vec3(-sin(rayV.x / (rayV.z / sliceUvRatio))
                        , -sin(rayV.y / (rayV.z / sliceUvRatio))
                        , -1.0);
      fColor = rayCast(pos.xz
                       , scale
                       , stepV
                       , offsetV);
    }
    else if (planeType == BACK_PLANE) {
      discard;
    }

    else if (planeType == BOT_PLANE) {
      vec3 offsetV = vec3(0.0, 0.0, 0.0);
      vec3 stepV = vec3(-sin(rayV.x / (rayV.z / sliceUvRatio))
                        , sin(rayV.y / (rayV.z / sliceUvRatio) )
                        , 1.0);
      fColor = rayCast(pos.xz
                       , scale
                       , stepV
                       , offsetV);
    }
    else if (planeType == LEFT_PLANE)
      discard;
    else if (planeType == RIGHT_PLANE)
      discard;
    else
      discard;


    gl_FragColor = fColor;
  }
