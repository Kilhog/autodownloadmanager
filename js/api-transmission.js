(function() {

  var fs = require("fs");
  var Transmission = require('transmission');

  function apiTransmission($scope, db) {
    this.scope = $scope;
    this.db = db;
  }

  apiTransmission.prototype.addMagnet = function(url, func) {
    var self = this;
    self.scope.transmission.obj.addUrl(url, func);
  };

  apiTransmission.prototype.connectToApi = function(func) {
    var self = this;

    this.db.query("SELECT * FROM params WHERE nom = ?", ['TRaccess'], function(err, rows) {
      if(rows.length > 0) {
        var TRaccess = JSON.parse(rows[0][2]);

        self.scope.transmission.obj = new Transmission(TRaccess);
        self.scope.transmission.obj.session(function(err, arg) {
          if(err) {
            delete self.scope.transmission.obj;
          }

          self.scope.$apply();

          if(self.scope.transmission.obj) {
            self.scope.showSimpleToast('Connecté à Transmission');
          } else {
            self.scope.showSimpleToast('Erreur lors de la connection à Transmission');
          }

          if(func) {
            func();
          }
        });
      }
    });
  };

  apiTransmission.prototype.disconnectToApi = function(func) {
    var self = this;

    delete self.scope.transmission.obj;

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