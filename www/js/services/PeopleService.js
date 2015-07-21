angular.module('ceaseless.services')
  .factory('PeopleService', function ($cordovaSQLite, AppConstants, ceaselessServiceUrls) {
//    var db = $cordovaSQLite.openDB(AppConstants.databaseName);
//    db.transaction(function (tx) {
//      tx.executeSql('CREATE TABLE IF NOT EXISTS PersonIdentifier (ceaselessId text primary key, favoritedDate text, lastInvitedDate text, removedDate text, systemRemovedDate text)');
//      tx.executeSql('CREATE TABLE IF NOT EXISTS PersonInfo (id integer primary key, text text, createDate text, lastUpdatedDate text)');
//      tx.executeSql('CREATE TABLE IF NOT EXISTS PrayerRecord (id integer primary key, createDate text, type text, person text)');
//    });

    function objectFromRow (row) {
      var personObj = {};
      personObj.ceaselessId = row.ceaselessId;
      personObj.favoritedDate = row.favoritedDate;
      personObj.lastInvitedDate = row.lastInvitedDate;
      personObj.removedDate = row.removedDate;
      personObj.systemRemovedDate = row.systemRemovedDate;
      // representativeInfo
      // queued
      // prayerRecords
      // phoneNumbers
      // notes
      // lastNames
      // firstNames
      // emails
      // addressBookIds
      return personObj;
    }

    function listPeople() {
      var query = 'SELECT * FROM PersonIdentifier';
    }

    function getContact(id) {
      var query = 'SELECT * FROM PersonIdentifier WHERE id = ?';
    }

    function saveContact(contact) {
      var query = '';
    }

    function deleteContact(contact) {
      var query = '';
    }

    function getInitialsForContact(contact) {
      var givenName = contact.name.givenName || '';
      var familyName = contact.name.familyName || '';
      return givenName.substring(0,1) + familyName.substring(0,1);
    }

    return {
      getInitialsForContact: getInitialsForContact
    };
  });