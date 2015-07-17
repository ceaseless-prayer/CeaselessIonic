angular.module('ceaseless.services', [])
  .factory('cardHeight', function () {
    var navHeight = 40;
    var pagerHeight = 60;
    var cardHeight = window.innerHeight - navHeight - pagerHeight;

    var result = {
      style: {height: cardHeight + 'px'},
      height: cardHeight
    };
    return result;
  })
  .factory('ceaselessServiceUrls', function () {
    var urls = {
        'votd': 'http://api.ceaselessprayer.com/v1/votd',
        'getScripture': 'http://api.ceaselessprayer.com/v1/getScripture',
        'announcements': 'http://www.ceaselessprayer.com/announcements/feed',
        'getAScriptureImage': 'http://api.ceaselessprayer.com/v1/getAScriptureImage',
        'defaultScriptureShareUrl': 'http://www.bible.is/ENGESV/Matt/21#22'
    };
    return urls;
  })
  .factory('AppConstants', function () {
    var constants = {
        backgroundFileName: 'currentBackgroundImage'
    };
    return constants;
  });