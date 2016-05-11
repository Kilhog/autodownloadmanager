(function() {
  "use strict";

  var fs = require("fs");
  var T411 = require('t411');
  var shell = require('shell');
  var request = require('superagent');
  var path = require('path-extra');

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

  apiT411.prototype.searchTheBest = function(q, episodeQuality) {
    var self = this;

    return new Promise(
      function (resolve, reject) {
        if(self.t411Client.token) {
          self.t411Client.search(q + "?limit=50", function(err, result) {
            if(err) {
              reject();
            }
            resolve(result);
          });
        } else {
          reject();
        }
      }
    );
  };

  apiT411.prototype.saveAccess = function(login, password, func) {
    var self = this;
    utils.setParam(self.apiDB, 'T4access', {login: login, password: password}, func, true);
  };

  apiT411.prototype.searchAll = function(q) {
    var self = this;

    return new Promise(
      function(resolve, reject) {
        if(self.t411Client.token) {
          self.t411Client.search(q + "?limit=50", function(err, result) {
            if(err) {
              reject();
            } else {
              let torrents = [];

              for(let torrent of result.torrents) {
                torrents.push({title: torrent.name, torrentLink: torrent.id, seeds: torrent.seeders, tracker: 't411'});
              }

              resolve(torrents);
            }
          });
        } else {
          reject();
        }
      }
    );
  };

  apiT411.prototype.downloadTorrent = function(torrentLink) {
    var self = this;
    return new Promise(
      function(resolve, reject) {
        if(self.t411Client.token) {
          var url = self.t411Client.url('/torrents/download/' + torrentLink);
          var random_name = path.tempdir() + '/' + Math.floor(Math.random() * (999999 - 100000 + 1) + 100000) + '.torrent';
          var stream = fs.createWriteStream(random_name);
          request.get(url)
            .set('Authorization', self.t411Client.token)
            .pipe(stream)
            .on('finish', function () {resolve(random_name)});
        } else {
          reject();
        }
      }
    )
  };

  exports.apiT411 = apiT411;
})();
