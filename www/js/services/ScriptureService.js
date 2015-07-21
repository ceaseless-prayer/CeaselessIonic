angular.module('ceaseless.services')
  .factory('scripture', function ($http, ceaselessServiceUrls, $localstorage) {

    var QUEUE_SIZE = 5;

    // initializing the scripture queue
    var scriptureQueue = $localstorage.getObject('scriptureQueue');
    var verses = scriptureQueue.verses || [];
    initScriptureQueue();

    function initScriptureQueue() {
      if(verses.length === 0) {
        verses = [{
                  citation: "Matthew 21:22 ESV",
                  text: "And whatever you ask in prayer, you will receive, if you have faith.",
                  shareLink: ceaselessServiceUrls.defaultScriptureShareUrl
                }];
      }

      //replenish scripture queue
      var versesToFetch = QUEUE_SIZE - verses.length;
      for(var i = 0; i < versesToFetch; i++) {
        getNewScripture();
      }
      saveQueue();
    }

    function saveQueue() {
      scriptureQueue.verses = verses;
      $localstorage.setObject('scriptureQueue', scriptureQueue);
    }

    function pickScripture() {
      return _.last(verses);
    }

    function popScripture() {
      var scripture = verses.pop();
      saveQueue();
      return scripture;
    }

    function getNewScripture() {
      $http.get(ceaselessServiceUrls.votd).
              success(function(data, status, headers, config) {
                if (data.book) {
                  $http.post(ceaselessServiceUrls.getScripture, data)
                    .success(function(data, status, headers, config) {
                      // TODO configure the right bible for the local language
                      data.shareLink = "http://www.bible.is/ENGESV/" +
                        data.book + "/" + data.chapter + "#" + data.verse_start;
                      verses.unshift(data);
                    });
                }
              });
    }

    return {
      pick: pickScripture,
      pop: popScripture
    };
  });