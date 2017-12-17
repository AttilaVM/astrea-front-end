function createConsole(elem) {
  const consoleElem = document.createElement("div");
  elem.appendChild(consoleElem);

  const consoleCtrl = {};

  function addEntry(text, style) {
    const newLine = createElement("div", {class: style});
    const p = createElement("p");
    p.innerHTML = text;
    newLine.appendChild(p);
    consoleElem.appendChild(newLine);


  }

  consoleCtrl.showErr = function showErr(text) {
    addEntry(text, "error");
  };

  consoleCtrl.showWarn = function showWarn(text) {
    addEntry(text, "warning");
  };

  consoleCtrl.showHint = function showHint(text) {
    addEntry(text, "hint");
  };

  consoleCtrl.showInfo = function showInfo(text) {
    addEntry(text, "info");
  };

  return consoleCtrl;
}
