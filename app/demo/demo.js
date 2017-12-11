let loadedDataId;
let teardownFun;
const navEmitter =  CellVis.urlNav();

CellVis.cellvisCtrl(navEmitter.initialData.data);

navEmitter.addEventListener("urlcmd", function (e) {
  if (e.name == "data") {
    CellVis.cellvisCtrl(e.value);
  }
});
