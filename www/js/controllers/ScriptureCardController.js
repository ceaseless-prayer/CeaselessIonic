angular.module('ceaseless.controllers')

  .controller('ScriptureCardController', function($scope, $ionicModal, background, cardHeight) {
    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      $scope.modal.hide();
    };

    $scope.verseImageStyle = {
      'background-image': 'url()',
      'background-size': 'cover',
      'background-repeat': 'no-repeat',
      'width':'100%',
      'height': '50%'
    };
    $scope.blurredImageStyle = angular.copy($scope.verseImageStyle);
    angular.extend($scope.blurredImageStyle, {
      '-webkit-transform':'scaleY(-1)',
      '-ms-transform': 'scaleY(-1)',
      'transform': 'scaleY(-1)'
    });

    $scope.$watch(function(){return background.blurred}, function(){
      $scope.blurredImageStyle['background-image'] = 'url('+background.blurred+')';
    });

    $scope.$watch(function(){return background.original}, function(){
      $scope.verseImageStyle['background-image'] = 'url('+background.original+')';
    });

    $scope.cardHeightStyle = cardHeight;

    $scope.showShareDialog = function () {
      window.socialmessage.send({"text":"hello world"});
    };
  });
