import { addAttrs, createElement } from "./dom-utils";
import { loadImg, getImgData, sliceValidator, imgClientLink, getImgDataFromFile, verticalImgConcat } from "./image-utils";

import { Observable } from 'rxjs-es';

console.log(Observable);
Observable.of(1,2,3).map(x => x + '!!!'); // etc

function createConsole(elem) {
  const consoleElem = document.createElement("div");
  elem.appendChild(consoleElem);

  const consoleCtrl = {};

  function addEntry(text, style) {
    const newLine = createElement("div", {class: style});
    const p = createElement("p");
    p.innerHTML = text;
    newLine.appendChild(p);
    consoleElem.appendChild(newLine);


  }

  consoleCtrl.showErr = function showErr(text) {
    addEntry(text, "error");
  };

  consoleCtrl.showWarn = function showWarn(text) {
    addEntry(text, "warning");
  };

  consoleCtrl.showHint = function showHint(text) {
    addEntry(text, "hint");
  };

  consoleCtrl.showInfo = function showInfo(text) {
    addEntry(text, "info");
  };

  return consoleCtrl;
}

export function mainUi(appContainer) {
  const {showErr, showWarn, showHint, showInfo} = createConsole(appContainer);

  const fileInputElem = createElement(
    "input", {
      id: "fileInput"
      , type: "file"
      , allowdirs: ""
      , multiple: ""});

  appContainer.appendChild(fileInputElem);

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
                , {data: new Uint8ClampedArray()
                   , width: undefined
                   , height: 0
                   , sliceNum: 0})
        .subscribe(file => console.log(file)));

  showHint("You can upload image sequences with the plus icon");
}
