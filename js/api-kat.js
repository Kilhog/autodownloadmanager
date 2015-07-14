(function() {
  "use strict";

  var getJson = require('load-json'),
    BASE_URL = 'http://kat.cr',
    url = BASE_URL + '/json.php';

  function apiKickAss() {

  }

  apiKickAss.prototype.searchTheBest = function(q, episodeQuality) {
    return new Promise(
      function (resolve, reject) {
        getJson(url, {q, field: 'seeders', order: 'desc'}, function(e, response) {
          if(e) {
            reject(null);
          } else if (response.list.length > 0)  {
            for(let torrent of response.list) {
              if((episodeQuality == '480p' && torrent.title.indexOf("720p") == -1) || episodeQuality == '720p' && torrent.title.indexOf("720p") > -1) {
                resolve({title: torrent.title, torrentLink: torrent.torrentLink, seeds: torrent.seeds});
                return false;
              }
            }
          }
          reject(null);
        });
      }
    );
  };

  module.exports = apiKickAss;
})();
