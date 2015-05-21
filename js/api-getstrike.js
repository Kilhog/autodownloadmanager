(function() {

  var fs = require("fs");
  var strike = require('strike-api');
  var shell = require('shell');

  function apiGetStrike(apiTR, apiDB) {
    this.apiTR = apiTR;
    this.apiDB = apiDB;
  }

  apiGetStrike.prototype.search = function(phrase, episodeQuality, success, error) {
    var self = this;

    strike.search(phrase).then(function(res) {

      var find = false;
      var results = res.torrents;

      for(var i in results) {
        if(episodeQuality == '480p') {
          if(results[i].torrent_title.indexOf("720p") == -1) {
            success(results[i]);
            find = true;
            return false;
          }
        } else {
          if(results[i].torrent_title.indexOf("720p") > -1) {
            success(results[i]);
            find = true;
            return false;
          }
        }
      }

      if(!find) {
        error();
      }
    }, function(){
      error();
    });
  };

  apiGetStrike.prototype.searchAndDownload = function(query, episodeQuality, func) {
    var self = this;
    self.search(query, episodeQuality, function(torrent) {
      if(torrent) {
        if(torrent.magnet_uri) {
          if(self.apiTR.transmission_obj) {
            self.apiTR.addMagnet(torrent.magnet_uri, function() {
              func(true);
            });
          } else {
            shell.openExternal(torrent.magnet_uri);
          }
        }
      }
    }, function() {
      func(false);
    });
  };

  exports.apiGetStrike = apiGetStrike;
})();
