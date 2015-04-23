'use strict';

var apiBetaseries = require("./dist/js/api-betaseries");
var apiGetStrike = require("./dist/js/api-getstrike");
var apiTransmission = require("./dist/js/api-transmission");
var apiDblite = require("./dist/js/api-dblite");
var apiAddicted = require("./dist/js/api-addicted");

var ipc = require('ipc');
var TRaccess = require('./TRaccess.json');
var justOpen = true;
var buttonCloseIsBind = false;

var app = angular.module('demo-app', ["ui.router", "ui.bootstrap", "ui-notification"]);

app.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/main/manager');

  $stateProvider
    // States
    .state("main", {
      controller: 'mainCtrl',
      url: "/main",
      templateUrl: 'partial/main.html'
    })
    .state("main.reglages", {
      controller: 'mainCtrl',
      parent: 'main',
      url: "/reglages",
      templateUrl: 'partial/reglages.html'
    })
    .state("main.manager", {
      controller: 'mainCtrl',
      parent: 'main',
      url: "/manager",
      templateUrl: 'partial/manager.html'
    });
}]).filter('numberFixedLen', function () {
  return function (n, len) {
    var num = parseInt(n, 10);
    len = parseInt(len, 10);
    if (isNaN(num) || isNaN(len)) {
      return n;
    }
    num = '' + num;
    while (num.length < len) {
      num = '0' + num;
    }
    return num;
  };
}).controller('mainCtrl', ["$scope", "$timeout", "$filter", "Notification" ,function ($scope, $timeout, $filter, Notification) {

  $scope.user = $scope.user || {};
  $scope.episodesUnseen = $scope.episodesUnseen || {};
  $scope.episodesIncoming = $scope.episodesIncoming || {};
  $scope.transmission = $scope.transmission || {obj: null};

  var apiDB = new apiDblite.apiDblite();
  var apiTR = new apiTransmission.apiTransmission($scope, "TRaccess.json", Notification);
  var apiBT = new apiBetaseries.apiBetaseries(apiDB, $scope, Notification);
  var apiST = new apiGetStrike.apiGetStrike($scope, apiTR, Notification);
  var apiAD = new apiAddicted.apiAddicted($scope);

  $scope.TRhost = TRaccess.host;
  $scope.TRport = TRaccess.port;

  function gen_name_episode(serie, saison, episode) {
    return serie + " S" + $filter('numberFixedLen')(saison, 2) + "E" + $filter('numberFixedLen')(episode, 2)
  }

  $scope.connectBetaseries = function (nom, password) {
    apiBT.saveAccess(nom, password, function () {
      apiBT.connectToApi();
    });
  };

  $scope.disconnectBetaseries = function () {
    apiBT.disconnectToApi();
  };

  $(document).ready(function(){
    if(!buttonCloseIsBind) {
      $('#close-window-button').click(function(){
        $scope.closeWindow();
      });
      buttonCloseIsBind = true;
    }
  });

  $scope.closeWindow = function() {
    ipc.send('hide-window');
    apiBT.disconnectToApi(function () {
      ipc.send('button-close-window');
    });
  };

  $scope.synchroAll = function() {
    $scope.synchroEpisodesUnseen();
    $scope.synchroEpisodesIncoming();
  };

  $scope.synchroEpisodesUnseen = function () {
    $scope.synchroInProgress = true;
    apiBT.synchroEpisodesUnseen(function() {
      $scope.synchroInProgress = false;
    });
  };

  $scope.synchroEpisodesIncoming = function() {
    $scope.synchroInProgress = true;
    apiBT.synchroEpisodesIncoming(function() {
      $scope.synchroInProgress = false;
    });
  };

  $scope.downloadEpisode = function(episode) {
    var name = gen_name_episode(episode.show.title, episode.season, episode.episode)
    apiST.searchAndDownload(name);
  };

  $scope.downloadStr = function(episode) {
    var name = gen_name_episode(episode.show.title, episode.season, episode.episode)

    apiAD.search(name, function(res) {
      if(res != '') {
        apiAD.downloadStr(res, name.trim(),function() {
          Notification.success('Sous-titre récupéré');
        });
      } else {
        Notification.error('Fail addicted');
      }
    });
  };

  $scope.seenEpisode = function(index, index2) {
    apiBT.seenEpisode($scope.episodesUnseen.shows[index].unseen[index2], function(){
      $scope.episodesUnseen.shows[index].unseen.splice(index2, 1);
      $scope.$apply();
    });
  };

  $scope.connectTransmission = function(host, port) {
    apiTR.saveAccess(host, port, function(){
      apiTR.connectToApi();
    });
  };

  $scope.disconnectTransmission = function() {
    apiTR.disconnectToApi();
  };

  $scope.changeTarget = function(origin) {
    console.log(origin)
  };

  $timeout(function(){
    if(!$scope.user.token && justOpen) {
      apiBT.connectToApi();
      justOpen = false;
    }
  }, 0);
}]);
