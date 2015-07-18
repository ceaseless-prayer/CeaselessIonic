angular.module('ceaseless.controllers')
  .controller('NoteCtrl', function($scope, $filter, $stateParams, notes, background, $ionicPlatform, $cordovaContacts) {

    //prototype note data
    $scope.noteData = {
      text: 'This is a test note',
      lastUpdatedDate: new Date(),
      peopleTagged: []
    };

    if ($stateParams.noteId) {
      notes.getNote($stateParams.noteId).then(function (noteObj) {
        $scope.noteData = noteObj;
        console.log(JSON.stringify(noteObj));
        $scope.title = $filter('date')(Date.parse(noteObj.lastUpdatedDate), 'short');
      });
    } else {
      // default is show now as the title.
      $scope.title = $filter('date')(new Date(), 'short');
    }

    $scope.saveNote = function() {
      notes.saveNote($scope.noteData);
    };
  });