angular.module('ceaseless.controllers')

  .controller('ScriptureCardController', function($scope, $ionicModal, background, cardHeight, scripture) {
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

    $scope.verseImageStyle = {
      'background-image': 'url()',
      'background-size': 'cover',
      'background-repeat': 'no-repeat',
      'width':'100%',
      'height': '50%'
    };
    $scope.blurredImageStyle = angular.copy($scope.verseImageStyle);
    angular.extend($scope.blurredImageStyle, {
      '-webkit-transform':'scaleY(-1)',
      '-ms-transform': 'scaleY(-1)',
      'transform': 'scaleY(-1)'
    });

    var footerHeight = 50;
    verseContainerHeight = cardHeight.height / 2 - footerHeight;

    $scope.verseContainerStyles = {
      'position':'absolute',
      'top':'8px',
      'left':'0px',
      'padding':'8px',
      'height': verseContainerHeight + 'px',
      'overflow':'auto'
    };

    $scope.verseContainerVerticalFlipStyle = {
      'height':'100%',
      'width':'100%',
      '-webkit-transform':'scaleY(-1)',
      '-ms-transform':'scaleY(-1)',
      'transform':'scaleY(-1)'
    };

    $scope.footerStyle = {
      'width':'100%',
      'position':'absolute',
      'color':'white',
      'bottom':'8px',
      'padding':'0 8px',
      'text-align':'center'
    };

    $scope.darkenOverlayStyle = {
      'height':'100%',
      'width':'100%',
      'background-color':'rgba(0, 1, 47, 0.4)'
    };

    $scope.shareButtonStyle = {
      'position':'absolute',
      'bottom':'0px',
      'right':'8px',
      'font-size':'32px',
      'color':'white'
    };

    $scope.$watch(function(){return background.blurred}, function(){
      $scope.blurredImageStyle['background-image'] = 'url('+background.blurred+')';
    });

    $scope.$watch(function(){return background.original}, function(){
      $scope.verseImageStyle['background-image'] = 'url('+background.original+')';
    });

    var votd = scripture();
    $scope.refresh = function () {
      votd.refresh();
      votd = votd.getScripture();
      $scope.card.title = votd.citation;
      $scope.card.content = votd.text;
    };

    $scope.cardHeightStyle = cardHeight.style;

    $scope.showShareDialog = function () {
      window.socialmessage.send({"url":$scope.card.extra.shareLink});
    };
  });
