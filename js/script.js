'use strict';

var apiBetaseries = require("./dist/js/api-betaseries");
var apiGetStrike = require("./dist/js/api-getstrike");
var apiTransmission = require("./dist/js/api-transmission");
var apiDblite = require("./dist/js/api-dblite");
var apiAddicted = require("./dist/js/api-addicted");

var ipc = require('ipc');
var justOpen = true;

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
}).factory('persistContainer', function() {
  return {};
}).factory('toastFact', ["$mdToast", function($mdToast) {
  return {
    show: function(msg, type) {
      $mdToast.show({
        template: '<md-toast class="md-toast ' + (type || "") + '">' + msg + '</md-toast>',
        position: 'bottom right',
        hideDelay: 3000
      });
    }
  };
}]).controller('mainCtrl', ["$scope", "persistContainer",
  function ($scope, persistContainer) {

    /*
      Bind boutons d'actions de la fenetre
     */
    $(document).ready(function () {
      $('#close-window-button').click(function () {
        $scope.closeWindow();
      });

      $('#reduce-window-button').click(function () {
        $scope.minimizeWindow();
      });
    });

    $scope.closeWindow = function () {
      ipc.send('hide-window');
      persistContainer.apiBT.disconnectToApi(function () {
        ipc.send('button-close-window');
      });
    };

    $scope.minimizeWindow = function () {
      ipc.send('minimize-window');
    };

    /*
      Instanciation des api
     */
    persistContainer.apiDB = new apiDblite.apiDblite();
    persistContainer.apiTR = new apiTransmission.apiTransmission(persistContainer.apiDB);
    persistContainer.apiBT = new apiBetaseries.apiBetaseries(persistContainer.apiDB);
    persistContainer.apiGS = new apiGetStrike.apiGetStrike(persistContainer.apiTR, persistContainer.apiDB);
    persistContainer.apiAD = new apiAddicted.apiAddicted(persistContainer.apiDB);

  }]).controller('reglagesCtrl', ["$scope", "$timeout", "$filter", "toastFact", "$mdDialog", "$mdBottomSheet", "persistContainer",
  function ($scope, $timeout, $filter, toastFact, $mdDialog, $mdBottomSheet, persistContainer) {

    /**
     * Permet d'afficher des Toasts
     * @param msg - Message à afficher
     * @param type 'error' || 'success' || undefined
     */
    $scope.displayToast = function (msg, type) {
      toastFact.show(msg, type);
    };

    /*
      Transmission
     */

    $scope.transmission_obj = persistContainer.apiTR.transmission_obj;

    $scope.disconnectTransmission = function () {
      persistContainer.apiTR.disconnectToApi(function() {
        $scope.transmission_obj = persistContainer.apiTR.transmission_obj;
      });
    };

    $scope.connectTransmission = function (host, port) {
      persistContainer.apiTR.saveAccess(host, port, function () {
        persistContainer.apiTR.connectToApi(function(res) {
          $scope.transmission_obj = persistContainer.apiTR.transmission_obj;
          if(res) {
            $scope.displayToast('Connecté à Transmission');
          } else {
            $scope.displayToast('Erreur lors de la connection à Transmission', 'error');
          }
          $scope.$apply();
        });
      });
    };

    /*
      BetaSeries
     */

    $scope.user = persistContainer.apiBT.user;

    $scope.connectBetaseries = function (nom, password) {
      persistContainer.apiBT.saveAccess(nom, password, function () {
        persistContainer.apiBT.connectToApi(function(){
          $scope.user = persistContainer.apiBT.user;

          if(persistContainer.apiBT.user.token) {
            $scope.displayToast('Connecté à Betaseries');
          } else {
            $scope.displayToast('Identifiants Betaseries incorrect', 'error');
          }

          $scope.$apply();
        });
      });
    };

    $scope.disconnectBetaseries = function () {
      persistContainer.apiBT.disconnectToApi(function(){
        $scope.user = persistContainer.apiBT.user;
        $scope.$apply();
      });
    };


  }]).controller('managerCtrl', ["$scope", "$timeout", "$filter", "toastFact", "$mdDialog", "$mdBottomSheet", "persistContainer",
  function ($scope, $timeout, $filter, toastFact, $mdDialog, $mdBottomSheet, persistContainer) {

    /**
     * Permet d'afficher des Toasts
     * @param msg - Message à afficher
     * @param type 'error' || 'success' || undefined
     */
    $scope.displayToast = function (msg, type) {
      toastFact.show(msg, type);
    };

    var apiDB = persistContainer.apiDB;
    var apiTR = persistContainer.apiTR;
    var apiBT = persistContainer.apiBT;
    var apiGS = persistContainer.apiGS;
    var apiAD = persistContainer.apiAD;

    $scope.user = apiBT.user;
    $scope.episodesUnseen = apiBT.episodesUnseen;
    $scope.episodeQuality = $scope.episodeQuality || getEpisodeQuality();
    $scope.pathDownloadFolder = $scope.pathDownloadFolder || "";
    $scope.episodesIncoming = $scope.episodesIncoming || {};

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

    $scope.synchroAll = function () {
      $scope.synchroEpisodesUnseen();
      $scope.synchroEpisodesIncoming();
    };

    $scope.synchroEpisodesUnseen = function () {
      $scope.synchroInProgress = true;
      apiBT.synchroEpisodesUnseen(function (res) {
        $scope.episodesUnseen = apiBT.episodesUnseen;
        $scope.$apply();
        if(res) {
          $scope.displayToast('Synchronisation terminée')

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
        } else {
          $scope.displayToast('Synchronisation échouée')
        }

        $scope.synchroInProgress = false;
        $scope.$apply();
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
        apiGS.searchAndDownload(name, $scope.episodeQuality, function(res){
          if(res) {
            $scope.displayToast('Torrent ajouté !');
          } else {
            $scope.displayToast('Aucun torrent trouvé !');
          }
        });
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
            $scope.checkStrFolderPath(function() {
              apiAD.downloadStr(res, name.trim(), $scope.pathDownloadFolder, function () {
                $scope.displayToast('Sous-titre récupéré');
              });
            });
          } else {
            $scope.displayToast('Fail addicted');
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
          apiGS.createNewTarget(origin, allName.torrentName);
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
        $scope.displayToast('Changement enregistré');
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
        $scope.displayToast('Changement enregistré');
      });
    };

    $timeout(function () {
      if (!$scope.user.token && justOpen) {
        apiBT.connectToApi(function (res) {
          $scope.user = apiBT.user;

          if(apiBT.user.token) {
            $scope.displayToast('Connecté à Betaseries');
          } else {
            $scope.displayToast('Identifiants Betaseries incorrect', 'error');
          }

          $scope.$apply();

          if (!$scope.synchroInProgress) {
            $scope.synchroEpisodesUnseen();
          }
          $scope.checkStrFolderPath();
        });
        apiTR.connectToApi(function(res) {
          if(res) {
            $scope.displayToast('Connecté à Transmission');
          } else {
            $scope.displayToast('Erreur lors de la connection à Transmission', 'error');
          }
          $scope.$apply();
        });
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
          $scope.displayToast('Dossier sous titres modifié');
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
