import { addAttrs, createElement } from "./dom-utils";
import { loadImg
         , getImgData
         , sliceValidator
         , imgClientLink
         , getImgDataFromFile
         , verticalImgConcat
         , imgDataToCanvas
       } from "./image-utils";

import { Observable } from 'rxjs-es';

export function addImgLoaderBtn() {

  const fileInputElem = createElement(
    "input", {
      id: "fileInput"
      , type: "file"
      , allowdirs: ""
      , multiple: ""});

  Observable.fromEvent(fileInputElem, "change")
    .map(event => event.srcElement.files)
    .subscribe(
      files =>
        Observable.from(files)
        .filter(file => file.type.indexOf("image") !== -1)
        .concatMap(imgFile => loadImg(imgFile))
        .map(img => getImgData(img))
        .scan((originalSliceData, sliceData) =>
              sliceValidator(originalSliceData, sliceData)
              , undefined)
        .reduce((montageImgData, imgData) =>
                verticalImgConcat(montageImgData, imgData)
                  // Uint8clampedarray has an immutable length
                , {data: []
                   , width: undefined
                   , height: 0
                   , sliceNum: 0})
        .subscribe(montageImgData => {
          const volCanvas = imgDataToCanvas(montageImgData);
          volCanvas.sliceNum = montageImgData.sliceNum;
          appDispatcher.voxelDataLoad(volCanvas);
        })
    );


  console.info("You can upload image sequences with the plus icon");

  return fileInputElem;
}
