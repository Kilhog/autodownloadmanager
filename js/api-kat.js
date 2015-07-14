"use strict";

(function() {

  var getJson = require('load-json');
  var BASE_URL = 'http://kat.cr';
  var url = BASE_URL + '/json.php';

  function apiKickAss() {

  }

  apiKickAss.prototype.searchTheBest = function(q, episodeQuality) {
    return new Promise(
      function (resolve, reject) {
        getJson(url, {q, field: 'seeders', order: 'desc'}, function(e, response) {
          if(e) {
            reject(e);
          } else if (response.list.length > 0)  {
            for(let torrent of response.list) {
              if((episodeQuality == '480p' && torrent.title.indexOf("720p") == -1) || episodeQuality == '720p' && torrent.title.indexOf("720p") > -1) {
                resolve(torrent);
                return false;
              }
            }
          }
          resolve(null);
        });
      }
    );
  };

  module.exports = apiKickAss;
})();
