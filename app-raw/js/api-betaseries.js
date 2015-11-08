(function() {
  var fs = require("fs");
  var querystring = require('querystring');
  var https = require('https');
  var md5 = require('crypto-js/md5');

  function apiBetaseries(db) {
    this.db = db;
    this.user = {};
    this.episodesUnseen = {}
  }

  function callAPI(path, method, data, success, error) {
    var dataString = JSON.stringify(data);
    var host = "api.betaseries.com";
    var headers = {
      Accept: 'application/json',
      'X-BetaSeries-Version': 2.4,
      'X-BetaSeries-Key': 'b931e8e98023'
    };

    path += '?' + querystring.stringify(data);

    if (method != 'GET') {
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = dataString.length;
    }

    var options = {host, path, method, headers};

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

  apiBetaseries.prototype.connectToApi = function(func) {
    var self = this;

    utils.getParam(self.db, 'BTaccess', function(BTaccess) {
      callAPI('/members/auth', 'POST', {
        'login': BTaccess.login,
        'password': md5(BTaccess.password).toString()
      }, function(data) {
        if(data.errors.length == 0) {
          self.user['hash'] = data.hash;
          self.user['token'] = data.token;
          self.user['user'] = data.user;
        }

        (func || Function)();
      });
    }, true);
  };

  apiBetaseries.prototype.disconnectToApi = function(func) {
    var self = this;

    callAPI('/members/destroy', 'POST', {}, function(data) {
      delete self.user.hash;
      delete self.user.token;
      delete self.user.user;

      (func || Function)();
    }, (func || Function));
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

        (func || Function)(true);
      } else {
        (func || Function)(false);
      }
    });
  };

  apiBetaseries.prototype.seenEpisode = function(episode, func) {
    var self = this;
    callAPI('/episodes/watched', 'POST', {'id': episode.id, token: self.user.token}, (func || Function));
  };

  exports.apiBetaseries = apiBetaseries;
})();
