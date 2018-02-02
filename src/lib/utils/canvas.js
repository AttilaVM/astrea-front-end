export function screenShot(canvas) {
  const a = document.createElement("a");
  a.href = canvas.toDataURL();
  window.addEventListener("mouseup", () => {
    a.download = "screenshot";
  });
}
