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
