// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('ceaseless', ['ionic', 'ionic.utils', 'ceaseless.controllers', 'ceaseless.services', 'QuickList', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    if(window.screen.lockOrientation) {
      // net.yoik.cordova.plugins.screenorientation required
      screen.lockOrientation('portrait');
    }
  });
})

.run(function(background) {
  // initialize background provider.
  console.log(background);
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.daily', {
    url: '/daily',
    views: {
      'menuContent': {
        templateUrl: 'templates/daily.html',
        controller: 'DailyCtrl'
      }
    }
  })

  .state('app.journal', {
    url: '/journal',
    views: {
      'menuContent': {
        templateUrl: 'templates/journal.html',
        controller: 'JournalCtrl'
      }
    }
  })

  .state('app.note', {
    url: '/journal/:noteId',
    views: {
      'menuContent': {
        templateUrl: 'templates/addNote.html',
        controller: 'NoteCtrl'
      }
    }
  })

  .state('app.people', {
    url: '/people',
    views: {
      'menuContent': {
        templateUrl: 'templates/people.html',
        controller: 'PeopleCtrl'
      }
    }
  })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/daily');
})
.config( [
  '$compileProvider',
  function( $compileProvider )
  {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|content|data):/);
  }
]);
