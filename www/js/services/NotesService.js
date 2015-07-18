angular.module('ceaseless.services')
  .factory('notes', function ($cordovaSQLite, AppConstants, ceaselessServiceUrls) {
  console.log(AppConstants.databaseName);
    var db = $cordovaSQLite.openDB(AppConstants.databaseName);
    db.transaction(function (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS notes (id integer primary key, text text, createDate text, lastUpdatedDate text)');
    });

//    $scope.execute = function() {
//      var query = "INSERT INTO test_table (data, data_num) VALUES (?,?)";
//      $cordovaSQLite.execute(db, query, ["test", 100]).then(function(res) {
//        console.log("insertId: " + res.insertId);
//      }, function (err) {
//        console.error(err);
//      });
//    };

    function objectFromRow (row) {
      var noteObj = {};
      noteObj.id = row.id;
      noteObj.text = row.text;
      // HACK for javascript to interpret the dates
      // as UTC instead of local time.
      noteObj.lastUpdatedDate = row.lastUpdatedDate + ' UTC';
      noteObj.createDate = row.createDate;
      return noteObj;
    }

    function listNotes() {
      var query = 'SELECT * FROM notes ORDER BY lastUpdatedDate DESC';
      return $cordovaSQLite.execute(db, query).then(function (res) {
        var len = res.rows.length;
        var noteObjects = [];
        if (len > 0) {
          for(var i = 0; i < len; i++) {
            noteObjects.push(objectFromRow(res.rows.item(i)));
          }
        }
        return noteObjects;
      });
    }

    function getNote(id) {
      var query = 'SELECT * FROM notes WHERE id = ?';
      return $cordovaSQLite.execute(db, query, [id]).then(function (res) {
        var len = res.rows.length;
        if (len > 0) {
          return objectFromRow(res.rows.item(0));
        } else {
          return null;
        }
      });
    }

    function saveNote(note) {
      console.log(note.text);
      var now = new Date();
      if(note.id) {
        var query = 'UPDATE notes SET text = ?, lastUpdatedDate = datetime(\'now\') WHERE id = ?';
        return $cordovaSQLite.execute(db, query, [note.text, note.id]);
      } else {
        var query = 'INSERT INTO notes (text, createDate, lastUpdatedDate) VALUES (?,datetime(\'now\'),datetime(\'now\'))';
        return $cordovaSQLite.execute(db, query, [note.text]);
      }
    }

    function deleteNote(id) {
      var query = 'DELETE FROM notes WHERE id = ?';
      return $cordovaSQLite.execute(db, query, [id]);
    }

    return {
      listNotes: listNotes,
      getNote: getNote,
      saveNote: saveNote,
      deleteNote: deleteNote
    };
  });