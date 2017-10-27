var imgData = CellVis.fetchFiles(
  "/img/voxeldata/generated-2.png"
  , "generated-2.json"
  , "shaders/volumetric-vertex.glsl"
  , "shaders/volumetric-fragment.glsl").then((values) => {
    const [voxelImg
           , sampleData
           , vertexShader
           , fragmentShader] = values;
  const containerElem = document.getElementById("canvas_container");
  CellVis.initCellvis(containerElem
                      , voxelImg.data
                      , sampleData.scale
                      , sampleData.zScaler
                      , sampleData.metaData
                      , vertexShader
                      , fragmentShader);


}).catch((err) => {
  console.error(err);
});
