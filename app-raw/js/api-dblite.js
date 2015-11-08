(function() {
  var path = require('path-extra');
  var dblite = require('dblite');
  var fs = require('fs');

  var path_dir_db = path.datadir('adm');
  var path_db = path_dir_db + '/adm.sqlite';

  try {
    fs.mkdirSync(path_dir_db);
  } catch(e) {
    // Already Exist
  }

  if(process.platform == "win32") {
    dblite.bin = __dirname + "/../lib/sqlite3/win32/sqlite3.exe";
  } else if(process.platform == "darwin") {
    dblite.bin = __dirname + "/../lib/sqlite3/darwin/sqlite3";
  } else if(process.platform == "linux") {
    dblite.bin = __dirname + "/../lib/sqlite3/linux/sqlite3";
  }

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
    fs.unlink(path_db, (func || Function));
  };

  apiDblite.prototype.query = function(sql, params, func) {
    var self = this;
    self.db.query(sql, params, (func || Function));
  };

  exports.apiDblite = apiDblite;
})();
