angular.module('ceaseless.controllers')

  .controller('PeopleCtrl', function($scope, background, $ionicPlatform, $cordovaContacts) {
    $scope.userMsg = 'waiting for platform readiness';
    $scope.contacts = [];
    $scope.backgroundStyles = background.styles;

    $ionicPlatform.ready(function() {
      $scope.userMsg = 'platform ready';
      if (!navigator.contacts) {
        console.log('Cordova contacts not available.')
      } else {
        $scope.getContactList = function() {
          $scope.userMsg = 'fetching';
          var fields = ['displayName', 'name', 'photos'];
          $cordovaContacts.find({filter: '', fields: fields}).then(function(result) {
            $scope.userMsg = 'in process';
            var contacts = _.filter(result, function (c) {
              return c.name.formatted !== '';
            });
            //for(var i in contacts) {
            //  var c = contacts[i];
            //  if(c.photos.length > 0) {
            //    window.resolveLocalFileSystemURL(c.photos[0].value,
            //      function (fileEntry) {
            //        contacts[i].profilePicture = fileEntry.fullPath;
            //      }, function () {
            //
            //      });
            //  }
            //}

            $scope.userMsg = '';
            $scope.contacts = contacts;

            alert($scope.contacts.length);
          }, function(error) {
            alert("ERROR: " + error);
            $scope.userMsg = error;
          });
        };
      }
    });

  });