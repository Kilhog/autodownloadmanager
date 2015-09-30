(function() {
  "use strict";

  var request = require('superagent'),
    BASE_URL = 'https://kat.cr',
    url = BASE_URL + '/json.php';

  function apiKickAss() {

  }

  apiKickAss.prototype.searchTheBest = function(q, episodeQuality) {
    return new Promise(
      function (resolve, reject) {
        request.get(url).query({q, field: 'seeders', order: 'desc'}).end(function(e, response) {
          response = JSON.parse(response.text);
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
