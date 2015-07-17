angular.module('ceaseless.services')
  .factory('scripture', function ($http, ceaselessServiceUrls) {
    // local cache of verses
    var verses = [
    {
      citation: "Matthew 21:22",
      text: "And whatever you ask in prayer, you will receive, if you have faith.",
      shareLink: ceaselessServiceUrls.defaultScriptureShareUrl
    }];

    function getNewScripture() {
      $http.get(ceaselessServiceUrls.votd).
              success(function(data, status, headers, config) {
                if (data.book) {
                  $http.post(ceaselessServiceUrls.getScripture, data)
                    .success(function(data, status, headers, config) {
                      // TODO configure the right bible for the local language
                      data.shareLink = "http://www.bible.is/ENGESV/" +
                        data.book + "/" + data.chapter + "#" + data.verse_start;
                      verses.push(data);
                    });
                }
              });
    }

    var pickScripture = function () {
      var votd = _.sample(verses);
      votd.refresh = getNewScripture;
      votd.getScripture = pickScripture;
      return votd;
    }

    return pickScripture;
  });