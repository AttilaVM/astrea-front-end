// TODO maybe I should use observables instead of promises
import { getImgData, isSupportedImg } from "./image-utils";

export function fetchFile(url, transformFun, isValid) {
  const xhr = new XMLHttpRequest();
  const promise = new Promise((resolve, reject) => {
    xhr.onload = () => {
      const content = xhr.responseText;
      if (isValid)
        if (!isValid(content))
          throw (`File at ${url} failed at validaton phase`);
      if (transformFun)
        resolve(transformFun(content));
      else
        resolve(content);
    };
    xhr.onerror = () => reject(xhr.statusText);
  });
  xhr.open("GET", url);
  xhr.send();
  return promise;
}

export function fetchImg(url, transformFun) {
  const img = new Img();
  promise = new Promise((resolve, reject) => {
      img.onload = () => {
        if (transformFun)
          resolve(transformFun(img));
        else
          resolve(img);
      };
    img.onerror = (err) =>  reject(err);
  });
  img.src = url;
  return promise;
}

/**
 * Generalized async data loader, which accepts arbitrary number of urls pointing to files relative to the server root and returns their content as resolveable arguments of an array of promises.
 * It automatically parse json files extract data from images based on their extension.
 * @param {Array.<string>} pathArr
 * @return  {Array.<Promise>}
 */
export function fetchFiles(pathArr) {
  const promises = [];
  let url;
  for (var i = 0; i < pathArr.length; i++) {
    url = pathArr[i];
    if (isSupportedImg(url))
      promises[i] = fetchImg(url, getImgData);
    else if (url.match(/.*\.json/i))
      promises[i] = fetchFile(url, JSON.parse);
    else
      promises[i] = fetchFile(url);
  }
  return Promise.all(promises);
}
