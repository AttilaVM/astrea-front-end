export function uploadSample(appData, sampleBlob, screenShotBlob) {
  const sampleName = appData.sampleName;
  const sampleFileName = sampleName + ".png";

  const appDataFile = new File(
    [JSON.stringify(appData)]
    , "voxelData"
    , {type: "application/json"}
  );
  const formData = new FormData();
  formData.append("voxel_img", sampleBlob, sampleFileName);
  formData.append("thumb_img", screenShotBlob, sampleFileName);
  formData.append("app_data", appDataFile);
  console.log(formData);
  const xhr = new XMLHttpRequest();
  xhr.open('POST'
           , sampleName
           , true);
  console.log(xhr);
  xhr.onload = () => {
    appDispatcher.upload(xhr.status);
  };
  xhr.onerror = () => {
    appDispatcher.upload(xhr.status);
  };
  xhr.send(formData);
}
