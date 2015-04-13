'use strict';

var apiBetaseries = require("./js/api-betaseries");
var apiGetStrike = require("./js/api-getstrike");
var apiTransmission = require("./js/api-transmission");
var gui = require('nw.gui');
var win = gui.Window.get();
var BTaccess = require('./BTaccess.json');
var TRaccess = require('./TRaccess.json');
var justOpen = true;
win.showDevTools();
win.setResizable(false);
win.show();

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
}).controller('mainCtrl', function ($scope, $timeout, $filter, Notification) {

  $scope.user = $scope.user || {};
  $scope.episodesUnseen = $scope.episodesUnseen || {};
  $scope.transmission = $scope.transmission || {obj: null};

  var apiTR = new apiTransmission.apiTransmission($scope, "TRaccess.json", Notification);
  var apiBT = new apiBetaseries.apiBetaseries("BTaccess.json", $scope, Notification);
  var apiST = new apiGetStrike.apiGetStrike($scope, gui, apiTR, Notification);

  $scope.BTnom = BTaccess.login;
  $scope.BTpassword = BTaccess.password;
  $scope.TRhost = TRaccess.host;
  $scope.TRport = TRaccess.port;

  $scope.connectBetaseries = function (nom, password) {
    apiBT.saveAccess(nom, password, function () {
      apiBT.connectToApi();
    });
  };

  $scope.disconnectBetaseries = function () {
    apiBT.disconnectToApi();
  };

  $("#close-window-button").click(function () {
    win.hide();

    apiBT.disconnectToApi(function () {
      win.close();
    });
  });

  $scope.synchroEpisodesUnseen = function () {
    apiBT.synchroEpisodesUnseen();
  };

  $scope.downloadEpisode = function(episode) {
    apiST.searchAndDownload(episode.show.title, $filter('numberFixedLen')(episode.season, 2), $filter('numberFixedLen')(episode.episode, 2));
  };

  $scope.seenEpisode = function(index, index2) {
    console.log($scope.episodesUnseen.shows[index].unseen[index2].id);
    apiBT.seenEpisode($scope.episodesUnseen.shows[index].unseen[index2], function(){
      $scope.episodesUnseen.shows[index].unseen.splice(index2, 1);
    });
  };

  $scope.connectTransmission = function(host, port) {
    //apiTR.connectToApi();

    apiTR.saveAccess(host, port, function(){
      apiTR.connectToApi();
    });

    //apiBT.saveAccess(nom, password, function () {
    //  apiBT.connectToApi();
    //});

  };

  $scope.disconnectTransmission = function() {
    apiTR.disconnectToApi();
  };

  $timeout(function(){
    if(!$scope.user.token && justOpen) {
      apiBT.connectToApi();
      justOpen = false;
    }
  }, 0);
});
