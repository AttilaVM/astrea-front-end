import { Observable } from 'rxjs-es';

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

export function getImgDataFromFile(file) {
  const img = document.createElement("img");
  img.file = file;
  img.src = window.URL.createObjectURL(file);
  const promise = new Promise((resolve, reject) => {
    img.onload = function(e) {
      const imgData = getImgData(img);
      window.URL.revokeObjectURL(this.src);
      resolve(imgData);
    };
    img.onerror = function (err) {
      reject(err);
    };
  });
  return promise;
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

export function imgClientLink(files) {
  const fileNum = files.length;
  if (fileNum == 0) {
    return;
  }
  const imgDataPromises = [];
  for (let i = 0; i < fileNum; i++) {
    let file = files[i];
    if (file.type.indexOf("image") == -1) {
      console.error(`Skipping: ${file.name} is not an image.`);
      continue;
    }
    imgDataPromises[i] = getImgDataFromFile(file);
  }
  return Promise.all(imgDataPromises);
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
