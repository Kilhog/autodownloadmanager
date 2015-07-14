(function() {
  var fs = require("fs");
  var querystring = require('querystring');
  var https = require('https');
  var md5 = require('MD5');

  function callAPI(endpoint, method, data, success, error) {
    var dataString = JSON.stringify(data);
    var headers = {
      Accept: 'application/json',
      'X-BetaSeries-Version': 2.4,
      'X-BetaSeries-Key': 'b931e8e98023'
    };
    var host = "api.betaseries.com";

    if (method == 'GET') {
      endpoint += '?' + querystring.stringify(data);
    } else {
      endpoint += '?' + querystring.stringify(data);
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = dataString.length;
    }

    var options = {
      host: host,
      path: endpoint,
      method: method,
      headers: headers
    };

    var req = https.request(options, function(res) {
      res.setEncoding('utf-8');

      var responseString = '';

      res.on('data', function(data) {
        responseString += data;
      });

      res.on('end', function() {
        var responseObject = JSON.parse(responseString);
        success(responseObject);
      });
    });

    req.on('error', function(err) {
      if(error) {
        error();
      }
    });

    req.write(dataString);
    req.end();
  }

  function apiBetaseries(db) {
    this.db = db;
    this.user = {};
    this.episodesUnseen = {}
  }

  apiBetaseries.prototype.connectToApi = function(func) {
    var self = this;

    utils.getParam(self.db, 'BTaccess', function(BTaccess) {
      callAPI('/members/auth', 'POST', {
        'login': BTaccess.login,
        'password': md5(BTaccess.password)
      }, function(data) {
        if(data.errors.length == 0) {
          self.user['hash'] = data.hash;
          self.user['token'] = data.token;
          self.user['user'] = data.user;
        }

        if(func) {
          func();
        }
      });
    }, true);
  };

  apiBetaseries.prototype.disconnectToApi = function(func) {
    var self = this;

    callAPI('/members/destroy', 'POST', {}, function(data) {
      delete self.user.hash;
      delete self.user.token;
      delete self.user.user;

      if(func) {
        func()
      }
    }, function() {
      if(func) {
        func()
      }
    });
  };

  apiBetaseries.prototype.saveAccess = function(login, password, func) {
    var self = this;
    utils.setParam(self.db, 'BTaccess', {login: login,password: password}, func, true);
  };

  apiBetaseries.prototype.synchroEpisodesUnseen = function(func) {
    var self = this;
    callAPI('/episodes/list', 'GET', {token: self.user.token}, function(data) {
      if(data.errors.length == 0) {
        delete self.episodesUnseen.shows;
        self.episodesUnseen.shows = data.shows;
        if(func) {
          func(true);
        }
      } else {
        if(func) {
          func(false);
        }
      }
    });
  };

  apiBetaseries.prototype.seenEpisode = function(episode, func) {
    var self = this;

    callAPI('/episodes/watched', 'POST', {'id': episode.id, token: self.user.token}, function(res) {
        if(func) {
          func();
        }
    });
  };

  exports.apiBetaseries = apiBetaseries;
})();