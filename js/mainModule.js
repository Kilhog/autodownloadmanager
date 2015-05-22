'use strict';

var apiBetaseries = require("./dist/js/api-betaseries");
var apiGetStrike = require("./dist/js/api-getstrike");
var apiTransmission = require("./dist/js/api-transmission");
var apiDblite = require("./dist/js/api-dblite");
var apiAddicted = require("./dist/js/api-addicted");
var apiT411 = require("./dist/js/api-t411");
var utils = require("./dist/js/api-utils.js");

var ipc = require('ipc');
var justOpen = true;

var app = angular.module('adm-app', ["ngMaterial", "ui.router"]);

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
    num = '' + num;
    while (num.length < len) {
      num = '0' + num;
    }
    return num;
  };
}).factory('persistContainer', function () {
  return {};
}).factory('toastFact', ["$mdToast", function ($mdToast) {
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
}]);
