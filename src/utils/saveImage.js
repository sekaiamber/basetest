function saveImageToPhone(url, success, error) {
  var canvas, context, imageDataUrl, imageData;
  var img = new Image();
  img.onload = function () {
    // 建立 canvas 物件
    canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    // Get '2d' context and draw the image.
    context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);
    // Get canvas data URL
    try {
      // imageDataUrl = canvas.toDataURL('image/jpeg', 1.0);
      // imageData = imageDataUrl.replace(/data:image\/jpeg;base64,/, '');
      // cordova.exec(
      //   success,
      //   error,
      //   'Canvas2ImagePlugin',
      //   'saveImageDataToLibrary',
      //   [imageData]
      // );
      if (window.cordova) {
        window.canvas2ImagePlugin.saveImageDataToLibrary(success, error, canvas);
      }
    }
    catch (e) {
      error(e.message);
    }
  };
  try {
    img.src = url;
  }
  catch (e) {
    error(e.message);
  }
}

export default saveImageToPhone;

/* eslint-disable no-unused-expressions */
// function saveImageToPhone(url, success, error) {
//   if (window.cordova) {
//     window.canvas2ImagePlugin.saveImageDataToLibrary(() => {
//       console.log('sc');
//     }, () => {
//       console.log('err');
//     }, );
//   }
//   console.log(url);
// }

// export default saveImageToPhone;

