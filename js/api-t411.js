(function() {

  var fs = require("fs");
  var T411 = require('t411');
  var shell = require('shell');

  function apiT411(apiDB) {
    this.apiDB = apiDB;
    this.t411Client = {};
    this.name = null;
  }

  apiT411.prototype.connectToApi = function(func) {
    var self = this;

    self.t411Client = new T411();

    utils.getParam(self.apiDB, 'T4access', function(T4access) {
      self.t411Client.auth(T4access.login, T4access.password, function(err) {
        self.t411Client.profile(self.t411Client.uid, function(err, res) {
          if(!err) {
            self.name = res.username;
          }
          func();
        });
      });
    }, true);
  };

  apiT411.prototype.disconnectToApi = function(func) {
    var self = this;

    self.name = null;
    self.t411Client = {};

    func();
  };

  apiT411.prototype.search = function(phrase, episodeQuality, success, error) {
    var self = this;

  };

  apiT411.prototype.searchAndDownload = function(query, episodeQuality, func) {
    var self = this;

  };

  apiT411.prototype.saveAccess = function(login, password, func) {
    var self = this;
    utils.setParam(self.apiDB, 'T4access', {login: login, password: password}, func, true);
  };


  exports.apiT411 = apiT411;
})();
