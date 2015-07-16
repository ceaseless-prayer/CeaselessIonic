angular.module('ceaseless.controllers')

  .controller('ProgressCardController', function($scope, $ionicModal, cardHeight, background) {
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

    $scope.$watch(function(){return background.cardBackground['background-image']}, function(){
      $scope.cardStyles['background-image'] = background.cardBackground['background-image'];
    });

    $scope.cardStyles = angular.extend({}, cardHeight, background.cardBackground);

    $scope.totalPeople = 1102;
    $scope.numberOfPeoplePrayedForThisRound = 134;

  });