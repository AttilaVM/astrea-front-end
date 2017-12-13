export function addAttrs(elem, attrObj) {
  for (let attr in attrObj) {
    if(!attrObj.hasOwnProperty(attr))
      continue;
    elem.setAttribute(attr, attrObj[attr]);
  }
  return elem;
}

export function createElement(elemName, attrObj) {
  const elem = document.createElement(elemName);
  if (attrObj)
    return addAttrs(elem, attrObj);
  else
    return elem;
}
