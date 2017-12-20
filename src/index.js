import { AppDispatcher } from "./lib/app-dispatcher.js";
import { registerUrlNavigation } from "./lib/url_nav";
import { getRenderCtrl } from "./lib/controllers/render-ctrl.js";
import { addImgLoaderBtn } from "./lib/main-ui";
import { addMontageDownloadBtn } from "./lib/components/montage-downloat-btn.js";
import { addNotifyer } from "./lib/components/notifyer.js";
import { addShowcase } from "./lib/components/showcase";
import { staticFetcher } from "./lib/services/fetchers.js";

export function appStart(appContainer, serverAddr) {
  // Add application level event dispatcher to the global scope
  window.appDispatcher = new AppDispatcher();

  // Instanciate GUI elements
  const showcase = addShowcase();
  const imgLoaderBtn = addImgLoaderBtn();
  const montageDownloadBtn = addMontageDownloadBtn();
  const notifyerArea = addNotifyer();

  // Create render Controler
  const renderCtrl = getRenderCtrl(appContainer);

  // Add top-level event listeners
  appDispatcher.addEventListener(
    "urlcmd"
    , e => {
      if (e.name == "data")
        if (e.value)
          renderCtrl(e.value);
    } );
  appDispatcher.addEventListener(
    "voxeldataload"
    , (e) => renderCtrl(e.volCanvas)
  );
  appDispatcher.addEventListener(
    "download"
    , (e) => renderCtrl(e.data)
  );


  // Register services
  registerUrlNavigation();

  // Populate the browser DOM
  showcase.appendChild(imgLoaderBtn);
  showcase.appendChild(montageDownloadBtn);
  appContainer.appendChild(showcase);
  appContainer.appendChild(notifyerArea);
}
