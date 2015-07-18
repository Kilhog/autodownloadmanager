'use strict';

var apiBetaseries = require("./dist/js/api-betaseries");
var apiGetStrike = require("./dist/js/api-getstrike");
var apiKickAss = require("./dist/js/api-kat.js");
var apiTorrent = require("./dist/js/api-torrent.js");
var apiTransmission = require("./dist/js/api-transmission");
var apiDblite = require("./dist/js/api-dblite");
var apiAddicted = require("./dist/js/api-addicted");
var apiT411 = require("./dist/js/api-t411");
var utils = require("./dist/js/api-utils.js");

var http = require('http');
var https = require('https');
var ipc = require('ipc');
var justOpen = true;

var app = angular.module('adm-app', ["ngMaterial", "ui.router"]);

$(document).ready(function(){
  ipc.send('dom-ready');
});

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
        templateUrl: 'dist/html/main.html'
      })
      .state("main.reglages", {
        controller: 'reglagesCtrl',
        parent: 'main',
        url: "/reglages",
        templateUrl: 'dist/html/reglages.html'
      })
      .state("main.manager", {
        controller: 'managerCtrl',
        parent: 'main',
        url: "/manager",
        templateUrl: 'dist/html/manager.html'
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

  var checkStatesAddic = function() {
    http.get('http://www.addic7ed.com/', function (res) {
      states.addicted = res.statusCode == 200;
    }).on('error', function() {
      states.addicted = false;
    });
  };

  var checkStatesStrike = function() {
    https.get('https://getstrike.net/torrents/', function (res) {
      states.getStrike = res.statusCode == 200;
    }).on('error', function() {
      states.getStrike = false;
    });
  };

  var checkStatesT411 = function() {
    http.get('http://www.t411.io/', function (res) {
      states.t411 = res.statusCode == 200;
    }).on('error', function() {
      states.t411 = false;
    });
  };

  var checkStatesKat = function() {
    http.get('http://kat.cr/', function (res) {
      states.kat = res.statusCode == 200;
    }).on('error', function() {
      states.kat = false;
    });
  };

  var checkStates = function() {
    checkStatesKat();
    checkStatesT411();
    checkStatesStrike();
    checkStatesAddic();
  };

  $interval(checkStates, 4000);
  
  $timeout(checkStatesKat, Math.floor((Math.random() * 2000) + 1) + 1500);
  $timeout(checkStatesT411, Math.floor((Math.random() * 2000) + 1) + 1500);
  $timeout(checkStatesStrike, Math.floor((Math.random() * 2000) + 1) + 1500);
  $timeout(checkStatesAddic, Math.floor((Math.random() * 2000) + 1) + 1500);

  return states;
}]).factory('toastFact', ["$mdToast", function ($mdToast) {
  return {
    show: function (msg, type) {
      $mdToast.show({
        template: '<md-toast class="md-toast ' + (type || "") + '">' + msg + '</md-toast>',
        position: 'bottom right',
        hideDelay: 3000
      });
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
}]).directive('ngRightClick', function($parse) {
  return function(scope, element, attrs) {
    var fn = $parse(attrs.ngRightClick);
    element.bind('contextmenu', function(event) {
      scope.$apply(function() {
        event.preventDefault();
        fn(scope, {$event:event});
      });
    });
  };
});
