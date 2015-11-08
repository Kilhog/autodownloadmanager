(function() {
  "use strict";

  var request = require("request");
  var cheerio = require('cheerio');
  var moment = require('moment');
  var rarbg_url = "https://rarbg.to";

  function apiRarBg() {

  }

  apiRarBg.prototype.searchTheBest = function(q, episodeQuality) {

  };

  apiRarBg.prototype.searchAll = function(q) {
    return new Promise(
      function(resolve, reject) {
        var search_query = q.split(' ').join('+');
        var torrent_content = [];

        var theJar = request.jar();
        var options = {
            url: rarbg_url + '/torrents.php?search=' + search_query + '&order=seeders&by=DESC',
            headers: {
                'Referer': rarbg_url + '/index6.php',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.43 Safari/537.36'
            },
            jar: theJar
        };
        theJar.setCookie('7fAY799j=VtdTzG69', rarbg_url, {"ignoreError":true});

        request(options, function(err, response, body) {
          if(!err && response.statusCode === 200) {
            $ = cheerio.load(body);

            if($("title").text() === "Bot check !") {
              reject();
            }

            if($('.lista2t tr').length > 1) {
              $('.lista2t tr').each(function(index, torrents) {
                  let td = $(this).children('td.lista');
                  let links = $(torrents).find('a');

                  $(links).each(function(i, link) {
                    if($(link).attr('href').indexOf("/torrent/") > -1 && $(link).attr('href').indexOf("#comments") < 1) {
                      let rarbg_link = $(link).attr('href');
                      let torrent_title = $(link).text();

                      let rarbg_id = rarbg_link.split('/torrent/').join('');
                      let rarbg_file = encodeURIComponent(torrent_title) + "-[rarbg.com].torrent";

                      torrent_content.push({
                        title: torrent_title,
                        category: "",
                        seeds: $(td).eq(4).text(),
                        leechs: $(td).eq(5).text(),
                        size: $(td).eq(3).text(),
                        torrentLink: rarbg_url + "/download.php?id=" + rarbg_id + "&f=" +rarbg_file,
                        torrent_site: rarbg_url + rarbg_link,
                        tracker: "rarbg"
                      });
                    }
                  });
              });
              resolve(torrent_content);
            } else {
              reject();
            }
          } else {
            reject();
          }
        });
      }
    )
  };

  module.exports = apiRarBg;
})();
