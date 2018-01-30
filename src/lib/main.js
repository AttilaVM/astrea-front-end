import { urlNav } from "./url_nav";
import { cellvisCtrl } from "./cellvis";

export function appStart(appContainer, serverAddr) {
  if (serverAddr) {
    // dinamic page
  }
  else {
    const navCtrl = urlNav();

    const initialData = navCtrl.initialData.data;
    if (initialData)
      cellvisCtrl(initialData);

    navCtrl.addEventListener("urlcmd", function (e) {
      if (e.name == "data")
        cellvisCtrl(e.value);
    });
  }
}
