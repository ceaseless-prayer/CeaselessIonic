angular.module('ceaseless.controllers')
  .controller('NoteCtrl', function($scope, $stateParams, background, $ionicPlatform, $cordovaContacts) {

    $scope.noteData = {
      id: $stateParams.noteId,
      peopleTagged: [],
      contents: 'This is a test note'
    };


  });