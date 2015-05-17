angular.module('ceaseless.services', [])

.provider('background', function () {
    var config = {
      src: 'img/at_the_beach.jpg'
    };

    // initialize the result
    var result = {
      original: config.src,
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

    // utility function
    function getDocHeight() {
      var D = document;
      return Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
      );
    }

    var img = new Image();
    img.onload = function () {
      var docHeight = getDocHeight();
      config.w = Math.round(0.5 * img.naturalWidth * docHeight / img.naturalHeight);
      config.h = Math.round(0.5 * docHeight);

      var canvasId = 'canvas_' + parseInt(Math.random()*1000000000);
      var canvas = document.createElement('canvas');
      canvas.style.display = 'none';
      canvas.id = canvasId;
      canvas.width = config.w;
      canvas.height = config.h;
      document.body.appendChild(canvas);
      var context = canvas.getContext('2d');
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