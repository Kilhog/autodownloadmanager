(function() {
  var fs = require("fs");
  var querystring = require('querystring');
  var curl = require('curlrequest');
  var cheerio = require('cheerio');

  function apiAddicted($scope) {
    this.scope = $scope;
    this.url_addic = 'http://www.addic7ed.com'
  }

  apiAddicted.prototype.downloadStr = function(url_path, name, func) {    
    var self = this;

    var options = {
      url: this.url_addic + url_path,
      encoding: "utf-8",
      headers: {
        'Referer': this.url_addic
      }
    };

    curl.request(options, function (err, buffer) {
      var home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

      fs.writeFile(home + "/Downloads/" + name + ".srt", buffer, function(err) {
        if(func) {
          func();
        }
      }); 
    });
  };

  apiAddicted.prototype.search = function(query, func) {
    var self = this;

    var url_with_more_download = '';
    var nb_download = 0;

    curl.request({ url: this.url_addic + "/search.php?" + querystring.stringify({search: query}) }, function(err, res) {
      var $res = cheerio.load(res);
      $.each($res('div#container95m table.tabel95 tr:nth-child(2) td:nth-child(2) table tr'), function(index, elm) {
        $.each(elm.children, function(index2, elm2) {
          if(elm2.firstChild) {
            if(elm2.firstChild.data) {
              if(elm2.firstChild.data.toLowerCase() == "French".toLowerCase()) {
                var stat = $res('div#container95m table.tabel95 tr:nth-child(2) td:nth-child(2) table tr').get(index + 1).children[1].children[2].data;
                var array_stat = stat.split('·');
                var nb_download_now = array_stat[1].replace('Downloads', '').replace('Download', '').trim();

                if(nb_download_now >= nb_download) {
                  url_with_more_download = $res('div#container95m table.tabel95 tr:nth-child(2) td:nth-child(2) table tr').get(index).children[8].children[2].attribs.href;
                  nb_download = nb_download_now;
                }
              }
            }
          }
        });
      });
      if(func) {
        func(url_with_more_download)
      }
    });
  };

  exports.apiAddicted = apiAddicted;
})();