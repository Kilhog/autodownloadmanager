(function() {
  var dblite = require('dblite');
  var fs = require('fs');
  var path_db = './db/adm.sqlite'

  var apiDblite = function() {
    this.db = dblite(path_db);
    this.db.query('CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, value TEXT)');
  }

  apiDblite.prototype.createDb = function(func) {
    var self = this;

  };

  apiDblite.dropDb = function(func) {
    fs.unlink(path_db, function () {
      if(func) {
        func();
      }
    });
  }

  exports.apiDblite = apiDblite;
})();