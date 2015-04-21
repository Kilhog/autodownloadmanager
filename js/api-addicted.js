(function() {
  var fs = require("fs");
  var querystring = require('querystring');
  var curl = require('curlrequest');
  var cheerio = require('cheerio');

  function apiAddicted($scope) {
    this.scope = $scope;
  }

  apiAddicted.prototype.download = function() {
    var options = {
      url: "http://www.addic7ed.com" + elm_with_more_download,
      encoding: "utf-8",
      headers: {
        'Referer': 'http://www.addic7ed.com/'
      }
    };

    curl.request(options, function (err, buffer) {
      fs.writeFile("gotham_S01E19.str", buffer, function(err) {

      }); 
    });
  }

  apiAddicted.prototype.search = function(query, func) {
    var self = this;

    var elm_with_more_download;
    var nb_download = 0;

    curl.request({ url: "http://www.addic7ed.com/search.php?" + querystring.stringify({search: "gotham S01E19"}) }, function(err, res) {
      var $res = cheerio.load(res);
      $.each($res('div#container95m table.tabel95 tr:nth-child(2) td:nth-child(2) table tr'), function(index, elm) {
        $.each(elm.children, function(index2, elm2) {
          if(elm2.firstChild) {
            if(elm2.firstChild.data) {
              if(elm2.firstChild.data.toLowerCase() == "French".toLowerCase()) {
                var stat = $res('div#container95m table.tabel95 tr:nth-child(2) td:nth-child(2) table tr').get(index + 1).children[1].children[2].data;
                var array_stat = stat.split('·');
                nb_download_now = array_stat[1].replace('Downloads', '').replace('Download', '').trim();

                if(nb_download_now >= nb_download) {
                  elm_with_more_download = $res('div#container95m table.tabel95 tr:nth-child(2) td:nth-child(2) table tr').get(index).children[8].children[2].attribs.href;
                  nb_download = nb_download_now;
                }
              }
            }
          }
        });
      });
    });
  };

  exports.apiAddicted = apiAddicted;
})();