angular.module('ceaseless.services')
  .factory('PeopleService', function ($ionicPlatform, $cordovaSQLite, AppConstants, ceaselessServiceUrls, $cordovaContacts) {
    var db = $cordovaSQLite.openDB(AppConstants.databaseName);

    function setupPeopleEntity (db) {
      db.transaction(function (tx) {
        tx.executeSql('DROP TABLE IF EXISTS testPersonTable');
        tx.executeSql('CREATE TABLE IF NOT EXISTS testPersonTable (ceaselessId text primary key, displayName text, profilePicture text, initials varchar(4))');
//        tx.executeSql('CREATE TABLE IF NOT EXISTS PersonIdentifier (ceaselessId text primary key, favoritedDate text, lastInvitedDate text, removedDate text, systemRemovedDate text)');
//        tx.executeSql('CREATE TABLE IF NOT EXISTS PersonInfo (id integer primary key, text text, createDate text, lastUpdatedDate text)');
//        tx.executeSql('CREATE TABLE IF NOT EXISTS PrayerRecord (id integer primary key, createDate text, type text, person text)');
      });
    }


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

    function syncWithContacts() {
      console.log('called sync');
      $ionicPlatform.ready(function() {
        if (!navigator.contacts) {
          console.log('Cordova contacts not available.')
        } else {
          var syncContactList = function() {
            console.log('syncing contacts');

            var fields = ['displayName', 'name', 'photos'];
            $cordovaContacts.find({filter: '', fields: fields}).then(function(result) {
              var contacts = _.sortBy(_.filter(result, function (c) {
                return c.name.formatted !== ''
                  && !_.startsWith(c.name.formatted, '#')
                  && !isEmail(c.name.formatted);
              }), 'displayName');

              console.log('creating contacts');
              for(var i in contacts) {
                var c = contacts[i];
                if(c.photos) {
                  c.profilePicture = c.photos[0].value;
                }
                c.initials = getInitialsForContact(c);
                saveContact(c);
              }
            }, function(error) {
              console.log('ERROR', error);
            });
            console.log('done syncing');
          };
          syncContactList();
        }
      });
    }

    function contactFromRow (row) {
      var contactObj = {};
      contactObj.ceaselessId = row.ceaselessId;
      contactObj.displayName = row.displayName;
      contactObj.profilePicture = row.profilePicture;
      contactObj.initials = row.initials;
      return contactObj;
    }

    function listPeople() {
      // var query = 'SELECT * FROM PersonIdentifier';
      var query = 'SELECT * FROM testPersonTable';
      return $cordovaSQLite.execute(db, query).then(function (res) {
        var len = res.rows.length;
        var contactObjects = [];
        if (len > 0) {
          for(var i = 0; i < len; i++) {
            contactObjects.push(contactFromRow(res.rows.item(i)));
          }
        }
        return contactObjects;
      });
    }

    function getContact(id) {
      var query = 'SELECT * FROM PersonIdentifier WHERE id = ?';

    }

    function saveContact(contact) {
      if(contact.ceaselessId) {
        var query = 'UPDATE testPersonTable SET displayName = ?, profilePicture = ?, initials = ? WHERE ceaselessId = ?';
        return $cordovaSQLite.execute(db, query, [contact.displayName, contact.profilePicture, contact.initials, contact.ceaselessId]);
      } else {
        console.log('generating new uuid for contact');
        var id = uuid.v4();
        var query = 'INSERT INTO testPersonTable (ceaselessId, displayName, profilePicture, initials) VALUES (?,?,?,?)';
        return $cordovaSQLite.execute(db, query, [id, contact.displayName, contact.profilePicture, contact.initials]);
      }
    }

    function deleteContact(contact) {
      var query = '';

    }

    function getInitialsForContact(contact) {
      var givenName = contact.name.givenName || '';
      var familyName = contact.name.familyName || '';
      return givenName.substring(0,1) + familyName.substring(0,1);
    }

    function isEmail(input) {
      var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
      return emailRegex.test(input.trim());
    }

    return {
      getInitialsForContact: getInitialsForContact,
      init: function () {
        setupPeopleEntity(db);
        syncWithContacts();
      },
      list: listPeople
    };
  });