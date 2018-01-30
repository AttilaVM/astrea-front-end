import { createElement } from "../dom-utils";

export function addNotifyer() {
  const notifyer = createElement(
    "div"
    , null
    , ["notifyerLayout", "notifyer"]
  );
  const notification = createElement("p");

  notifyer.appendChild(notification);

  appDispatcher.addEventListener("upload", (e) => {
    if (e.statusCode === 201) {
      notifyer.classList.add("fadeIn");
      notifyer.classList.add("success");
      notification.innerText = "Sample uploaded";
      setTimeout(
        () => {
          notifyer.classList.remove("fadeIn");
          notifyer.classList.remove("success");
        }
        , 2500);
    }
    else if (e.statusCode === 500){
      notifyer.classList.add("fadeIn");
      notifyer.classList.add("error");
      notification.innerText = "Sample upload failed";
      setTimeout(
        () => {
          notifyer.classList.remove("fadeIn");
          notifyer.classList.remove("error");
        }
        , 2500);
    }
  });

  appDispatcher.addEventListener("usererror", (e) => {
    notifyer.classList.add("fadeIn");
    notifyer.classList.add("error");
    notification.innerText = e.msg;
    setTimeout(
      () => {
        notifyer.classList.remove("fadeIn");
        notifyer.classList.remove("error");
      }
      , 2500);
  });

  return notifyer;
}
