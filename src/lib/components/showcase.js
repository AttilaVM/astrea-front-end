import { createElement, addParagraphs } from "/lib/utils/dom.js";
import { fetchFile } from "/lib/utils/fetch.js";

function addSampleCard(sampleName, thumbImgURL, data) {
  console.info(sampleName, thumbImgURL, data);

  // Truncate modification date to minute precision assuming it is standard
  const date = data.updatedAt.substr(
    0
    ,data.updatedAt.lastIndexOf(".")
  );

  const cardDiv = createElement(
    "div"
    , {draggable: "true"}
    , ["cardLayout", "hCenter", "noShrink", "card"]
  );
  const thumbImg = createElement(
    "img"
    , {
      src: thumbImgURL
      , height: 185
      , alt: sampleName
    }
    , ["thumbLayout"
       , "clickable"
       , "enlargeOnHover"
       , "fadeBorderIn"
      ]
  );

  const infoBox = createElement(
    "div"
    , {}
    , ["infoTextLayout", "infoText"]
  );

  addParagraphs(infoBox
                , [  `${sampleName}`
                   , `${date}`
                   , `${data.xScale}:${data.yScale}:${data.zScale}`]
                , {}
                , ["cardText"]);

  cardDiv.appendChild(thumbImg);
  cardDiv.appendChild(infoBox);

  thumbImg.addEventListener("mouseup", () => {
    console.log("UP");
    appDispatcher.download(data);
  });

  return cardDiv;
}

export function addShowcase() {
  const showcase = createElement(
    "div"
    , {}
    , ["row", "wrap", "cardContainer"]
  );

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
