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

    $scope.$watch(function(){return background.cardBackground['background-image']}, function(){
      $scope.cardStyles['background-image'] = background.cardBackground['background-image'];
    });

    $scope.cardStyles = angular.extend({}, cardHeight, background.cardBackground);
    var inlineNotesHeight = window.innerHeight - 40 - 60 - 150 - 60;
    $scope.inlineNotesStyle = {
      'height': inlineNotesHeight + 'px',
      'width': '100%',
      'background-color':'rgba(0, 1, 47, 0.6)'
    }
  });