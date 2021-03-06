(function() {
  "use strict";

  var Transmission = require('transmission');

  function apiTransmission(db) {
    this.db = db;
    this.transmission_obj = null;
  }

  apiTransmission.prototype.addUrl = function(url, func) {
    var self = this;
    self.transmission_obj.addUrl(url, func);
  };

  apiTransmission.prototype.addFile = function(url) {
    var self = this;
    return new Promise(function(resolve, reject) {self.transmission_obj.addFile(url, resolve)});
  }

  apiTransmission.prototype.connectToApi = function(func) {
    var self = this;

    utils.getParam(this.db, 'TRaccess', function(TRaccess) {
      self.transmission_obj = new Transmission(TRaccess);
      self.transmission_obj.session(function(err, arg) {
        if(err) {
          self.transmission_obj = null;
        }

        (func || Function)(self.transmission_obj ? true : false);
      });
    }, true);
  };

  apiTransmission.prototype.disconnectToApi = function(func) {
    var self = this;
    self.transmission_obj = null;
    (func || Function)();
  };

  apiTransmission.prototype.saveAccess = function(host, port, username, password, func) {
    var self = this;
    utils.setParam(self.db, 'TRaccess', {host: host, port: port, username: username, password: password}, func, true);
  };

  exports.apiTransmission = apiTransmission;
})();
