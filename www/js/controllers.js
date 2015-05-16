angular.module('ceaseless.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
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

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

})

.controller('DailyCtrl', function($scope, $state, background, $ionicSlideBoxDelegate) {
  $scope.cards = [
    {
      title: '1 Thessalonians 5:16-18',
      id: 1,
      content: 'Rejoice always, pray without ceasing, give thanks in all circumstances or this is God\'s will for you in Christ Jesus'
    },
    {
      title: 'Natasha Lim',
      id: 2,
      content: 'Pray for her career'
    },
    {
      title: 'Tiffany Lim',
      id: 3,
      content: 'Pray for her relationships'
    },
    {
      title: 'SL',
      id: 4,
      content: 'Pray for her delight in God'
    },
    {
      title: 'Progress',
      id: 5,
      content: '12/240'
    }
  ];
  $scope.slideHasChanged = function (index) {
    console.log(index);
  };

  $scope.openJournal = function () {
    $state.go('app.journal');
  };
  background().blurred.then(function(src) {
    console.log('blur complete');
    $scope.blurredImage = src;
  });
  $scope.backgroundImage = background().original;
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('JournalCtrl', function($scope, $ionicModal) {
    $scope.now = new Date();

    // Create the note editor modal that we will use later
    $ionicModal.fromTemplateUrl('templates/addNote.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.cancelNote = function() {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.addNote = function() {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.saveNote = function() {
      console.log('Saving note', $scope.noteData);

      // save note here.
    };

    $scope.notes = [
      {
        peopleTagged:['Chris','Lim'],
        content: 'This is a note. When will God\'s grace come.'
      },
      {
        peopleTagged:['Natasha','Lim'],
        content: 'This is a note. When will God\'s grace come.'
      },
      {
        peopleTagged:['Tiffany','Lim'],
        content: 'This is a note. When will God\'s grace come.'
      },
      {
        peopleTagged:['S','L'],
        content: 'This is a note. When will God\'s grace come.'
      },
      /*{
        peopleTagged:['Please','Thank you'],
        content: 'Why are you afraid?'
      },
      {
        peopleTagged:['Again','And Again'],
        content: 'Why are you afraid?'
      }   */
    ];

    $scope.noteData = {
      contents: 'This is a test note'
    };

    // list management
    $scope.shouldShowDelete = false;
    $scope.shouldShowReorder = false;
    $scope.listCanSwipe = true

});
