function getRbgaArr(img) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height).data;
}

/**
 * Asynchronoulsy loads the stackimage and its associated data.
 * @param {string} imgUrl url to the vertical montage image of the stack.
 * @param {string} sampleDataUrl path to the json containing voxel data/metada such as its scale and cell positions.
 * @return {Promise.<array>} The first element of the aray is a falt 8bit RGBA byte the second is the voxel data defined by the refernced json
 */
export function fetchVoxelData(imgUrl, sampleDataUrl) {
  const stackLoadPromise = new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = (event) => {
      console.log(event);
      resolve(getRbgaArr(image));
    };
    image.onerror = (err) => {
      reject(err);
    };
    image.src = imgUrl;
  });

  const sampleLoadPromise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      resolve(JSON.parse(xhr.responseText));
    };
    xhr.onerror = () => {
      reject(xhr.statusText);
    };
    xhr.open("GET", sampleDataUrl);
    xhr.send();
  });

  return Promise.all([stackLoadPromise, sampleLoadPromise]);
}
