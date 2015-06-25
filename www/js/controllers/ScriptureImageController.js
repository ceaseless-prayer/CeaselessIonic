angular.module('ceaseless.controllers')
  .controller('ScriptureImageController', function($http, $ionicPlatform, ceaselessServiceUrls, $cordovaFileTransfer, $cordovaFile) {

    $ionicPlatform.ready(function () {
//      useNewBackgroundImage();
//      fetchNextBackgroundImage();
    });

    function useNewBackgroundImage() {
          $cordovaFile.checkFile(cordova.file.cache, 'nextBackgroundImage').then(function (exists) {
            if(exists) {
              $cordovaFile.checkFile(cordova.file.cache, 'currentBackgroundImage').then(function (exists) {
                if(exists) {
                  $cordovaFile.removeFile(cordova.file.cache, 'currentBackgroundImage').then(function (success) {
                    $cordovaFile.copy(cordova.file.cache, 'nextBackgroundImage', cordova.file.cache, 'currentBackgroundImage');
                  });
                }
              });
            }
          });
    }

    function fetchNextBackgroundImage() {
      $http.get(urls.getAScriptureImage).
        success(function(data, status, headers, config) {
          if (data.imageUrl) {
            $cordovaFileTransfer.downloadFile(data.imageUrl, cordova.file.cache + 'nextBackgroundImage', {}, true);
          }
        });
    }
  });