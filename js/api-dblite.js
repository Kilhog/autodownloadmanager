(function() {
  var path = require('path-extra');

  var dblite = require('dblite');
  if(process.platform == "win32") {
    dblite.bin = __dirname + "/../../lib/sqlite3/win32/sqlite3.exe";
  } else if(process.platform == "darwin") {
    dblite.bin = __dirname + "/../../lib/sqlite3/darwin/sqlite3";
  } else if(process.platform == "linux") {
    dblite.bin = __dirname + "/../../lib/sqlite3/linux/sqlite3";
  }

  var fs = require('fs');

  try {
    fs.mkdirSync(path.homedir() + '/.adm');
  } catch(e) {
    // Already Exist
  }
  
  var path_db = path.homedir() + '/.adm/adm.sqlite';

  var apiDblite = function() {
    this.db = dblite(path_db);
    this.db.query('CREATE TABLE IF NOT EXISTS params (id INTEGER PRIMARY KEY AUTOINCREMENT, nom TEXT, value TEXT)');
    this.db.query('CREATE TABLE IF NOT EXISTS search_for_torrent (id INTEGER PRIMARY KEY AUTOINCREMENT, origin TEXT UNIQUE, target TEXT)');
    this.db.query('CREATE TABLE IF NOT EXISTS search_for_sub (id INTEGER PRIMARY KEY AUTOINCREMENT, origin TEXT UNIQUE, target TEXT)');
  };

  apiDblite.prototype.createDb = function(func) {
    var self = this;

  };

  apiDblite.dropDb = function(func) {
    fs.unlink(path_db, function () {
      if(func) {
        func();
      }
    });
  };

  apiDblite.prototype.query = function(sql, params, func) {
    var self = this;

    self.db.query(sql, params, function(err, rows){
      if(func) {
        func(err, rows);
      }
    });
  };

  exports.apiDblite = apiDblite;
})();
