(function() {

  var fs = require("fs");
  var strike = require('strike-api');
  var shell = require('shell');

  function apiGetStrike($scope, apiTR, Notification) {
    this.scope = $scope;
    this.apiTR = apiTR;
    this.Notification = Notification;
  }

  apiGetStrike.prototype.search = function(phrase, func) {
    var self = this;

    phrase = phrase.replace("Marvel's","Marvels");

    strike.search(phrase).then(function(res) {

      var status = res.statuscode;
      var results = res.torrents;

      console.log(results)

      for(var i in results) {
        if(results[i].torrent_title.indexOf("720p") > -1) {
          func(results[i]);
          return false;
        }
      }
    });
  };

  apiGetStrike.prototype.searchAndDownload = function(query) {
    var self = this;

    self.search(query, function(torrent) {
      if(torrent) {
        if(torrent.magnet_uri) {
          if(self.scope.transmission.obj) {
            self.apiTR.addMagnet(torrent.magnet_uri, function(){
              self.Notification.success('Torrent ajouté');
            });
          } else {
            shell.openExternal(torrent.magnet_uri);
          }
        }
      }
    });
  };

  exports.apiGetStrike = apiGetStrike;
})();
