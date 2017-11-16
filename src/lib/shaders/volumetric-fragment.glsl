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

vec3 rotate(vec3 v, float p, float y) {
  return mat3(1.0,  0.0,    0.0,
              0.0,  cos(p), sin(p),
              0.0, -sin(p), cos(p))
    * mat3(cos(y), 0.0, -sin(y),
           0.0,    1.0,  0.0,
           sin(y), 0.0,  cos(y))
    * v;
}

vec4 rayCast(vec3 planeCoo, mat3 scale, vec3 stepV, vec3 offsetV) {
    const int raySteps = SLICE_NUM;
    //const int raySteps = 256;
    //return vec4(offsetV.y + debug1);
  //return vec4(stepV.x * debug200, stepV.z * debug200, 0.0, 1.0);
    vec4 fColor = vec4(0.0, 0.0, 0.0, 0.0);
    vec4 sColor = fColor;
    vec3 piercingPoint = 0.5 * (planeCoo + vec3(1.0, 1.0, 1.0));
    // Plane specific variables
    // NOTE: both the initialization and condition of a GLSL loop must depend on constant values, hence the not C idiomatic control flow.
    vec3 topBound;
    vec3 botBound;
    if (planeCoo == pos.xyz) {
      topBound = vec3(1.0, 1.0, 1.0);
      botBound = vec3(0.0, 0.0, 0.0);
    }
    else if (planeCoo == pos.xzy) {
      topBound = vec3(1.0,  1.0, 1.0);
      botBound = vec3(0.0, -1.0, 0.0);
    }

    for (int i = 0; i < raySteps; i++) {
      if (i < begSlice)
        continue;
      if (i == endSlice)
        break;

      float s = float(i);
      vec3 s_ray = s * stepV;
      s_ray.z = fround(s_ray.z * float(SLICE_NUM));

      vec3 posV = offsetV + s_ray;
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

      vec3 tUv = translation * vUv;
      tUv = scale * tUv;
      vec2 pUv = tUv.xy;

      if (stepV.z == sliceUvRatio)
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
      vec3 piercingPoint = 0.5 * (pos.xzy + vec3(1.0, 1.0, 1.0));
      vec3 offsetV = vec3(0.0
                          ,piercingPoint.y

                          ,stepper(piercingPoint.y, SLICE_NUM) * float(SLICE_NUM)
                          );
      vec3 stepV = vec3(
                        -sin(rayV.x / (rayV.y  / sliceUvRatio))
                        , -1.0 / float(SLICE_NUM)
                        //, debug200
                        //, -stepper(debug1, SLICE_NUM) * float(SLICE_NUM)
                        , -sin(rayV.z / (rayV.y / sliceUvRatio))
                        //, -sin(rayV.z / (rayV.y / 1.0))
                        );
      fColor = rayCast(pos.xzy
                       , scale
                       , stepV
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
                       , offsetV);
    }
    else if (planeType == BACK_PLANE) {
      discard;
    }

    else if (planeType == BOT_PLANE) {
      vec3 offsetV = vec3(0.0, 0.0, 0.0);
      vec3 stepV = vec3(-sin(rayV.x / (rayV.z / sliceUvRatio))
                        , sin(rayV.y / (rayV.z / sliceUvRatio) )
                        , sliceUvRatio);
      fColor = rayCast(pos.xyz
                       , scale
                       , stepV
                       , offsetV);
    }
    else if (planeType == LEFT_PLANE) {
      vec3 piercingPoint = 0.5 * (pos.xzy + vec3(1.0, 1.0, 1.0));
      vec3 offsetV = vec3(piercingPoint.y, 0.0,
                          stepper(piercingPoint.y, SLICE_NUM) * float(SLICE_NUM)
                          );
      vec3 stepV = vec3(
                        -1.0 / float(SLICE_NUM)
                        ,-sin(rayV.x / rayV.y )

                        , 0.0
                        //, debug200
                        //, -sin(rayV.z / rayV.y)
                        );
      fColor = rayCast(pos.xzy
                       , scale
                       , stepV
                       , offsetV);
      // fColor = vec4(piercingPoint.y);
    }
    else if (planeType == RIGHT_PLANE)
      discard;
    else
      discard;


    gl_FragColor = fColor;
  }
