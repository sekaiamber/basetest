let ready = false;

function onDeviceReady() {
  ready = true;
}
document.addEventListener('deviceready', onDeviceReady, false);

function vibration(time) {
  if (!ready) return;
  navigator.vibrate(time);
}

export default vibration;
