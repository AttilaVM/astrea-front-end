export function registerGui(appData, voxelDimensions, render) {
  // Check if dat.gui is loaded
  if (dat) {
    let gui = new dat.GUI();

    function updateGui(opts) {
      for (let opt of opts) {
        let [name, start, stop, step] = opt;
        gui.add(
          appData
          , name
          , start
          , stop
          , step)
          .onChange(render)
          .onFinishChange(render);
      }
    }

    updateGui([
      ["xNormal", -1, 1, 0.001]
      ,["yNormal", -1, 1, 0.001]
      ,["zNormal", 0, 1, 0.01]
      ,["debug1", -1.0, 1.0, 0.001]
      ,["debug10", -10.0, 10.0, 0.1]
      ,["debug200", -200.0, 200.0, 1]
      ,["ambient", 1.0, 200.0]
      ,["zInterpolation"]
      ,["begSlice", 0, voxelDimensions[2], 1]
      ,["endSlice", 1, voxelDimensions[2], 1]]);
  }


  else {
    console.warn("Please include dat.gui into your webpage: https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.6.5/dat.gui.min.js");
  }
}
