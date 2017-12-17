import { createElement } from "../dom-utils";

export function addNotifyer() {
  const notifyer = createElement("div", null, ["notifyer"]);
  const notification = createElement("p");

  notifyer.appendChild(notification);

  appDispatcher.addEventListener("upload", (e) => {
    if (e.statusCode === 200) {
      notifyer.classList.add("fade-in");
      notification.innerText = "Sample uploaded";
      setTimeout(
        () => notifyer.classList.remove("fade-in")
        , 2500);
    }
    else {
      notifyer.classList.add("fade-in");
      notification.innerText = "Sample upload failed";
      setTimeout(
        () => notifyer.classList.remove("fade-in")
        , 2500);
    }
  });

  appDispatcher.addEventListener("usererror", (e) => {
    notifyer.classList.add("fade-in");
    notification.innerText = e.msg;
    setTimeout(
      () => notifyer.classList.remove("fade-in")
      , 2500);
  });

  return notifyer;
}
