import { EventDispatcher } from "three";

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

    function updateGui(opts) {
      for (let opt of opts.numbers) {
        let [
          name
          , start
          , stop
          , step
          , uniformP
          , transformFun] = opt;
            gui.add(
              appData
              , name
              , start
              , stop
              , step)
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
      for (let opt of opts.booleans) {
        let [name, uniformP] = opt;
        gui.add(
          appData
          , name)
          .onChange(function (value) {
            emitter.change(name, value, uniformP);
          })
          .onFinishChange(function (value) {
            emitter.change(name, value, uniformP);
          });
      }
      for (let opt of opts.colors) {
        let name = opt[0];
        gui.addColor(appData, name);
      }
    }

    updateGui({
      numbers: [
        ["debug1", -1.0, 1.0, 0.001, true]
        , ["debug10", -10.0, 10.0, 0.1, true]
        , ["debug200", -200.0, 200.0, 1, true]
        , ["ambient", 1.0, 200.0, 0.01, true, Math.log]
        , ["begSliceX", 0, voxelDimensions[0], 1, true]
        , ["endSliceX", 1, voxelDimensions[0], 1, true]
        , ["begSliceY", 0, voxelDimensions[1], 1, true]
        , ["endSliceY", 1, voxelDimensions[1], 1, true]
        , ["begSliceZ", 0, voxelDimensions[2], 1, true]
        , ["endSliceZ", 1, voxelDimensions[2], 1, true]
      ]
      , booleans: [["zInterpolation", true]]
      , colors: [["bgColor"]]});
    return emitter;
  }


  else {
    Console.Warn("Please include da, truet.gui into your webpage: https://cdnjs.cloudflare.com/ajax/lib, trues/dat-gui/0.6.5/dat.gui.min.js");
  }
}
