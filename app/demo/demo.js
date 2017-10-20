var imgData = CellVis.fetchVoxelData("/img/voxeldata/generated-1.png", "generated-1.json").then((values) => {
  [rgbaArr, sampleData] = values;
  const containerElem = document.getElementById("canvas_container");
  CellVis.initCellvis(containerElem, rgbaArr, sampleData.scale, sampleData.metaData);


}).catch((err) => {
  console.log(err);
});
