angular.module('ceaseless.controllers')

  .controller('PersonCardController', function($scope, $ionicModal, background) {
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

    background().blurred.then(function(src) {
      console.log('blur complete');
      $scope.blurredImage = src;
    });
    $scope.backgroundImage = background().original;

  });