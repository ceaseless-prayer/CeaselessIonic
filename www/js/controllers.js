angular.module('ceaseless.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, background) {
  // controller for menu
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

  $scope.refreshBackground = function () {
    background.refresh();
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

  $scope.$watch(function(){background.blurred}, function(){
    $scope.backgroundStyles = background.styles;
  });

  $scope.backgroundStyles = background.styles;
})

.controller('DailyCtrl', function($scope, $state, $ionicPlatform, $ionicSlideBoxDelegate, scripture, PeopleService, background) {
  $scope.backgroundStyles = background.styles;
  var votd = scripture.pick();
  $scope.cards = [
    {
      title: votd.citation,
      id: 1,
      content: votd.text,
      extra: votd,
      template: 'templates/views/ScriptureCardView.html'
    },
    {
      title: 'Natasha Lim',
      id: 2,
      content: 'Pray for her career',
      template: 'templates/views/PersonCardView.html'
    },
    {
      title: 'Tiffany Lim',
      id: 3,
      content: 'Pray for her relationships',
      template: 'templates/views/PersonCardView.html'
    },
    {
      title: 'SL',
      id: 4,
      content: 'Pray for her delight in God',
      template: 'templates/views/PersonCardView.html'
    },
    {
      title: 'Progress',
      id: 5,
      content: '12/240',
      template: 'templates/views/ProgressCardView.html'
    }
  ];

  function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  $ionicPlatform.ready( function() {
    if (!navigator.contacts) {
      console.log('Cordova contacts not available.');
    } else {
      // TODO need a cross platform way to handle this.
      var alphabet = ['Natasha Lim','Tiffany Lim','Shanna Larson'];
      angular.forEach(alphabet, function (l, i) {
        var options = new ContactFindOptions();
        options.multiple = true;
        options.filter = l;
        navigator.contacts.find(['displayName', 'name', 'photos'], function (contacts) {
          if(contacts[0].name) {
            $scope.cards[i+1].title = contacts[0].name.formatted;
          }

          if(contacts[0].photos) {
            console.log('# of photos', contacts[0].photos.length);
            $scope.cards[i+1].profilePicture = contacts[0].photos[0].value;
          } else {
            $scope.cards[i+1].initials = PeopleService.getInitialsForContact(contacts[0]);
          }
        }, undefined, options);
      });
    }
  });

  $scope.slideHasChanged = function (index) {
    console.log(index);
  };

  $scope.openJournal = function () {
    //$scope.transitioning = true;

//    var options = {
//      "origin"         : "right", // 'left|right', open the drawer from this side of the view, default 'left'
//      "action"         : "open", // 'open|close', default 'open', note that close is not behaving nicely on Crosswalk
//      "duration"       :    300, // in milliseconds (ms), default 400
//      "iosdelay"       :     50, // ms to wait for the iOS webview to update before animation kicks in, default 60
//      "href"           : "#/app/journal"
//    };
//    window.plugins.nativepagetransitions.drawer(
//      options,
//      function (msg) {console.log("success: " + msg)}, // called when the animation has finished
//      function (msg) {alert("error: " + msg)} // called in case you pass in weird values
//    );

    $state.go('app.journal')
      .then(function(current) {
        $scope.transitioning = false;
      });
  };
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('JournalCtrl', function($scope, $state, notes, background) {
    $scope.backgroundStyles = background.styles;

    // Open the login modal
    $scope.addNote = function() {
      $state.go('app.note');
    };

    $scope.notes = [
      {
        id:2,
        peopleTagged:['Natasha','Lim'],
        text: 'This is a note. When will God\'s grace come.'
      },
      {
        id:3,
        peopleTagged:['Tiffany','Lim'],
        text: 'This is a note. When will God\'s grace come.'
      },
      {
        id:4,
        peopleTagged:['S','L'],
        text: 'This is a note. When will God\'s grace come.'
      }
    ];

    notes.listNotes().then(function (loadedNotes) {
      $scope.notes = loadedNotes.concat($scope.notes);
    });


    // list management
    $scope.shouldShowDelete = false;
    $scope.shouldShowReorder = false;
    $scope.listCanSwipe = false;

});
