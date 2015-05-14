(function() {

  var fs = require("fs");
  var Transmission = require('transmission');

  function apiTransmission(db) {
    this.db = db;
    this.transmission_obj = null;
  }

  apiTransmission.prototype.addMagnet = function(url, func) {
    var self = this;
    self.transmission_obj.addUrl(url, func);
  };

  apiTransmission.prototype.connectToApi = function(func) {
    var self = this;

    this.db.query("SELECT * FROM params WHERE nom = ?", ['TRaccess'], function(err, rows) {
      if(rows.length > 0) {
        var TRaccess = JSON.parse(rows[0][2]);

        self.transmission_obj = new Transmission(TRaccess);
        self.transmission_obj.session(function(err, arg) {
          if(err) {
            self.transmission_obj = null;
          }

          var res = false;

          if(self.transmission_obj) {
            res = true;
          }

          if(func) {
            func(res);
          }
        });
      }
    });
  };

  apiTransmission.prototype.disconnectToApi = function(func) {
    var self = this;

    self.transmission_obj = null;

    if(func) {
      func();
    }
  };

  apiTransmission.prototype.saveAccess = function(host, port, func) {
    var self = this;

    var TRaccess = {
      host: host,
      port: port
    };

    this.db.query("DELETE FROM params WHERE nom = ?", ['TRaccess'], function(err, rows) {});

    this.db.query("INSERT INTO params (nom, value) VALUES (?, ?)", ['TRaccess', JSON.stringify(TRaccess)], function(err, rows) {
      func(err, rows);
    });
  };

  exports.apiTransmission = apiTransmission;
})();