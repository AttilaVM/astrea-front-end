import { Observable } from "rxjs-es";
import { any, equals } from "ramda";

function concatRgbaArr(a1, a2) {
  const a1End = a1.length;
  for (var i = 0; i < a2.length; i++) {
    a1[a1End + i] = a2[i];
  }
  return a1;
}

/**
 * Extract image data (x and y scale and RGBA data) from a given image DOM node.
 * @param {HTMLElement} img
 * @return {{width: number, height: number, data:
 Uint8ClampedArray}}
*/
export function getImgData(img) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height);
}

export function loadImg(file){
  const img = document.createElement("img");
  img.file = file;
  const observable = Observable.create(function(observer){
    img.onload = function(e) {
      window.URL.revokeObjectURL(this.src);
      observer.next(img);
      observer.complete();
    };
    img.onerror = function (err) {
      observer.error(err);
    };
  });
  img.src = window.URL.createObjectURL(file);
  return observable;
}

export function sliceValidator(originalSlice, slice) {
  if (typeof(originalSlice) === "undefined")
    return slice;
  else if (originalSlice.width !== slice.width
           || originalSlice.height !== slice.height)
    throw("Non uniform slices");
  else
    return slice;
}

export function verticalImgConcat(montageData, imgData) {
  if (typeof(montageData.width) === "undefined") {
    montageData.width  = imgData.width;
  }
  montageData.height += imgData.height;
  montageData.sliceNum++;
  concatRgbaArr(montageData.data, imgData.data);
  return montageData;
};

const supportedExtensions = [
  "png",
  "tif",
  "tiff"
];
export function isSupportedImg(path) {
  const fileExtension =
        path.substring(
          path.lastIndexOf(".") + 1)
          .toLowerCase();
  return any(equals(fileExtension), supportedExtensions);
}

export function imgDataToCanvas(voxelData) {
  const canvas = document.createElement("canvas");
  const imgData = new ImageData(
    new Uint8ClampedArray(voxelData.data),
    voxelData.width,
    voxelData.height
  );
  // Maybe this part is not obligatory TODO
  canvas.width = imgData.width;
  canvas.height = imgData.height;
  const ctx = canvas.getContext("2d");
  ctx.putImageData(imgData, 0, 0);
  return canvas;
}
