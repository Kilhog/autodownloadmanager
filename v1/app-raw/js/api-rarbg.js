(function() {
  "use strict";

  var request = require("request");
  var cheerio = require('cheerio');
  var moment = require('moment');
  var rarbg_api_url = "https://torrentapi.org";

  function apiRarBg() {

  }

  function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + '' + sizes[i];
  }

  apiRarBg.prototype.searchTheBest = function(q, episodeQuality) {

  };

  apiRarBg.prototype.searchAll = function(q) {
    return new Promise(
      function(resolve, reject) {
        var search_query = q.split(' ').join('+');
        var torrent_content = [];

        var url = rarbg_api_url + "/pubapi_v2.php?get_token=get_token&app_id=Torrentflix";
        request(url, function (err, response, body) {
          if (!err && response.statusCode === 200) {

            var data = JSON.parse(body);

            var token = data.token;
            var search_url = rarbg_api_url + "/pubapi_v2.php?mode=search&search_string=" + search_query + "&sort=seeders&format=json_extended&token=" + token;

            request(search_url, function (err, response, body) {
              if (!err && response.statusCode === 200) {

                data = JSON.parse(body);

                for(var torrent in data.torrent_results){

                  var title = data.torrent_results[torrent].title;
                  var torrent_link = data.torrent_results[torrent].download;
                  var seeds = data.torrent_results[torrent].seeders;
                  var leechs = data.torrent_results[torrent].leechers;
                  var size = bytesToSize(data.torrent_results[torrent].size);

                  var data_content = {
                    title: title,
                    category: "",
                    seeds: seeds,
                    leechs: leechs,
                    size: size,
                    torrentLink: torrent_link,
                    tracker: "rarbg"
                  };

                  torrent_content.push(data_content);
                }

                resolve(torrent_content);
              } else {
                reject();
              }
            });

          } else {
            reject();
          }
        });
      }
    )
  };

  module.exports = apiRarBg;
})();
