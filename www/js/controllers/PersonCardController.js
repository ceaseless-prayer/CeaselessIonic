angular.module('ceaseless.controllers')

  .controller('PersonCardController', function($scope, $ionicModal, background, cardHeight) {
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

    $scope.cardStyles = angular.extend({}, cardHeight, background.cardBackground);

  });