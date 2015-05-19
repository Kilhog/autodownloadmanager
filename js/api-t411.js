(function() {

  var fs = require("fs");
  var T411 = require('t411');
  var shell = require('shell');

  function apiT411(apiDB) {
    this.apiDB = apiDB;
    this.t411Client = {};
    this.name = null;
  }

  apiT411.prototype.connectToApi = function(username, password, func) {
    var self = this;

    self.t411Client = new T411();

    self.saveAccess(username, password, function(){

    });

    self.t411Client.auth(username, password, function(err) {
      self.t411Client.profile(self.t411Client.uid, function(err, res) {
        if(!err) {
          self.name = res.username;
        }
        func();
      });
    });
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

    var T4access = {
      login: login,
      password: password
    };

    self.apiDB.query("DELETE FROM params WHERE nom = ?", ['T4access'], function(err, rows) {});

    self.apiDB.query("INSERT INTO params (nom, value) VALUES (?, ?)", ['T4access', JSON.stringify(T4access)], function(err, rows) {
      func(err, rows);
    });
  };


  exports.apiT411 = apiT411;
})();
