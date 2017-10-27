var imgData = CellVis.fetchVoxelData("/img/voxeldata/generated-2.png", "generated-2.json").then((values) => {
  const [rgbaArr, sampleData] = values;
  const containerElem = document.getElementById("canvas_container");
  CellVis.initCellvis(containerElem, rgbaArr, sampleData.scale, sampleData.zScaler, sampleData.metaData);


}).catch((err) => {
  console.log(err);
});
