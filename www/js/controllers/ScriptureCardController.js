angular.module('ceaseless.controllers')

  .controller('ScriptureCardController', function($scope, $ionicModal, background) {
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

    $scope.$watch(function(){return background.blurred}, function(newVal, oldVal){
      $scope.blurredImage = newVal;
    });

    var cardHeight = window.innerHeight - 40 - 60;
    $scope.cardHeightStyle = {height: cardHeight + 'px'};

    $scope.verseImage = background.original;
    $scope.blurredImage = background.blurred;
    $scope.showShareDialog = function () {
      window.socialmessage.send({"text":"hello world"});
    };
  });
