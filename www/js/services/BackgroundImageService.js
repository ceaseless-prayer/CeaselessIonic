angular.module('ceaseless.services')
  .factory('background', function ($ionicPlatform, $cordovaFile, $http, ceaselessServiceUrls, $rootScope, $cordovaFileTransfer) {
    var CURRENT = 'currentBackgroundImage';
    var NEXT = 'nextBackgroundImage';
    var DOWNLOADING = 'downloadingBackgroundImage';

    // defaults
    var config = {
      src: 'img/at_the_beach.jpg'
    };

    // initialize the result
    var result = {
      original: config.src,
      blurred: '',
      styles: {
        'background-image': 'url()',
        'background-repeat': 'no-repeat',
        'background-size': 'cover',
        'background-color': 'rgb(102, 103, 149)'
      },
      cardBackground: {
        'background-image':'url()',
        'background-repeat':'no-repeat',
        'background-size': 'cover'
      },
      refresh: function () {
         console.log('refreshing background');
         return $cordovaFile.checkFile(cordova.file.cacheDirectory, CURRENT)
                 .then(setupBackgroundImage, function (error) {
                  console.log(JSON.stringify(error));
                  return setupBackgroundImage();
                 });
      }
    };

    // initializing the image
    var img = new Image();

    $ionicPlatform.ready(function () {
      useNewBackgroundImage()
        .then(fetchNextBackgroundImage);
    });

    function setupBackgroundImage(dynamicImage) {
      console.log('dynamicImage?', dynamicImage);

      if (dynamicImage) {
        console.log('changing the image');
        config.src = cordova.file.cacheDirectory + CURRENT;
        result.original = cordova.file.cacheDirectory + CURRENT;
      }

      img.onload = setupBlurredImage;
      img.crossOrigin = '';
      img.src = config.src;
      return true;
    }

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
      var imageData = getCanvasImageData(canvasId, 0, 0, config.w, config.h);

      var worker = new Worker('lib/imageBlur.js');
      worker.onmessage = function (e) {
        putCanvasImageData(canvasId, e.data.imageData, 0, 0);
        result.blurred = canvas.toDataURL();
        result.styles['background-image'] = generateBackgroundImageCss(result.blurred);
        result.cardBackground['background-image'] = 'url('+result.blurred+')';
        console.log('blur complete');
      };
      worker.postMessage({
        imageData: imageData,
        top_x: 0,
        top_y: 0,
        width: config.w,
        height: config.h,
        radius: 30,
        iterations: 2
      });
    }

    function getCanvasImageData (id, top_x, top_y, width, height) {
      var canvas  = document.getElementById( id );
    	var context = canvas.getContext('2d');
    	var imageData;

    	try {
    	  try {
    		  imageData = context.getImageData( top_x, top_y, width, height );
    	  } catch(e) {
          // NOTE: this part is supposedly only needed if you want to work with local files
          // so it might be okay to remove the whole try/catch block and just use
          // imageData = context.getImageData( top_x, top_y, width, height );
          try {
            if (typeof(netscape) !== 'undefined') {
              netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserRead');
            }
            imageData = context.getImageData( top_x, top_y, width, height );
          } catch(e) {
            alert('Cannot access local image');
            throw new Error('unable to access local image data: ' + e);
            return;
          }
    	  }
    	} catch(e) {
    	  alert('Cannot access image');
    	  throw new Error('unable to access image data: ' + e);
    	  return;
    	}
    	return imageData;
    }

    function putCanvasImageData (id, imageData, top_x, top_y) {
      var canvas  = document.getElementById( id );
      var context = canvas.getContext('2d');
      context.putImageData( imageData, top_x, top_y );
    }

    function useNewBackgroundImage() {
        var checkNext = function () {
            console.log('checking for next file');
            return $cordovaFile.checkFile(cordova.file.cacheDirectory, NEXT);
        };

        var checkCurrent = function (hasNext) {
            console.log('checking for current file');
            if(hasNext) {
              return $cordovaFile.checkFile(cordova.file.cacheDirectory, CURRENT);
            } else {
              return false;
            }
        };

        var cleanUpCurrentAndUpdate = function (hasCurrent) {
            console.log('cleaning up current file');
            if(hasCurrent) {
              return $cordovaFile.removeFile(cordova.file.cacheDirectory, CURRENT).then(updateBackgroundImage);
            } else {
              return updateBackgroundImage();
            }
        };

        var initializeDynamicBackgrounds = function () {
          console.log('attempting to initialize dynamic background images');
          result.refresh()
            .then(fetchNextBackgroundImage);
        };

        var updateBackgroundImage = function () {
            console.log('copying over background file');
            return $cordovaFile.copyFile(cordova.file.cacheDirectory, NEXT, cordova.file.cacheDirectory, CURRENT);
        };

        return checkNext()
          .then(checkCurrent, initializeDynamicBackgrounds)
          .then(cleanUpCurrentAndUpdate, updateBackgroundImage)
          .then(result.refresh)
          .then(function () {
            $rootScope.$broadcast('backgroundServiceReady');
          });
    }

    function fetchNextBackgroundImage() {
      $http.get(ceaselessServiceUrls.getAScriptureImage).
        success(function(data, status, headers, config) {
          if (data.imageUrl) {
            $cordovaFileTransfer.download(data.imageUrl, cordova.file.cacheDirectory + DOWNLOADING, {}, true)
            .then(function () {
                $cordovaFile.moveFile(cordova.file.cacheDirectory, DOWNLOADING, cordova.file.cacheDirectory, NEXT);
            });
          }
        });
    }

    return result;
  });