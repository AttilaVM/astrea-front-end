import { getImgData } from "./image-utils";

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
          resolve(getImgData(image));
        };
        image.onerror = (err) => {
          reject(err);
        };
        image.src = url;
      });
    }
    // on JSON
    else if (url.match(/.*\.json/i)) {
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
      promises[i] = new Promise((resolve, reject) => {
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
