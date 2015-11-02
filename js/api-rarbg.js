(function() {
  "use strict";

  var request = require("request");
  var cheerio = require('cheerio');
  var rarbg_url = "https://rarbg.to";

  function apiRarBg() {

  }

  apiRarBg.prototype.searchTheBest = function(q, episodeQuality) {

  };

  apiRarBg.prototype.searchAll = function(q) {
    var torrent_search = q;
    var search_query = torrent_search.split(' ').join('+');
    var search_url = rarbg_url + "/torrents.php?search=" + search_query + "&order=seeders&by=DESC/";

    var count = 1;
    var data_content = {};
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

    request(options, function(err, response, body){

      if(!err && response.statusCode === 200){

        var torrent_link, torrent_title, torrent_seeds, torrent_leech, torrent_size, torrent_date;

        $ = cheerio.load(body);

        var title = $("title").text();

        if(title === "Bot check !"){
          console.log("Can't search Rarbg, It thinks you are a bot :(, Try again later.");
        }

        if($('.lista2t tr').length > 1){

          $('.lista2t tr').each(function(index, torrents){
              var d = $(this);
              var td = d.children('td.lista');

              console.log(torrents);

              var links = $(torrents).find('a');

              $(links).each(function(i, link){

                if($(link).attr('href').indexOf("/torrent/") > -1 && $(link).attr('href').indexOf("#comments") < 1) {

                  rarbg_link = $(link).attr('href');
                  torrent_title = $(link).text();
                  torrent_size = $(td).eq(3).text();
                  torrent_seeds = $(td).eq(4).text();
                  torrent_leech = $(td).eq(5).text();
                  date_added = moment(Date.parse($(td).eq(2).text())).fromNow();

                  var rarbg_id = rarbg_link.split('/torrent/').join('');
                  var rarbg_file = encodeURIComponent(torrent_title) + "-[rarbg.com].torrent";

                  var torrent_link = rarbg_url + "/download.php?id=" + rarbg_id + "&f=" +rarbg_file;

                  data_content = {
                    torrent_num: count,
                    title: torrent_title,
                    category: "",
                    seeds: torrent_seeds,
                    leechs: torrent_leech,
                    size: torrent_size,
                    torrent_link: "",
                    torrent_site: rarbg_url + rarbg_link,
                    date_added: date_added
                  };

                  torrent_content.push(data_content);

                  console.log(torrent_content);
                  count++;
                }

              });

          });

        } else {
            console.log("No torrents found");
        }
      } else {
        console.log("There was a problem loading Rarbg");
      }

    });
  };

  module.exports = apiRarBg;
})();
