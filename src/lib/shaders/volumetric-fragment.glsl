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

varying vec2 vUv;
varying float time;
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

  vec2 paralaxisOffset(int sliceStep) {
    // TODO: it should be handeld as a vec2
    float zDistance = sliceDistance * float(sliceStep);
    float xAngle = atan(rayV.x / rayV.z);
    float yAngle = atan(rayV.y / rayV.z);
    float xOffset = tan(xAngle) * zDistance;
    float yOffset = tan(yAngle) * zDistance * sliceUvRatio;
    return vec2(xOffset, -yOffset);
  }

  float calcColorIntensity(vec4 c) {
    return (c.r + c.g + c.b) / 3.0 * c.a;
  }

  vec4 rayCast(vec2 planeCoo, mat2 T) {
    vec2 piercingPoint = 0.5 * (planeCoo + vec2(1.0, 1.0));
    vec4 fColor = vec4(0.0, 0.0, 0.0, 0.0);
    vec4 sColor = fColor;
    // TODO: Only calculate dist on implicating models
    float dist = 0.0;
    // NOTE: both the initialization and condition of a glsl loop must depend on constant values, hence the not C idiomatic control flow.
    for (int i = 0; i < SLICE_NUM; i++) {
      if (i < begSlice)
        continue;
      if (i == endSlice + 1)
        break;
      dist += length(vec3(rayV.xy, sliceUvRatio));
      vec2 sliceOffset = vec2(0.0, float(i)/Z_SIZE);
      vec2 paralaxisOffset = paralaxisOffset(i);
      //gl_FragColor = vec4(piercingPoint.y * sliceUvRatio + paralaxisOffset.y);
      if (
          piercingPoint.y * sliceUvRatio < paralaxisOffset.y
          || piercingPoint.y * sliceUvRatio - paralaxisOffset.y > sliceUvRatio
          ||piercingPoint.x + paralaxisOffset.x > 1.0
          || piercingPoint.x + paralaxisOffset.x < 0.0
          ) {
        sColor = vec4(0.0);

      }
      else{
        vec2 paralaxisTranslation = sliceOffset + paralaxisOffset;
        sColor =
          texture2D(volTexture
                    , T * vUv
                    + paralaxisTranslation
                    );
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
    mat2 T = mat2(1.0, 0.0,
                  0.0, sliceUvRatio);
    // Detect the planes of the canonical cube.
    // NOTE: switch statement is not yet supported in every GLSL implementations
    int planeType = planeDetect(pos);
    if (planeType == FRONT_PLANE) {
      fColor = rayCast(pos.xz, T);
    }
    else if (planeType == TOP_PLANE) {
      fColor = rayCast(pos.xy, T);
    }
    else if (planeType == BACK_PLANE) {
      discard;
    }

    else if (planeType == BOT_PLANE)
      discard;
    else if (planeType == LEFT_PLANE)
      discard;
    else if (planeType == RIGHT_PLANE)
      discard;
    else
      discard;
    // gl_FragColor = vec4(piercingPoint
    //                     , 0.0
    //                     , 0.0);

    gl_FragColor = fColor;

    //gl_FragColor = vec4(piercingPoint.y);
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
