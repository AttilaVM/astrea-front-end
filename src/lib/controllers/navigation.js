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

function deconstructUrl(url) {
  const fragmentStart = url.indexOf('#');
  if (fragmentStart == -1)
    return URL_DEFAULTS;
  let fragment = url.substring(fragmentStart + 1);
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

/**
 * Register an URL change to command event translator.
 * @return {?object} Initial command from page-onload URL fragment
 */
export function registerUrlNavigation() {
  const urlData = {};
  function urlHandler() {
    let urlDataSeq = deconstructUrl(window.location.href);
    for (var i = 0; i < URL_FIELDS.length; i++) {
      let name = URL_FIELDS[i];
      let value = urlDataSeq[i] || URL_DEFAULTS[i];
      if (urlData[name] != value) {
        urlData[name] = value;
        appDispatcher.urlCmd(name, value);
      }
    }
    return urlData;
  }
  window.addEventListener("popstate", urlHandler);

  urlHandler();
}
