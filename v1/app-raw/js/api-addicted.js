(function() {
  var fs = require("fs");
  var querystring = require('querystring');
  var cheerio = require('cheerio');
  var path = require('path');
  var shell = require('shell');
  var request = require('request');

  function apiAddicted(apiDB) {
    this.apiDB = apiDB;
    this.url_addic = 'http://www.addic7ed.com'
  }

  apiAddicted.prototype.downloadStr = function(url_path, name, pathDownloadFolder, func, func_err) {
    var self = this;

    var options = {
      url: this.url_addic + url_path,
      headers: {
        'Referer': this.url_addic
      }
    };

    request.get(options)
      .pipe(fs.createWriteStream(pathDownloadFolder + path.sep + name + ".srt", {defaultEncoding: "ISO-8859-1"}))
      .on('error', func_err)
      .on('finish', function() {
        fs.readFile(pathDownloadFolder + path.sep + name + ".srt", function(err, data) {
          if(err || data.toString().startsWith("<!DOC")) {
            func_err()
          } else {
            func();
          }
        });
      });
  };

  apiAddicted.prototype.openUrl = function(query) {
    var self = this;
    shell.openExternal(self.url_addic + "/search.php?" + querystring.stringify({search: query}));
  };

  apiAddicted.prototype.search = function(query, func) {
    var self = this;

    var url_with_more_download = '';
    var nb_download = 0;

    request({ url: this.url_addic + "/search.php?" + querystring.stringify({search: query}) }, function(err, res, body) {
      var $res = cheerio.load(body);
      $.each($res('div#container95m table.tabel95 tr:nth-child(2) td:nth-child(2) table tr'), function(index, elm) {
        $.each(elm.children, function(index2, elm2) {
          if(elm2.firstChild) {
            if(elm2.firstChild.data) {
              if(elm2.firstChild.data.toLowerCase() == "French".toLowerCase()) {
                var stat = $res('div#container95m table.tabel95 tr:nth-child(2) td:nth-child(2) table tr').get(index + 1).children[1].children[2].data;
                var array_stat = stat.split('·');
                var nb_download_now = array_stat[1].replace('Downloads', '').replace('Download', '').trim();
                if(~~nb_download_now >= ~~nb_download) {
                  if($res('div#container95m table.tabel95 tr:nth-child(2) td:nth-child(2) table tr').get(index).children[8].children[2].attribs == null) {
                    url_with_more_download = $res('div#container95m table.tabel95 tr:nth-child(2) td:nth-child(2) table tr').get(index).children[8].children[2].next.next.next.attribs.href;
                  } else {
                    url_with_more_download = $res('div#container95m table.tabel95 tr:nth-child(2) td:nth-child(2) table tr').get(index).children[8].children[2].attribs.href;
                  }
                  nb_download = nb_download_now;
                }
              }
            }
          }
        });
      });

      (func || Function)(url_with_more_download)
    });
  };

  exports.apiAddicted = apiAddicted;
})();
