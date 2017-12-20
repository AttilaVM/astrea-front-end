import { createElement } from "../dom-utils";
import { fetchFile } from "../image_loader.js";

function addSampleCard(sampleName, thumbImgURL, data) {
  console.info(sampleName, thumbImgURL, data);
  const cardDiv = createElement("div");
  const thumbImg = createElement(
    "img"
    , {
      src: thumbImgURL
      , width: 300
      , alt: sampleName});
  cardDiv.appendChild(thumbImg);

  cardDiv.addEventListener("mouseup", () => {
    console.log("UP");
    appDispatcher.download(data);
  });

  return cardDiv;
}

export function addShowcase() {
  const showcase = createElement("div");

  appDispatcher.addEventListener(
    "renderstart"
    , () => showcase.style.display = "none");
  appDispatcher.addEventListener(
    "renderstop"
    , () => showcase.style.display = "block");

  // get sample data
  fetchFile("data", (JSON.parse))
    .then((data) => {
      for (let sample of data) {
        console.log(data);
        showcase.appendChild(addSampleCard(
          sample.sampleName
          , sample.thumbImgPath
          , sample));
      }
    });

  return showcase;
}
