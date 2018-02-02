import { addAttrs, createElement, addVideo } from "/lib/utils/dom.js";
import { loadImg, getImgData, sliceValidator, verticalImgConcat, imgDataToCanvas } from "/lib/utils/image.js";

import { Observable } from 'rxjs-es';

export function addImgLoaderBtn() {

  const fileInputContainer = createElement(
    "div"
    ,{}
    ,["cardLayout", "positionPivot", "noShrink", "fadeSignIn"]);

  const icon = createElement(
    "img"
    , {src: "img/icons/context_icon.mp4"
       , width: 250
       , height: 250
       //, alt: "Clickable icon to add new volume sample"
      }
    , ["noInteraction", "noSelect", "fillParent"]
  );

  const animation = addVideo(
    [{src: "/img/icons/context_icon.mp4"
      , type: "video/mp4"}
     , {src: "/img/icons/context_icon.ogv"
        , type: "video/ogg"}]
    , 250
    , 250
    , ["noSelect", "noInteraction"]
    , icon
  );

  const plusSign = createElement(
    "img"
    , {src: "/img/icons/plus_sign.svg"
       , alt: "Click to load a new sample."}
    , ["plusSignLayout", "plusSign"]
  );

  const fileInputElem = createElement(
    "input"
    , {
      id: "fileInput",
      type: "file",
      allowdirs: "",
      multiple: ""
    }
    , ["fillParent"
       , "invisible"
       , "clickable"
       , "zlv1"
      ]
  );

  fileInputContainer.appendChild(fileInputElem);
  fileInputContainer.appendChild(animation);
  fileInputContainer.appendChild(plusSign);

  Observable.fromEvent(fileInputElem, "change")
    .map(event => event.srcElement.files)
    .subscribe(
      files => Observable.from(files)
        .filter(file => file.type.indexOf("image") !== -1)
        .concatMap(imgFile => loadImg(imgFile))
        .map(img => getImgData(img))
        .scan((originalSliceData, sliceData) => sliceValidator(originalSliceData, sliceData)
          , undefined)
        .reduce((montageImgData, imgData) => verticalImgConcat(montageImgData, imgData)
          // Uint8clampedarray has an immutable length
          , {
            data: [],
            width: undefined,
            height: 0,
            sliceNum: 0
          })
        .subscribe(montageImgData => {
          const volCanvas = imgDataToCanvas(montageImgData);
          volCanvas.sliceNum = montageImgData.sliceNum;
          appDispatcher.voxelDataLoad(volCanvas);
        })
  );


  console.info("You can upload image sequences with the plus icon");

  return fileInputContainer;
}
