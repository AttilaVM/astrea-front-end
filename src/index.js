import { AppDispatcher } from "./lib/app-dispatcher.js";
import { registerUrlNavigation } from "./lib/url_nav";
import { getRenderCtrl } from "./lib/controllers/render-ctrl.js";
import { addImgLoaderBtn } from "./lib/main-ui";
import { addShowcase } from "./lib/components/showcase";
import { staticFetcher } from "./lib/services/fetchers.js";

export function appStart(appContainer, serverAddr) {
  // Add application level event dispatcher to the global scope
  window.appDispatcher = new AppDispatcher();

  // Instanciate GUI elements
  const showcase = addShowcase();
  const imgLoaderBtn = addImgLoaderBtn();

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
  appDispatcher.addEventListener("voxeldataload", console.log);

  // Register services
  registerUrlNavigation();

  // Populate the browser DOM
  showcase.appendChild(imgLoaderBtn);
  appContainer.appendChild(showcase);
}
