(function() {
  var fs = require("fs");
  var querystring = require('querystring');
  var http = require('follow-redirects').http;

  function curlAPI(endpoint, method, data, success) {
    var dataString = JSON.stringify(data);
    var host = "addic7ed.com";

    var headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    if (method == 'GET') {
      if(Object.keys(data).length > 0) {
        endpoint += '?' + querystring.stringify(data);
      }
    }

    var options = {
      host: host,
      path: endpoint,
      method: method,
      headers: headers,
    };

    var req = http.request(options, function(res) {
      res.setEncoding('utf-8');

      var responseString = '';

      res.on('data', function(data) {
        responseString += data;
      });

      res.on('end', function() {
        success(responseString);
      });
    });

    req.write(dataString);
    req.end();
  }

  function apiAddicted($scope) {
    this.scope = $scope;
  }

  apiAddicted.prototype.search = function(query, func) {
    var self = this;

    curlAPI('search.php', 'GET', {search: "game of thrones S01E01"}, function(data) {
      console.log(data);
    });
  };


  exports.apiAddicted = apiAddicted;
})();