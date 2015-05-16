// blur effect directive from:
// https://veamospues.wordpress.com/2013/10/13/angularjs-blurred-image-directive/
var ios7login = angular.module('ios7login', []);

ios7login.controller('srcManager', ['$scope', function($scope){
  $scope.srcFile = '../img/at_the_beach.jpg';
  $scope.setSrc = function(src){
    $scope.srcFile = src;
  };
}]);

ios7login.controller('loginCtrl', ['$scope', function($scope){
  $scope.doLogin = function(){
    alert('login success!');
  };
}]);

ios7login.directive('blurredImage', function(){
  return {
    restrict: 'E',
    replace:true,
    scope: {
      src:'@',
      width:'=',
      height:'=',
      cssClass:'='
    },
    link: function(scope, element, attrs){
      scope.itemId = "canvas_" + parseInt(Math.random()*1000000000)
      var fillCanvas = function(){
        if(!scope.src)
          return;

        var context = element[0].getContext("2d"); // get the 2d context object
        var img     = new Image(); //create a new image

        img.onload = function(){
          context.drawImage(img, 0, 0, scope.width, scope.height); // draw the image at the given location
          boxBlurCanvasRGBA( scope.itemId, 0, 0, scope.width, scope.height, 34, 2);
          setupElementBackgroundImage();
        };

        img.crossOrigin = '';
        img.src = scope.src;

        function setupElementBackgroundImage() {
          var imageDataURL = element[0].toDataURL();
          element[0].parentElement.parentElement.style.backgroundImage =
            "url('"+imageDataURL+"')";
        }
      }

      scope.$watch('src', function(){
        fillCanvas();
      });
    },
    template: '<canvas id="{{ itemId }}" class="{{ cssClass }}" style="width:{{width}}px; height:{{height}}px"></canvas>'
  };
});