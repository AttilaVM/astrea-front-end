// TODO it should be in the utils dir

import { Observable } from 'rxjs-es';
import { isSupportedImg } from './../image-utils.js';

export function fetchImg(path) {
  const img = new Image();
  const observable = Observable.create(function (observer) {
    img.onload = () => {
      observer.next(img);
      observer.complete();
    };
    img.onerror = (err) => observer.error(err);
    img.src = path;
    return observer;
  });
}

export function fetchFile(path) {
  const xhr = new XMLHttpRequest();
  const observer = Observable.create(function (observer) {
    xhr.onload = () => {
      observer.next(xhr.responseText);
      observer.complete();
    };
    xhr.onerror = (err) => observer.error(err);
  });
  xhr.open("GET", path);
  xhr.send();
  return observer;
}

export function staticFetcher(paths) {
  return Observable.from(paths)
    .switchMap(path => {
      if (isSupportedImg(path))
        return fetchImg(path);
      else if(/.*\.json/i)
        return JSON.parse(fetchFile(path));
      else
        return fetchFile(path);
    });
}
