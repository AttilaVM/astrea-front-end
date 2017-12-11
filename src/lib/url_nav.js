import { EventDispatcher } from "three";

const URL_FIELDS = ["data"
                    , "a"
                    , "b"
                    , "panX"
                    , "panY"
                    , "zoom"];

const URL_DEFAULTS = [""
                      , 0
                      , 0
                      , 0
                      , 0
                      , 1];

function Emitter() {
  this.urlCmd = function cmd(name, value) {
    this.dispatchEvent({type: "urlcmd"
                        , name: name
                        , value: value});
  };
}
Object.assign(Emitter.prototype, EventDispatcher.prototype);

function deconstructUrl(url) {
  let fragment = url.substring(url.indexOf('#') + 1);
  const urlData = [];
  let fieldBuffer = [];
  for (let i = 0; i < fragment.length; i++) {
    let c = fragment[i];
    if (c == "/") {
      urlData.push(fieldBuffer.join(""));
      fieldBuffer = [];
    }
    else if (i == fragment.length - 1) {
      fieldBuffer.push(c);
      urlData.push(fieldBuffer.join(""));
      fieldBuffer = [];
    }
    else
      fieldBuffer.push(c);
  }
  return urlData;
}

export function urlNav() {
  const emitter = new Emitter();
  const urlData = {};
  function urlHandler() {
    let urlDataSeq = deconstructUrl(window.location.href);
    for (var i = 0; i < URL_FIELDS.length; i++) {
      let name = URL_FIELDS[i];
      let value = urlDataSeq[i] || URL_DEFAULTS[i];
      if (urlData[name] != value) {
        urlData[name] = value;
        emitter.urlCmd(name, value);
      }
    }
    return urlData;
  }
  window.addEventListener("popstate", urlHandler);
  emitter.initialData = urlHandler();
  return emitter;
}
