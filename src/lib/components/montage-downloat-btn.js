import { createElement } from "../dom-utils";
import { imgDataToCanvas } from "../image-utils.js";

export function addMontageDownloadBtn() {
  const montageDownloadBtn = createElement("a");
  montageDownloadBtn.innerHTML = "No Voxel Montage";
  let canvas;
  appDispatcher.addEventListener(
    "voxeldataload"
    , (e) => {
      montageDownloadBtn.href = e.volCanvas.toDataURL();
      montageDownloadBtn.appendChild(e.volCanvas);

    });
  montageDownloadBtn.addEventListener(
    "mouseup"
    , function (e) {
      this.download = "voxel-montage.png";
    }
  );
  return montageDownloadBtn;
}
