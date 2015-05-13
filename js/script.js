'use strict';

var apiBetaseries = require("./dist/js/api-betaseries");
var apiGetStrike = require("./dist/js/api-getstrike");
var apiTransmission = require("./dist/js/api-transmission");
var apiDblite = require("./dist/js/api-dblite");
var apiAddicted = require("./dist/js/api-addicted");

var ipc = require('ipc');
var justOpen = true;
var buttonCloseIsBind = false;
var buttonMinimizeIsBind = false;

var app = angular.module('adm-app', ["ngMaterial", "ui.router"]);

app.config(["$stateProvider", "$urlRouterProvider", "$mdThemingProvider",
  function ($stateProvider, $urlRouterProvider, $mdThemingProvider) {
    $mdThemingProvider.theme('default').primaryPalette('grey', {
      'default': '800'
    }).accentPalette('lime', {
      'default': '500'
    });

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
}).controller('mainCtrl', ["$scope", "$timeout", "$filter", "$mdToast", "$mdDialog", "$mdBottomSheet",
  function ($scope, $timeout, $filter, $mdToast, $mdDialog, $mdBottomSheet) {

    $scope.user = $scope.user || {};
    $scope.pathDownloadFolder = $scope.pathDownloadFolder || "";
    $scope.episodesUnseen = $scope.episodesUnseen || {};
    $scope.episodesIncoming = $scope.episodesIncoming || {};
    $scope.transmission = $scope.transmission || {obj: null};

    $scope.showSimpleToast = function (msg) {
      $mdToast.show(
        $mdToast.simple()
          .content(msg)
          .position('bottom right')
          .hideDelay(3000)
      );
    };

    //Permet de personaliser les Toast (type error pour toast a fond rouge et success pour toast a fond vert)
    $scope.displayCustomToast = function (type, msg) {

      $mdToast.show({
        template: '<md-toast class="md-toast ' + type + '">' + msg + '</md-toast>',
        position: 'bottom right'
      });
    };

    var apiDB = new apiDblite.apiDblite();
    var apiTR = new apiTransmission.apiTransmission($scope, apiDB);
    var apiBT = new apiBetaseries.apiBetaseries(apiDB, $scope);
    var apiST = new apiGetStrike.apiGetStrike($scope, apiTR, apiDB);
    var apiAD = new apiAddicted.apiAddicted($scope, apiDB);

    $scope.episodeQuality = $scope.episodeQuality || getEpisodeQuality();

    function getEpisodeQuality() {
      apiDB.query('SELECT * FROM params WHERE nom = ?', ['episodeQuality'], function (err, rows) {
        if (rows.length > 0) {
          $scope.episodeQuality = rows[0][2];
          $scope.$apply();
        }
      });
    }

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


    $(document).ready(function () {
      if (!buttonCloseIsBind) {
        $('#close-window-button').click(function () {
          $scope.closeWindow();
        });
        buttonCloseIsBind = true;
      }

      if (!buttonMinimizeIsBind) {
        $('#reduce-window-button').click(function () {
          $scope.minimizeWindow();
        });

        buttonMinimizeIsBind = true;
      }
    });

    $scope.closeWindow = function () {
      ipc.send('hide-window');
      apiBT.disconnectToApi(function () {
        ipc.send('button-close-window');
      });
    };

    $scope.minimizeWindow = function () {
      ipc.send('minimize-window');
    };

    $scope.synchroAll = function () {
      $scope.synchroEpisodesUnseen();
      $scope.synchroEpisodesIncoming();
    };

    $scope.synchroEpisodesUnseen = function () {
      $scope.synchroInProgress = true;
      apiBT.synchroEpisodesUnseen(function () {
        $.each($scope.episodesUnseen.shows, function (index, elm) {
          apiDB.query('SELECT * FROM search_for_torrent WHERE origin = ?', [elm.title], function (err, data) {
            if (data.length > 0) {
              if (data[0][2] != elm.title) {
                elm.torrentName = data[0][2];
              }
            }
          });

          apiDB.query('SELECT * FROM search_for_sub WHERE origin = ?', [elm.title], function (err, data) {
            if (data.length > 0) {
              if (data[0][2] != elm.title) {
                elm.subName = data[0][2];
              }
            }
          });
        });
        $scope.synchroInProgress = false;
      });
    };

    $scope.synchroEpisodesIncoming = function () {
      apiBT.synchroEpisodesIncoming(function () {
      });
    };

    $scope.downloadEpisode = function (episode) {
      apiDB.query('SELECT * FROM search_for_torrent WHERE origin = ?', [episode.show.title], function (err, data) {
        var target = episode.show.title;

        if (data.length > 0) {
          target = data[0][2];
        }

        var name = gen_name_episode(target, episode.season, episode.episode);
        apiST.searchAndDownload(name);
      });
    };

    $scope.downloadStr = function (episode) {
      apiDB.query('SELECT * FROM search_for_sub WHERE origin = ?', [episode.show.title], function (err, data) {
        var target = episode.show.title;

        if (data.length > 0) {
          target = data[0][2];
        }

        var name = gen_name_episode(target, episode.season, episode.episode);

        apiAD.search(name, function (res) {
          if (res != '') {
            apiAD.downloadStr(res, name.trim(), function () {
              $scope.showSimpleToast('Sous-titre récupéré');
            });
          } else {
            $scope.showSimpleToast('Fail addicted');
          }
        });
      });
    };

    $scope.seenEpisode = function (index, index2) {
      apiBT.seenEpisode($scope.episodesUnseen.shows[index].unseen[index2], function () {
        $scope.episodesUnseen.shows[index].unseen.splice(index2, 1);
        $scope.$apply();
      });
    };

    $scope.connectTransmission = function (host, port) {
      apiTR.saveAccess(host, port, function () {
        apiTR.connectToApi();
      });
    };

    $scope.disconnectTransmission = function () {
      apiTR.disconnectToApi();
    };

    $scope.changeTarget = function (ev, origin) {

      $mdDialog.show({
        controller: 'ModalChangeTargetCtrl',
        templateUrl: 'partial/modal_change_target.html',
        targetEvent: ev,
        clickOutsideToClose: true,
        resolve: {
          origin: function () {
            return origin;
          },
          apiDB: function () {
            return apiDB;
          }
        }
      })
        .then(function (allName) {
          apiST.createNewTarget(origin, allName.torrentName);
          apiAD.createNewTarget(origin, allName.subName);
        }, function () {

        });
    };

    $scope.generateTooltipTitle = function (torrentName, subName) {
      var tooltip = "";
      if (torrentName) {
        if (torrentName.trim() != '') {
          tooltip = '<div class="prevent-line-break">Torrent : ' + torrentName + '</div>'
        }
      }

      if (subName) {
        if (subName.trim() != '') {
          tooltip += '<div class="prevent-line-break">Sub : ' + subName + '</div>'
        }
      }

      return tooltip;
    };

    $scope.changeQuality = function () {
      apiDB.query('DELETE FROM params WHERE nom = ?', ['episodeQuality'], function (err, rows) {
      });
      apiDB.query('INSERT INTO params (nom, value) VALUES (?, ?)', ['episodeQuality', $scope.episodeQuality], function (err, rows) {
        $scope.showSimpleToast('Changement enregistré');
      });
    };

    $scope.selectStrFolder = function (func) {
      ipc.send('dialog-selection-dossier');
    };

    $scope.checkStrFolderPath = function (func) {
      var strPath = "";
      apiDB.query('SELECT value FROM params WHERE nom = ?', ['strFolder'], function (err, rows) {
        if (rows.length > 0) {
          strPath = rows[0][0];
          $scope.pathDownloadFolder = strPath;
          $scope.$apply();
          if (func) {
            func();
          }
        }
        else {
          $scope.selectStrFolder(func);
        }
      });
    };

    $scope.changeQuality = function () {
      apiDB.query('DELETE FROM params WHERE nom = ?', ['episodeQuality'], function (err, rows) {
      });
      apiDB.query('INSERT INTO params (nom, value) VALUES (?, ?)', ['episodeQuality', $scope.episodeQuality], function (err, rows) {
        $scope.showSimpleToast('Changement enregistré');
      });
    };

    $timeout(function () {
      if (!$scope.user.token && justOpen) {
        apiBT.connectToApi(function () {
          if (!$scope.synchroInProgress) {
            $scope.synchroEpisodesUnseen();
          }
          $scope.checkStrFolderPath();
        });
        apiTR.connectToApi();
        justOpen = false;
      }
    }, 0);

    $scope.showListBottomSheet = function ($index, $index2, episode) {
      $scope.alert = '';
      $mdBottomSheet.show({
        templateUrl: 'partial/bottom-sheet-list-template.html',
        controller: 'ListBottomSheetCtrl',
        resolve: {
          episode: function () {
            return episode;
          }
        }
      }).then(function (clickedAction) {
        if (clickedAction == "seen") {
          $scope.seenEpisode($index, $index2);
        }
        if (clickedAction == "download") {
          $scope.downloadEpisode(episode);
        }
        if (clickedAction == "str") {
          $scope.downloadStr(episode);
        }
      });
    };

    ipc.on('dialog-selection-dossier-reply', function (arg) {
      var strPath = arg[0];
      $scope.pathDownloadFolder = strPath;
      $scope.$apply();
      //Stockage de ma variable
      apiDB.query('DELETE FROM params WHERE nom = ?', ['strFolder'], function (err, rows) {
        apiDB.query('INSERT INTO params (nom, value) VALUES (?, ?)', ['strFolder', strPath], function (err, rows) {
          $scope.showSimpleToast('Dossier sous titres modifié');
        });
      });
    });
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
