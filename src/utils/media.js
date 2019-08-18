let ready = false;

function onDeviceReady() {
  ready = true;
}
document.addEventListener('deviceready', onDeviceReady, false);

function play(src) {
  if (!ready) return;
  const { Media } = window;
  const media = new Media(src);
  media.play();
}

export {
  play,
};
