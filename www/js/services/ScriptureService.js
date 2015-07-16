angular.module('ceaseless.services')
  .factory('scripture', function () {

    // local cache of verse
    var verses = [
    {
      citation: "1 Thessalonians 5:16-18 ESV",
      text: "Rejoice always, pray continually, give thanks in all circumstances for this is God's will for you in Christ Jesus"
    },
    {
      citation: "James 5:16 ESV",
      text: "Confess your sins to one another, pray for one another and so be healed."
    },
    {
      citation: "Matthew 7",
      text: "Ask and it will be given to you. Seek and you will find. Knock and the door will be open for you."
    }];

    return function () {
      var votd = _.sample(verses);
      console.log(votd);
      return votd;
    };
  })