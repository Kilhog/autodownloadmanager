(function() {
  var fs = require("fs");
  var querystring = require('querystring');
  var curl = require('curlrequest');
  var cheerio = require('cheerio');
  var path = require('path');

  function apiAddicted(apiDB) {
    this.apiDB = apiDB;
    this.url_addic = 'http://www.addic7ed.com'
  }

  apiAddicted.prototype.downloadStr = function(url_path, name, pathDownloadFolder, func) {
    var self = this;

    var options = {
      url: this.url_addic + url_path,
      encoding: "ISO-8859-1",
      headers: {
        'Referer': this.url_addic
      }
    };

    curl.request(options, function (err, buffer) {
      fs.writeFile(pathDownloadFolder + path.sep + name + ".srt", buffer, function(err) {
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
                if(parseInt(nb_download_now) >= parseInt(nb_download)) {
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
      if(func) {
        func(url_with_more_download)
      }
    });
  };

  apiAddicted.prototype.createNewTarget = function(origin, target) {
    var self = this;

    if(target.trim() != '') {
      self.apiDB.query("SELECT * FROM search_for_sub WHERE origin = ?", [origin], function(err, data) {
        if(data.length == 0) {
          self.apiDB.query("INSERT INTO search_for_sub (origin, target) VALUES (?,?)", [origin, target], function(){
          });
        } else {
          self.apiDB.query("UPDATE search_for_sub SET target = ? WHERE id = ? ", [target, data[0][0]], function(){
          });
        }
      });
    } else {
      self.apiDB.query("DELETE FROM search_for_sub WHERE origin = ?", [origin], function(err,data) {

      });
    }
  };

  exports.apiAddicted = apiAddicted;
})();