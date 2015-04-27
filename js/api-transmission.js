(function() {

  var fs = require("fs");
  var Transmission = require('transmission');

  function apiTransmission($scope, filename, Notification) {
    this.scope = $scope;
    this.fileName = filename;
    this.Notification = Notification;
  }

  apiTransmission.prototype.addMagnet = function(url, func) {
    var self = this;
    self.scope.transmission.obj.addUrl(url, func);
  };

  apiTransmission.prototype.connectToApi = function(func) {
    var self = this;
    var TRaccess = {};

    fs.readFile('./' + self.fileName, 'utf8', function (err,data) {
      TRaccess = JSON.parse(data);

      self.scope.transmission.obj = new Transmission(TRaccess);
      self.scope.transmission.obj.session(function(err, arg) {
        if(err) {
          delete self.scope.transmission.obj;
        }

        self.scope.$apply();

        if(self.scope.transmission.obj) {
          self.Notification.success('Connecté à Transmission');
        } else {
          self.Notification.error('Erreur lors de la connection à Transmission');
        }

        if(func) {
          func();
        }
      });
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
    fs.writeFile( "TRaccess.json", JSON.stringify( TRaccess ), "utf8" , function() {
      func();
    });
  };

  exports.apiTransmission = apiTransmission;
})();