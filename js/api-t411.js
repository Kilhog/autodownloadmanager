(function() {
  "use strict";

  var fs = require("fs");
  var T411 = require('t411');
  var shell = require('shell');
  var request = require('superagent');

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
        if(self.t411Client) {
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
        if(self.t411Client) {
          self.t411Client.search(q + "?limit=50", function(err, result) {
            if(err) {
              reject();
            }

            let torrents = [];

            for(let torrent of result.torrents) {
              torrents.push({title: torrent.name, torrentLink: torrent.id, seeds: torrent.seeders, tracker: 't411'});
            }

            resolve(torrents);
          });
        } else {
          reject();
        }
      }
    );
  };

  apiT411.prototype.downloadTorrent = function(torrent) {
    var self = this;


    if(self.t411Client.token) {
      var url = self.t411Client.url('/torrents/download/' + torrent.torrentLink);

      var stream = fs.createWriteStream('/Users/kevin/Downloads/tmp.torrent');
      var req = request.get(url).set('Authorization', self.t411Client.token).pipe(stream).end(function(err, res) {
        if(!err) {

        }
      });
    }
  };

  exports.apiT411 = apiT411;
})();
