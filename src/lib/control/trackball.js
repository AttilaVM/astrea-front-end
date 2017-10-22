import TrackballControls from "three-trackballcontrols";

export function registerTrackballControl(camera
                                  , render
                                  , rotateSpeed = 1
                                  , zoomSpeed = 1.2
                                  , panSpeed = 0.8
                                  , dynamicDampingFactor = 0.3) {
  // Init trackballcontrol
  const controls = new TrackballControls(camera);
  controls.rotateSpeed = rotateSpeed;
  controls.zoomSpeed = zoomSpeed;
  controls.panSpeed = panSpeed;
  controls.dynamicDampingFactor = dynamicDampingFactor;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;

  controls.keys = [ 65, 83, 68 ];
  controls.addEventListener('change', render);

  return controls;
}