angular.module('ceaseless.services', [])

.factory('background', ['$q', function($q) {
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
      x:0,
      y:0,
      h:200,
      w:200,
      src: 'img/at_the_beach.jpg'
    };
    var deferred = $q.defer();

    img.onload = function () {
      context.drawImage(img, 0, 0, config.w, config.h);
      boxBlurCanvasRGBA(canvasId, 0, 0, config.w, config.h, 10, 2);
      deferred.resolve(canvas.toDataURL());
    };
    img.crossOrigin = '';
    img.src = config.src;

    window.canvas = canvas;
    return function () {
      return {
        original: config.src,
        blurred: deferred.promise,
        canvas: canvas
      };
    };
  }]);