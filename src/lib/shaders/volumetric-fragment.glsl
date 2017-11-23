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
uniform bool zInterpolation;
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
    // NOTE OPTIMALIZATION: if I keep using this for comparison only, it shouldn't be normalized.
    return (c.r + c.g + c.b) / 3.0 * c.a;
  }

// NOTE: There is no round(x) built in function
// NOTE OPTIMALIZATION: It will receive only positive values
float fround(float x) {
  float x_f = floor(x);
  float fraction = x - x_f;
  if (abs(fraction) < 0.5)
    return x_f;
  else
    if(x > 0.0)
      return x_f + 1.0;
    else
      return x_f - 1.0;
}

float stepper(float x, int stepNum) {
  float interVal = float(stepNum);
  return fround(x * interVal)/interVal;
}

vec2 xFlip(vec2 v) {
  return mat2(-1.0, 0.0,
               0.0, 1.0) * v + vec2(1.0, 0.0);
}

vec4 sampler(vec3 uv, mat3 translation, mat3 scale, bool flipOnX, bool flipOnY) {
  uv = translation * uv;
  uv = scale * uv;
  // uv orthographic projection
  vec2 pUv = uv.xy;
  if (flipOnX)
    pUv = xFlip(pUv);

  return texture2D(volTexture, pUv);
}

vec4 rayCast(vec3 planeCoo, mat3 scale, vec3 stepV, bvec2 flip, vec3 offsetV) {
    const int raySteps = SLICE_NUM;
    //const int raySteps = 256;
    //return vec4(offsetV.x * debug1);
  //return vec4(stepV.x * debug200, stepV.z * debug200, 0.0, 1.0);
    vec4 fColor = vec4(0.0, 0.0, 0.0, 0.0);
    vec4 sColor = fColor;
    vec3 piercingPoint = 0.5 * (planeCoo + vec3(1.0, 1.0, 1.0));
    //return vec4(ste);

    // Plane specific variables
    // NOTE: both the initialization and condition of a GLSL loop must depend on constant values, hence the not C idiomatic control flow.
    vec3 topBound;
    vec3 botBound;
    if (stepV.z == -sliceUvRatio) {
      topBound = vec3(1.0, 1.0, 1.0);
      botBound = vec3(0.0, 0.0, 0.0);
    }
    else if (stepV.z == sliceUvRatio) {
      topBound = vec3(2.0,  1.0, 1.0);
      botBound = vec3(-1.0,  0.0, 0.0);
    }
    else if (stepV.y == -1.0 / float(SLICE_NUM)) {
      topBound = vec3(1.0,  1.0, 1.0);
      botBound = vec3(0.0, -1.0, 0.0);
    }
    else if (stepV.y == 1.0 / float(SLICE_NUM)) {
      topBound = vec3(1.0,  2.0, 1.0);
      botBound = vec3(0.0, 0.0, 0.0);
    }
    else if (stepV.x == -1.0 / float(SLICE_NUM)) {
      topBound = vec3(1.0,  1.0, 1.0);
      botBound = vec3(-1.0, 0.0, 0.0);
    }
    else if (stepV.x == 1.0 / float(SLICE_NUM)) {
      topBound = vec3(2.0,  1.0, 1.0);
      botBound = vec3(-1.0, 0.0, 0.0);
    }
    else {
      topBound = vec3(1.0,  2.0, 1.0);
      botBound = vec3(0.0,  0.0, 0.0);
    }

    for (int i = 0; i < raySteps; i++) {
      if (i < begSlice)
        continue;
      if (i == endSlice)
        break;

      float s = float(i);
      vec3 s_ray = s * stepV;
      vec3 posV = offsetV + vec3(s_ray.x
                                 , s_ray.y
                                 , floor(s_ray.z * float(SLICE_NUM)));
      // if (i == int(debug200))
      //   return vec4(posV.y * debug1);

      if (
          posV.z > float(SLICE_NUM)
          || posV.z < 0.0
          || piercingPoint.y - offsetV.y + posV.y  > topBound.y
          || piercingPoint.y - offsetV.y + posV.y  < botBound.y
          || piercingPoint.x - offsetV.x + posV.x  > topBound.x
          || piercingPoint.x - offsetV.x + posV.x  < botBound.x
          )
        break;
      mat3 translation =
        mat3(1.0, 0.0, 0.0,
             0.0, 1.0, 0.0,
             posV.x, posV.z + posV.y, 1.0
             );

        sColor = sampler(vUv, translation, scale, flip.x, flip.y);

      if (zInterpolation == true && planeCoo != pos.xyz) {
        // NOTE: It is unecessery to test (posV.z + 1.0 > float(SLICE_NUM)), since we used floor for the first transformation
        if (posV.z - 1.0 < 0.0)
          continue;
        float f_i =
          (fround(piercingPoint.y * float(SLICE_NUM)))
          - piercingPoint.y * float(SLICE_NUM)
           + debug1 / 2.0
          ;
        posV.z = posV.z + posV.z / abs(posV.z);
        translation =
        mat3(1.0, 0.0, 0.0,
             0.0, 1.0, 0.0,
             posV.x, posV.z + posV.y, 1.0
             );

        vec4 nColor = sampler(vUv, translation, scale, flip.x, flip.y);
        vec3 mixColor =
          (1.0 - f_i) * nColor.rgb
          + f_i * sColor.rgb;
        sColor = vec4(mixColor.rgb, 1.0);
      }

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
      vec3 piercingPoint = 0.5 * (pos.xzy + vec3(1.0, 1.0, 1.0));
      vec3 offsetV = vec3(0.0
                          , piercingPoint.y

                          , fround(piercingPoint.y * float(SLICE_NUM))
                          );
      vec3 stepV = vec3(
                        -sin(rayV.x / (rayV.y  / sliceUvRatio))
                        , -1.0 / float(SLICE_NUM)
                        , -sin(rayV.z / (rayV.y / sliceUvRatio))
                        );
      fColor = rayCast(pos.xzy
                       , scale
                       , stepV
                       , bvec2(false, false)
                       , offsetV);
    }
    else if (planeType == TOP_PLANE) {
      vec3 offsetV = vec3(0.0, 0.0, SLICE_NUM - 1);
      vec3 stepV = vec3(-sin(rayV.x / (rayV.z / sliceUvRatio))
                        , -sin(rayV.y / (rayV.z / sliceUvRatio))
                        , - sliceUvRatio);
      fColor = rayCast(pos.xyz
                       , scale
                       , stepV
                       , bvec2(false, false)
                       , offsetV);
    }
    else if (planeType == BACK_PLANE) {
      vec3 piercingPoint = 0.5 * (pos.xzy + vec3(1.0, 1.0, 1.0));
      vec3 offsetV = vec3(0.0
                          , -piercingPoint.y

                          , fround(piercingPoint.y * float(SLICE_NUM))
                          );
      vec3 stepV = vec3(
                        sin(rayV.x / (rayV.y  / sliceUvRatio))
                        , 1.0 / float(SLICE_NUM)
                        , sin(rayV.z / (rayV.y / sliceUvRatio))
                        );
      fColor = rayCast(pos.xzy
                       , scale
                       , stepV
                       , bvec2(false, false)
                       , offsetV);
    }

    else if (planeType == BOT_PLANE) {
      vec3 piercingPoint = 0.5 * (pos.xyz + vec3(1.0, 1.0, 1.0));
      vec3 offsetV = vec3(0.0, 0.0, 0.0);
      // fColor = vec4(
      //               offsetV.x
      //               ,0.0
      //               //, piercingPoint.x
      //               , 0.0
      //               , 1.0);

      vec3 stepV = vec3(-sin(rayV.x / (rayV.z / sliceUvRatio))
                        , sin(rayV.y / (rayV.z / sliceUvRatio) )
                        , sliceUvRatio);
      fColor = rayCast(pos.xyz
                       , scale
                       , stepV
                       , bvec2(true, false)
                       , offsetV);
    }
    else if (planeType == LEFT_PLANE) {
      vec3 piercingPoint = 0.5 * (pos.zyx + vec3(1.0, 1.0, 1.0));
      vec3 offsetV = vec3(-piercingPoint.x
                          , 0.0

                          , fround(piercingPoint.x * float(SLICE_NUM))
                          );
      vec3 stepV = vec3(
                        1.0 / float(SLICE_NUM)
                        , sin(rayV.y / (rayV.x  / sliceUvRatio))
                        , sin(rayV.z / (rayV.x / sliceUvRatio))
                        );
      fColor = rayCast(pos.zyx
                       , scale
                       , stepV
                       , bvec2(false, false)
                       , offsetV);
    }
    else if (planeType == RIGHT_PLANE) {
      vec3 piercingPoint = 0.5 * (pos.zyx + vec3(1.0, 1.0, 1.0));
      vec3 offsetV = vec3(piercingPoint.x
                          , 0.0

                          , fround(piercingPoint.x * float(SLICE_NUM))
                          );
      vec3 stepV = vec3(
                        -1.0 / float(SLICE_NUM)
                        , -sin(rayV.y / (rayV.x  / sliceUvRatio))
                        ,  -sin(rayV.z / (rayV.x / sliceUvRatio))
                        );
      fColor = rayCast(pos.zyx
                       , scale
                       , stepV
                       , bvec2(false, false)
                       , offsetV);
    }
    else
      discard;


    gl_FragColor = fColor;
  }
