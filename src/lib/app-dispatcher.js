import { EventDispatcher } from "three";
import { fetchFile } from "/lib/utils/fetch.js";

export class AppDispatcher extends EventDispatcher {
  constructor() {
    super();
    this.vertexShaderPromise = fetchFile("shaders/volumetric-vertex.glsl");
    this.fragmentShaderPromise = fetchFile("shaders/volumetric-fragment.glsl");
  }

  urlCmd(name, value) {
    this.dispatchEvent(
      {
        type: "urlcmd",
        name: name,
        value: value
      });
  }

  voxelDataLoad(voxelData) {
    this.dispatchEvent(
      {
        type: "voxeldataload",
        volCanvas: voxelData
      });
  }

  download(data) {
    this.dispatchEvent({
      type: "download",
      data: data
    });
  }

  renderStart() {
    this.dispatchEvent({
      type: "renderstart"
    });
  }

  renderStop() {
    this.dispatchEvent({
      type: "renderstop"
    });
  }

  upload(statusCode) {
    this.dispatchEvent({
      type: "upload",
      statusCode: statusCode
    });
  }

  userError(msg) {
    this.dispatchEvent({
      type: "usererror",
      msg: msg
    });
  }

}
