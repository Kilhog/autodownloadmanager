'use strict';

var apiBetaseries = require("./js/api-betaseries");
var apiGetStrike = require("./js/api-getstrike");
var apiKickAss = require("./js/api-kat.js");
var apiTorrent = require("./js/api-torrent.js");
var apiTransmission = require("./js/api-transmission");
var apiDblite = require("./js/api-dblite");
var apiAddicted = require("./js/api-addicted");
var apiT411 = require("./js/api-t411");
var apiRarBg = require("./js/api-rarbg");
var utils = require("./js/api-utils.js");

var request = require('superagent');
var ipc = require('electron').ipcRenderer;
var justOpen = true;

var app = angular.module('adm-app', ["ngMaterial", "ui.router", require('ng-fx'), require('angular-animate')]);

app.config(["$stateProvider", "$urlRouterProvider", "$mdThemingProvider",
  function ($stateProvider, $urlRouterProvider, $mdThemingProvider) {

    /*
     Material Angular
     */

    $mdThemingProvider.theme('default').primaryPalette('grey', {
      'default': '800'
    }).accentPalette('lime', {
      'default': '500'
    });

    /*
     Route UI
     */

    $urlRouterProvider.otherwise('/main/manager');

    $stateProvider
      .state("main", {
        controller: 'mainCtrl',
        url: "/main",
        templateUrl: 'partial/main.html'
      })
      .state("main.reglages", {
        controller: 'reglagesCtrl',
        parent: 'main',
        url: "/reglages",
        templateUrl: 'partial/reglages.html'
      })
      .state("main.manager", {
        controller: 'managerCtrl',
        parent: 'main',
        url: "/manager",
        templateUrl: 'partial/manager.html'
      });
  }
]).filter('numberFixedLen', function () {
  return function (n, len) {
    var num = parseInt(n, 10);
    len = parseInt(len, 10);
    if (isNaN(num) || isNaN(len)) {
      return n;
    }
    num = String(num);
    while (num.length < len) {
      num = '0' + num;
    }
    return num;
  };
}).factory('persistContainer', function () {
  return {};
}).factory('stateSites', ['$interval', '$timeout', function ($interval, $timeout) {
  var states = {};
  states.addicted = false;
  states.getStrike = false;
  states.t411 = false;
  states.kat = false;
  states.rarbg = false;

  var checkStatesAddic = function() {
    request.get('http://www.addic7ed.com/').end(function(err, res) {
      states.addicted = !err && res.statusCode == 200;
    });
  };

  var checkStatesStrike = function() {
    request.get('https://getstrike.net/torrents/').end(function (err, res) {
      states.getStrike = !err && res.statusCode == 200;
    });
  };

  var checkStatesT411 = function() {
    request.get('http://www.t411.in/').end(function (err, res) {
      states.t411 = !err && res.statusCode == 200;
    });
  };

  var checkStatesKat = function() {
    request.get('https://kat.cr/').end(function (err, res) {
      states.kat = !err && res.statusCode == 200;
    });
  };

  var checkStatesRarBg = function() {
    request.get('https://rarbg.to/torrents.php').end(function(err, res) {
      states.rarbg = !err && res.statusCode == 200;
    });
  }

  var checkStates = function() {
    checkStatesKat();
    checkStatesT411();
    checkStatesStrike();
    checkStatesAddic();
    checkStatesRarBg();
  };

  $interval(checkStates, 60000);

  $timeout(checkStatesKat, Math.floor((Math.random() * 2000) + 1) + 1500);
  $timeout(checkStatesT411, Math.floor((Math.random() * 2000) + 1) + 1500);
  $timeout(checkStatesStrike, Math.floor((Math.random() * 2000) + 1) + 1500);
  $timeout(checkStatesAddic, Math.floor((Math.random() * 2000) + 1) + 1500);
  $timeout(checkStatesRarBg, Math.floor((Math.random() * 2000) + 1) + 1500);

  return states;
}]).factory('toastFact', ["$mdToast", function ($mdToast) {
  return {
    show: function (msg) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(msg)
          .position("bottom right")
          .hideDelay(3000)
      );
    }
  };
}]).controller('TabsCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.$watch('selectedTabIndex', function (current, old) {
      switch (current) {
        case 0:
          $location.url("/main/manager");
          break;
        case 1:
          $location.url("/main/reglages");
          break;
      }
    });
}]).controller('StateCtrl', ['$scope', 'stateSites', function ($scope, stateSites) {
    $scope.states = stateSites;
}]).controller('versionNumber', ['$scope', '$http', function($scope, $http) {
  ipc.send('getVersionNumber');
  ipc.on('versionNumber', function(event, vn) {
    $scope.versionNumber = vn;
    if(!$scope.$$phase) {
      $scope.$apply();
    }
  });
}]).directive('ngRightClick', ['$parse', function($parse) {
  return function(scope, element, attrs) {
    var fn = $parse(attrs.ngRightClick);
    element.bind('contextmenu', function(event) {
      scope.$apply(function() {
        event.preventDefault();
        fn(scope, {$event:event});
      });
    });
  };
}]);
