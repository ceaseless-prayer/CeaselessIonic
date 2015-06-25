angular.module('ceaseless.services', [])

.factory('background', function ($ionicPlatform, $cordovaFile, $http, ceaselessServiceUrls, $cordovaFileTransfer) {
    // defaults
    var config = {
      src: 'img/at_the_beach.jpg'
    };

    // initialize the result
    var result = {
      original: config.src,
      blurred: config.src,
      styles: {
        'background-image':'url()',
        'background-repeat':'no-repeat',
        'background-size': 'cover'
      },
      cardBackground: {
        'background-image':'url()',
        'background-repeat':'no-repeat',
        'background-size': 'cover'
      }
    };

    function generateBackgroundImageCss(url) {
      var colorString = 'rgba(0,1,47,0.4)';
      var urlSuffix = 'url('+url+')';
      var gradients = [
        'linear-gradient(to bottom, '+colorString+','+colorString+')',
        '-webkit-gradient(linear, left top, left bottom, from('+colorString+'),to('+colorString+'))',
        '-webkit-linear-gradient(top, '+colorString+','+colorString+')'
      ];
      return gradients[1] + ',' + urlSuffix;
    }

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
    function setupBlurredImage() {
      var docHeight = getDocHeight();
      // for speed, shrink blurred image by a third
      config.w = Math.round(0.3 * img.naturalWidth * docHeight / img.naturalHeight);
      config.h = Math.round(0.3 * docHeight);

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
      result.styles['background-image'] = generateBackgroundImageCss(result.blurred);
      result.cardBackground['background-image'] = 'url('+result.blurred+')';
      console.log('blur complete');
    }

    function setupBackgroundImage(dynamicImage) {
      if (dynamicImage) {
        config.src = cordova.file.cacheDirectory + 'currentBackgroundImage';
        result.original = config.src;
      }

      img.onload = setupBlurredImage;
      img.crossOrigin = '';
      img.src = config.src;
    }

    function useNewBackgroundImage() {
          $cordovaFile.checkFile(cordova.file.cacheDirectory, 'nextBackgroundImage').then(function (exists) {
            if(exists) {
              $cordovaFile.checkFile(cordova.file.cacheDirectory, 'currentBackgroundImage').then(function (exists) {
                if(exists) {
                  $cordovaFile.removeFile(cordova.file.cacheDirectory, 'currentBackgroundImage').then(function (success) {
                    $cordovaFile.copy(cordova.file.cacheDirectory, 'nextBackgroundImage', cordova.file.cacheDirectory, 'currentBackgroundImage');
                  });
                }
              });
            }
          });
    }

    function fetchNextBackgroundImage() {
      $http.get(ceaselessServiceUrls.getAScriptureImage).
        success(function(data, status, headers, config) {
          if (data.imageUrl) {
            $cordovaFileTransfer.download(data.imageUrl, cordova.file.cacheDirectory + 'nextBackgroundImage', {}, true);
          }
        });
    }

    setupBackgroundImage();
    $ionicPlatform.ready(function () {
      $cordovaFile.checkFile(cordova.file.cacheDirectory, 'currentBackgroundImage')
        .then(setupBackgroundImage);
      useNewBackgroundImage();
      fetchNextBackgroundImage();
    });
    return result;
  })
  .factory('cardHeight', function () {
    var cardHeight = window.innerHeight - 40 - 60;
    return {height: cardHeight + 'px'};
  })
  .factory('ceaselessServiceUrls', function () {
    var urls = {
        'votd': 'http://api.ceaselessprayer.com/v1/votd',
        'getScripture': 'http://api.ceaselessprayer.com/v1/getScripture',
        'announcements': 'http://www.ceaselessprayer.com/announcements/feed',
        'getAScriptureImage': 'http://api.ceaselessprayer.com/v1/getAScriptureImage',
        'defaultScriptureShareUrl': 'http://www.bible.is/ENGESV/Matt/21#22'
    };
    return urls;
  })
  .factory('AppConstants', function () {
    var constants = {
        backgroundFileName: 'currentBackgroundImage'
    };
    return constants;
  });