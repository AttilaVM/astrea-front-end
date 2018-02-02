export function addAttrs(elem, attrObj) {
  for (let attr in attrObj) {
    if(!attrObj.hasOwnProperty(attr))
      continue;
    elem.setAttribute(attr, attrObj[attr]);
  }
  return elem;
}

export function addClasses(elem, classList) {
  for (let className of classList)
    elem.classList.add(className);
  return elem;
}

export function createElement(elemName, attrObj, classList) {
  const elem = document.createElement(elemName);
  if (attrObj)
    addAttrs(elem, attrObj);
  if (classList)
    addClasses(elem, classList);
  return elem;
}

export function addParagraphs(targetElem, strArr, attr = {}, classList = []) {
  for (let str of strArr) {
    let p = (createElement("p", attr, classList));
    p.innerText = str;
    targetElem.appendChild(p);
  }
}

export function addVideo(sourceList, width, height, classList, fallback){
  const video= createElement(
    "video",
    { width: width,
      autoplay: "",
      height: height
    }
  );

  for (let source of sourceList) {
    let sourceElem = createElement
    ( "source",
      {src: source.src, type: source.type});
    video.appendChild(sourceElem);
  }

  if (fallback)
    video.appendChild(fallback);

  return video;
}
