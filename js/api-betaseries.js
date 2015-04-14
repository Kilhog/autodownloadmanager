var fs = require("fs");
var querystring = require('querystring');
var https = require('https');
var md5 = require('MD5');

function callAPI(endpoint, method, data, success) {
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

  req.write(dataString);
  req.end();
}

function apiBetaseries(fileName, $scope, Notification) {
  this.fileName = fileName;
  this.scope = $scope;
  this.Notification = Notification;
}

apiBetaseries.prototype.connectToApi = function(func) {
  var self = this;

  var BTaccess = {};
  fs.readFile('./BTaccess.json', 'utf8', function (err,data) {
    BTaccess = JSON.parse(data);

    callAPI('/members/auth', 'POST', {
      'login': BTaccess.login,
      'password': md5(BTaccess.password)
    }, function(data) {
      if(data.errors.length == 0) {
        self.scope.user['hash'] = data.hash;
        self.scope.user['token'] = data.token;
        self.scope.user['user'] = data.user;
        self.scope.$apply();

        if(self.scope.user.token) {
          self.Notification.success('Connecté à Betaseries');
        } else {
          self.Notification.error('Identifiants Betaseries incorrect');
        }
      } else {
        self.Notification.error('Identifiants Betaseries incorrect');
      }

      if(func) {
        func();
      }
    });
  });
};

apiBetaseries.prototype.disconnectToApi = function(func) {
  var self = this;

  callAPI('/members/destroy', 'POST', {}, function(data) {
    delete self.scope.user.hash;
    delete self.scope.user.token;
    delete self.scope.user.user;
    self.scope.$apply();
    if(func) {
      func()
    }
  });
};

apiBetaseries.prototype.saveAccess = function(login, password, func) {
  var self = this;

  var BTaccess = {
    login: login,
    password: password
  };
  fs.writeFile( "BTaccess.json", JSON.stringify( BTaccess ), "utf8" , function() {
    func();
  });
};

apiBetaseries.prototype.synchroEpisodesUnseen = function(func) {
  var self = this;
  callAPI('/episodes/list', 'GET', {token: self.scope.user.token}, function(data) {
    if(data.errors.length == 0) {
      delete self.scope.episodesUnseen.shows;
      self.scope.episodesUnseen.shows = data.shows;
      self.scope.$apply();
      self.Notification.success('Synchronisation terminée');
    } else {
      self.Notification.error('Synchronisation échouée');
    }
    if(func) {
      func();
    }
  });
};

apiBetaseries.prototype.synchroEpisodesIncoming = function(func) {
  var self = this;

  callAPI('/planning/general', 'GET', {token: self.scope.user.token}, function(res){
    console.log(res);
  })

  if(func) {
    func();
  }
};

apiBetaseries.prototype.seenEpisode = function(episode, func) {
  var self = this;

  callAPI('/episodes/watched', 'POST', {'id': episode.id, token: self.scope.user.token}, function(res) {
    console.log(res);
  });
};

exports.apiBetaseries = apiBetaseries;
