import { createElement } from "../dom-utils";

export function addShowcase() {
  const showcase = createElement("div");

  appDispatcher.addEventListener(
    "renderstart"
    , () => showcase.style.display = "none");
  appDispatcher.addEventListener(
    "renderstop"
    , () => showcase.style.display = "block");

  return showcase;
}
