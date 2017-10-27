/**
 * Extract image data (x and y scale and RGBA data) from a given image DOM node.
 * @param {HTMLElement} img
 * @return {{width: number, height: number, data:
Uint8ClampedArray}}
 */
function getImgData(img) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height);
}

/**
 * Generalized async data loader, which accepts arbitrary number of urls pointing to files relative to the server root and returns their content as resolveable arguments of an array of promises.
 * It automatically parse json files extract data from images based on their extension.
 * @param {...string}
 * @return  {Array.<Promise>}
 */
export function fetchFiles() {
  const promises = [];
  for (var i = 0; i < arguments.length; i++) {
    let url = arguments[i];
    // on Images
    if (url.match(/.*\.png/i)) {
      promises[i] = new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = (event) => {
          console.log(event);
          resolve(getImgData(image));
        };
        image.onerror = (err) => {
          reject(err);
        };
        image.src = url;
      });
    }
    // on JSON
    if (url.match(/.*\.json/i)) {
      promises[i] = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(JSON.parse(xhr.responseText));
        };
        xhr.onerror = () => {
          reject(xhr.statusText);
        };
        xhr.open("GET", url);
        xhr.send();
      });
    }
    // on Others
    else {
      new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.responseText);
        };
        xhr.onerror = () => {
          reject(xhr.statusText);
        };
        xhr.open("GET", url);
        xhr.send();
      });
    }
  }
  return Promise.all(promises);
}
