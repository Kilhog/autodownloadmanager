(function() {
  "use strict";

  var strike = require('strike-api');

  function apiGetStrike() {

  }

  apiGetStrike.prototype.searchTheBest = function(q, episodeQuality) {
    return new Promise(
      function (resolve, reject) {
        strike.search(q).then(function(res) {
          for(let torrent of res.torrents) {
            if((episodeQuality == '480p' && torrent.torrent_title.indexOf("720p") == -1) || episodeQuality == '720p' && torrent.torrent_title.indexOf("720p") > -1) {
              resolve({title: torrent.torrent_title, torrentLink: torrent.magnet_uri, seeds: torrent.seeds});
              return false;
            }
          }

          reject(null);
        }, function(){
          reject(null);
        });
      }
    );
  };

  apiGetStrike.prototype.searchAll = function(q) {
    return new Promise(
      function(resolve, reject) {
        strike.search(q).then(function(res) {
          let torrents = [];

          for(let torrent of res.torrents) {
            torrents.push({title: torrent.torrent_title, torrentLink: torrent.magnet_uri, seeds: torrent.seeds, tracker: 'gs'});
          }

          resolve(torrents);
        }, function() {
          reject(null);
        });
      }
    )
  };

  exports.apiGetStrike = apiGetStrike;
})();
