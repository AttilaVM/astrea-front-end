const navEmitter =  CellVis.urlNav();

var imgData = CellVis.fetchFiles(
  "mock-img-stack.json"
  , "shaders/volumetric-vertex.glsl"
  , "shaders/volumetric-fragment.glsl").then((values) => {
    const [sampleData
           , vertexShader
           , fragmentShader] = values;
  const containerElem = document.getElementById("canvas_container");
  CellVis.initCellvis(containerElem
                      , sampleData.voxelSrc
                      , sampleData.scale
                      , sampleData.zScaler
                      , sampleData.metaData
                      , vertexShader
                      , fragmentShader);


}).catch((err) => {
  console.error(err);
});
