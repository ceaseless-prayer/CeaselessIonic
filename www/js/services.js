angular.module('ceaseless.services', [])

.provider('background', function () {
    // initialize the result
    var result = {
      original: '',
      blurred: '',
      styles: {
        'background-image':'url()',
        'background-repeat':'no-repeat',
        'background-size': 'cover'
      }
    };

    // return a function that will supply
    // the background image
    // the blurred version
    // and the flipped+blurred version
    var canvasId = 'canvas_' + parseInt(Math.random()*1000000000);
    var canvas = document.createElement('canvas');
    canvas.style.display = 'none';
    canvas.id = canvasId;
    document.body.appendChild(canvas);
    var context = canvas.getContext('2d');

    var img = new Image();

    var config = {
      src: 'img/at_the_beach.jpg'
    };
    result.original = config.src;

    img.onload = function () {
      var doc = window.document;
      config.w = ~~(0.5 * img.naturalWidth * doc.height / img.naturalHeight);
      config.h = ~~(0.5 * doc.height);
      // wd / wn = hd / hn
      // wd = wn * hd / hn
      canvas.width = config.w;
      canvas.height = config.h;
      //canvas.style.width = config.w * 2;
      //canvas.style.height = config.h * 2;
      context.drawImage(img, 0, 0, config.w, config.h);
      boxBlurCanvasRGBA(canvasId, 0, 0, config.w, config.h, 30, 2);
      result.blurred = canvas.toDataURL();
      result.styles['background-image'] = 'url('+result.blurred+')';
      console.log('blur complete');
    };

    img.crossOrigin = '';
    img.src = config.src;

    this.$get = function () {
      return new function () {
        return result;
      };
    };

  });