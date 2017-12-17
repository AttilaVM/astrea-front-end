import { fetchFile } from "../image_loader.js";
import { initCellvis } from "../cellvis";
import { clampToMaxSize } from "../shaders/preprocess";


let teardownFun;
// TODO clean up this mess
export function getRenderCtrl(appContainer, serverAddr) {
  return function (dataSrc) {
    // Tearodwn webgl-canvas, webgl-context and dat.gui
    if (teardownFun)
      teardownFun();

    let sampleDataPromise;
    let appDataPromise;
    if (typeof(dataSrc) == "string")
      if (!serverAddr)
        sampleDataPromise = fetchFile(dataSrc + ".json", JSON.parse);
    // img data is alredy loaded, it will less uncanny after I fully switched to Observables
    else
      sampleDataPromise = new Promise(
        (reject, resolve) => resolve(dataSrc));

    appDataPromise = Promise.all([
          appDispatcher.vertexShaderPromise
        , appDispatcher.fragmentShaderPromise
        , sampleDataPromise
      ]);
      // load app when all necessery data are loaded
      appDataPromise.then((values) => {
        let [
            vertexShader
          , fragmentShader
          , sampleData] = values;
        console.log(sampleData);
        /**
         * The voxel source texture may downscaled by three.js's WebGL render to adapt to the video card. That case the scale variable is going to downscaled too.
         */
        if (typeof(dataSrc) === "string") {
          const adjustedData = clampToMaxSize(sampleData.scale, sampleData.zScaler);
          if (adjustedData.changed) {
            sampleData.scale = adjustedData.voxelDimensions;
            sampleData.zScaler = adjustedData.zScaler;
            console.info(`Voxle dimentsions have been adjusted to the video card capabilities: ${sampleData.scale[0]}, ${sampleData.scale[1]}, ${sampleData.scale[2]}`);
          }
        }
        else
          sampleData = dataSrc;
        teardownFun = initCellvis(
          appContainer
          , sampleData
          , vertexShader
          , fragmentShader);
      }).catch((err) => {
        console.error(err);
      });
  };
}
