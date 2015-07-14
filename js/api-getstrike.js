"use strict";

(function() {

  var fs = require("fs");
  var strike = require('strike-api');
  var shell = require('shell');

  function apiGetStrike(apiTR) {
    this.apiTR = apiTR;
  }

  apiGetStrike.prototype.searchTheBest = function(q, episodeQuality) {
    return new Promise(
      function (resolve, reject) {
        strike.search(q).then(function(res) {
          for(let torrent of res.torrents) {
            if((episodeQuality == '480p' && torrent.torrent_title.indexOf("720p") == -1) || episodeQuality == '720p' && torrent.torrent_title.indexOf("720p") > -1) {
              resolve(torrent);
              return false;
            }
          }

          resolve(null);
        }, function(){
          reject();
        });
      }
    );
  };

  apiGetStrike.prototype.searchAndDownload = function(query, episodeQuality, func) {
    var self = this;

    self.searchTheBest(query, episodeQuality).then(function(torrent) {
      if(torrent && torrent.magnet_uri) {

        if(self.apiTR.transmission_obj) {
          self.apiTR.addMagnet(torrent.magnet_uri, function() {
            func(true);
          });
        } else {
          shell.openExternal(torrent.magnet_uri);
        }

      }
    }, function() {
      func(false);
    });
  };

  exports.apiGetStrike = apiGetStrike;
})();
