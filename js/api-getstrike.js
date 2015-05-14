(function() {

  var fs = require("fs");
  var strike = require('strike-api');
  var shell = require('shell');

  function apiGetStrike($scope, apiTR, apiDB) {
    this.scope = $scope;
    this.apiTR = apiTR;
    this.apiDB = apiDB;
  }

  apiGetStrike.prototype.search = function(phrase, func) {
    var self = this;

    strike.search(phrase).then(function(res) {

      var find = false;
      var results = res.torrents;

      for(var i in results) {
        if(self.scope.episodeQuality == '480p') {
          if(results[i].torrent_title.indexOf("720p") == -1) {
            func(results[i]);
            find = true;
            return false;
          }
        } else {
          if(results[i].torrent_title.indexOf("720p") > -1) {
            func(results[i]);
            find = true;
            return false;
          }
        }
      }

      if(!find) {
        self.scope.displayToast('Aucun torrent trouvé !');
      }
    }, function(){
      self.scope.displayToast('Aucun torrent trouvé !');
    });
  };

  apiGetStrike.prototype.searchAndDownload = function(query) {
    var self = this;
    self.search(query, function(torrent) {
      if(torrent) {
        if(torrent.magnet_uri) {
          if(self.apiTR.transmission_obj) {
            self.apiTR.addMagnet(torrent.magnet_uri, function(){
              self.scope.displayToast('Torrent ajouté');
            });
          } else {
            shell.openExternal(torrent.magnet_uri);
          }
        }
      }
    });
  };

  apiGetStrike.prototype.createNewTarget = function(origin, target) {
    var self = this;

    if(target.trim() != '') {
      self.apiDB.query("SELECT * FROM search_for_torrent WHERE origin = ?", [origin], function(err, data) {
        if(data.length == 0) {
          self.apiDB.query("INSERT INTO search_for_torrent (origin, target) VALUES (?,?)", [origin, target], function(){
          });
        } else {
          self.apiDB.query("UPDATE search_for_torrent SET target = ? WHERE id = ? ", [target, data[0][0]], function(){
          });
        }
      });
    } else {
      self.apiDB.query("DELETE FROM search_for_torrent WHERE origin = ?", [origin], function(err,data) {

      });
    }
  };

  exports.apiGetStrike = apiGetStrike;
})();
