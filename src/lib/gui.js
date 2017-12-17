import { EventDispatcher } from "three";
import { camelCaseToWords } from "./utils/text.js";

const optionDict = {
  interpolation: {none: 0
                  , nearest_neighbour: 1
                  , linear: 2}};

export function optionMap(name, value) {
  return optionDict[name][value];
}

export function registerGui(appData
                            , voxelDimensions
                            , render) {

  function Emitter() {
    this.change = function change(name, value, uniformP, transformFun) {
      this.dispatchEvent({type: "change"
                          , name: name
                          , value: value
                          , uniformP
                          , transformFun});
    };
  }
  Object.assign(Emitter.prototype, EventDispatcher.prototype);

  if (dat) {
    let gui = new dat.GUI();
    const emitter = new Emitter();
    emitter.teardownGui = function teardownGui() {
      gui.destroy();
    };

    function updateGui(opts, srcObj, folderName) {
      let target;
      if (folderName)
        target = gui.addFolder(folderName);
      else
        target = gui;

      if (opts.numbers)
        for (let opt of opts.numbers) {
          let [
            name
            , start
            , stop
            , step
            , uniformP
            , transformFun] = opt;
          target.add(
            srcObj
            , name
            , start
            , stop
            , step)
            .name(camelCaseToWords(name))
            .onChange(function (value) {
              emitter.change(name
                             , value
                             , uniformP
                             , transformFun);
            })
            .onFinishChange(function (value) {
              emitter.change(name
                             , value
                             , uniformP
                             , transformFun);
            });
        }
      if (opts.booleans)
        for (let opt of opts.booleans) {
          let [name, uniformP] = opt;
          target.add(
            srcObj
            , name)
            .name(camelCaseToWords(name))
            .onChange(function (value) {
              emitter.change(name, value, uniformP);
            })
            .onFinishChange(function (value) {
              emitter.change(name, value, uniformP);
            });
        }
      if (opts.colors)
        for (let opt of opts.colors) {
          let name = opt[0];
          target.addColor(srcObj, name);
        }
      if (opts.texts)
        for (let opt of opts.texts) {
          let [name, options, uniformP] = opt;
          target.add(srcObj, name, options)
            .name(camelCaseToWords(name))
            .onChange(function (value) {
              emitter.change(name, value, uniformP);
            })
            .onFinishChange(function (value) {
              emitter.change(name, value, uniformP);
            });
        }
    }

    updateGui(
      {
        numbers: [
          ["ambient", 1.0, 200.0, 0.01, true, Math.log]]
        , colors: [["bgColor"]]
        , texts: [[
          "interpolation"
          , ["none"
             , "nearest_neighbour"
             , "linear"]
          , true]]}
      , appData
      , "scene"
    );

    gui.remember(appData);

    updateGui(
      {
        numbers: [
          ["zScaler", 0.01, 50, 0.01, true]
          , ["begSliceX", 0, voxelDimensions[0], 1, true]
          , ["endSliceX", 1, voxelDimensions[0], 1, true]
          , ["begSliceY", 0, voxelDimensions[1], 1, true]
          , ["endSliceY", 1, voxelDimensions[1], 1, true]
          , ["begSliceZ", 0, voxelDimensions[2], 1, true]
          , ["endSliceZ", 1, voxelDimensions[2], 1, true]
        ]}
      , appData
      , "geometry"
    );

    updateGui(
      {
        numbers: [
          ["debug1", -1.0, 1.0, 0.001, true]
          , ["debug10", -10.0, 10.0, 0.1, true]
          , ["debug200", -200.0, 200.0, 1, true]
        ]}
      , appData
      , "debug"
    );

    gui.add(appData, "sampleName").name("Sample Name");

    function saveToBackEnd() {
      if (appData.sampleName.length === 0) {
        appDispatcher.userError("Sample name is not specified");
        return;
      }
      appData.volCanvas.toBlob((blob) => {
        // The blob must be in an array
        const voxelImg = new File(
          [blob]
          , appData.sampleName + ".png"
          , {type: blob.type});
        const appDataFile = new File(
          [JSON.stringify(appData)]
          , "voxelData"
          , {type: "application/json"}
        );
        console.log(appDataFile);
        const formData = new FormData();
        formData.append("voxel_img", voxelImg, voxelImg.name);
        formData.append("app_data", appDataFile);
        console.log(formData);
        const xhr = new XMLHttpRequest();
        xhr.open('POST'
                 , voxelImg.name
                 , true);
        console.log(xhr);
        xhr.onload = () => {
          appDispatcher.upload(xhr.status);
        };
        xhr.onerror = () => {
          appDispatcher.upload(xhr.status);
        }
        xhr.send(formData);
      })

      ;

    }

    gui.add({Save: saveToBackEnd}, "Save");

    return emitter;
  }



  else {
    Console.Warn("Please include da, truet.gui into your webpage: https://cdnjs.cloudflare.com/ajax/lib, trues/dat-gui/0.6.5/dat.gui.min.js");
  }
};
