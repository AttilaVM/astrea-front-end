import { registerUrlNavigation } from "./lib/url_nav";
import { cellvisCtrl } from "./lib/cellvis";
import { mainUi } from "./lib/main-ui";

export function appStart(appContainer, serverAddr) {
  if (serverAddr) {
    // dinamic page
  }
  else {
    const navCtrl = registerUrlNavigation();

    const initialData = navCtrl.initialData.data;
    if (initialData)
      cellvisCtrl(appContainer, initialData);
    else
      mainUi(appContainer);

    navCtrl.addEventListener("urlcmd", function (e) {
      if (e.name == "data")
        if (e.value)
          cellvisCtrl(appContainer, e.value);
    });
  }
}
