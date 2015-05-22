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

    utils.getParam(this.db, 'TRaccess', function(TRaccess) {
      self.transmission_obj = new Transmission(TRaccess);
      self.transmission_obj.session(function(err, arg) {
        if(err) {
          self.transmission_obj = null;
        }

        if(func) {
          func(self.transmission_obj ? true : false);
        }
      });
    }, true);
  };

  apiTransmission.prototype.disconnectToApi = function(func) {
    var self = this;

    self.transmission_obj = null;

    if(func) {
      func();
    }
  };

  apiTransmission.prototype.saveAccess = function(host, port, username, password, func) {
    var self = this;
    utils.setParam(self.db, 'TRaccess', {host: host, port: port, username: username, password: password}, func, true);
  };

  exports.apiTransmission = apiTransmission;
})();