app.controller('managerCtrl', ["$scope", "$timeout", "$filter", "toastFact", "$mdDialog", "$mdBottomSheet", "persistContainer", "$mdToast",
  function ($scope, $timeout, $filter, toastFact, $mdDialog, $mdBottomSheet, persistContainer, $mdToast) {

    $scope.$watch('selectedTabManagerIndex', function (current, old) {
      switch (current) {
        case 2:
          $timeout(function() {
            $('input#recherche_rapide')[0].focus();
          }, 100);
          break;
      }
    });

    $timeout(function() {
      ipc.send('dom-ready');
    }, 0);

    var apiDB = persistContainer.apiDB;
    var apiTR = persistContainer.apiTR;
    var apiBT = persistContainer.apiBT;
    var apiTO = persistContainer.apiTO;
    var apiAD = persistContainer.apiAD;
    var apiT4 = persistContainer.apiT4;
    var apiRB = persistContainer.apiRB;

    $scope.user = apiBT.user;
    $scope.episodesUnseen = apiBT.episodesUnseen;
    $scope.episodesIncoming = $scope.episodesIncoming || {};
    $scope.loadedEpisode = [];

    /*
     Synchronisation
     */

    $scope.synchroAll = function () {
      $scope.synchroEpisodesUnseen();
    };

    $scope.synchroEpisodesUnseen = function () {
      $scope.synchroInProgress = true;
      apiBT.synchroEpisodesUnseen(function (res) {
        $scope.episodesUnseen = apiBT.episodesUnseen;
        $scope.$apply();
        if (res) {
          toastFact.show('Synchronisation terminée');

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
          toastFact.show('Synchronisation échouée');
        }

        $scope.synchroInProgress = false;
        $scope.$apply();
      });
    };

    /*
     Download Episode | ST
     */

    function gen_name_episode(serie, saison, episode) {
      return serie + " S" + $filter('numberFixedLen')(saison, 2) + "E" + $filter('numberFixedLen')(episode, 2);
    }

    function remove_from_loaded_episode(id) {
      for (var i=$scope.loadedEpisode.length-1; i>=0; i--) {
        if ($scope.loadedEpisode[i] === id) {
          $scope.loadedEpisode.splice(i, 1);
        }
      }
    }

    function real_name_episode(episode) {
      return new Promise(
        function (resolve, reject) {
          apiDB.query('SELECT * FROM search_for_torrent WHERE origin = ?', [episode.show.title], function (err, data) {
            var target = data.length > 0 ? data[0][2] : episode.show.title;
            resolve(gen_name_episode(target, episode.season, episode.episode));
          });
        }
      )
    }

    $scope.downloadEpisode = function (episode) {
      $scope.loadedEpisode.push(episode.id);

      real_name_episode(episode).then(function(name) {
        apiTO.searchAndDownload(name, persistContainer.episodeQuality).then(function() {
          toastFact.show('Torrent ajouté !');
          remove_from_loaded_episode(episode.id);
        }, function() {
          toastFact.show('Aucun torrent trouvé !');
          remove_from_loaded_episode(episode.id);
        });
      });
    };

    $scope.redirectDownload = function(episode) {
      real_name_episode(episode).then(function(name) {
        $scope.recherche_rapide = name;
        $scope.recherche_change();
        $scope.selectedTabManagerIndex = 2;
      });
    };

    $scope.downloadStr = function (episode) {
      $scope.loadedEpisode.push(episode.id);

      apiDB.query('SELECT * FROM search_for_sub WHERE origin = ?', [episode.show.title], function (err, data) {
        var target = data.length > 0 ? data[0][2] : episode.show.title,
          name = gen_name_episode(target, episode.season, episode.episode);

        apiAD.search(name, function (res) {
          if (res != '') {
            utils.getParam(apiDB, 'strFolder', function(strPath) {
              apiAD.downloadStr(res, name.trim(), strPath, function () {
                toastFact.show('Sous-titre récupéré');
                remove_from_loaded_episode(episode.id);
              }, function() {
                toastFact.show('Erreur lors de la récupération des sous-titres');
                remove_from_loaded_episode(episode.id);
              });
            })
          } else {
            toastFact.show('Sous-titres non trouvés');
            remove_from_loaded_episode(episode.id);
          }
        });
      });
    };

    $scope.redirectStr = function(episode) {
      apiDB.query('SELECT * FROM search_for_sub WHERE origin = ?', [episode.show.title], function (err, data) {
        var target = data.length > 0 ? data[0][2] : episode.show.title,
          name = gen_name_episode(target, episode.season, episode.episode);

        apiAD.openUrl(name);
      });
    };

    /*
     Marquer comme vu
     */

    $scope.seenEpisode = function (index, index2) {
      var episode = $scope.episodesUnseen.shows[index].unseen[index2];
      $scope.loadedEpisode.push(episode.id);

      apiBT.seenEpisode(episode, function () {
        $mdToast.show($mdToast.simple().textContent('Episode marqué comme vu').action('Annuler').highlightAction(false).position("bottom right")).then(function(response) {
          if(response == 'ok') {
            apiBT.unseenEpisode(episode, function () {
              $scope.synchroAll();
            });
          }
        });

        $scope.episodesUnseen.shows[index].unseen.splice(index2, 1);
        if($scope.episodesUnseen.shows[index].unseen.length == 0) {
          $scope.episodesUnseen.shows.splice(index, 1);
        }
        remove_from_loaded_episode(episode.id);
        $scope.$apply();
      });
    };

    /*
     Modal changement de nom de recherche
     */

    $scope.changeTarget = function (ev, origin) {
      var createNewTarget = function(origin, target, table) {
        if(target.trim() != '') {
          apiDB.query("DELETE FROM " + table + " WHERE origin = ?", [origin], function() {
            apiDB.query("INSERT INTO " + table + " (origin, target) VALUES (?,?)", [origin, target], function() {});
          });
        } else {
          apiDB.query("DELETE FROM " + table + " WHERE origin = ?", [origin], function() {});
        }
      };

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
      }).then(function (allName) {
        createNewTarget(origin, allName.torrentName, 'search_for_torrent');
        createNewTarget(origin, allName.subName, 'search_for_sub');
      });
    };

    /*
     Affiche la liste des actions pour un épisode
     */

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

    /*
     Action lors de l'ouverture de l'application
     */

    $timeout(function () {
      if (!$scope.user.token && justOpen) {
        apiBT.connectToApi(function (res) {
          $scope.user = apiBT.user;
          $scope.user['done'] = true;

          if (apiBT.user.token) {
            toastFact.show('Connecté à Betaseries');
          } else {
            toastFact.show('Identifiants Betaseries incorrect', 'error');
          }

          $scope.$apply();

          if (!$scope.synchroInProgress) {
            $scope.synchroEpisodesUnseen();
          }
        });

        apiTR.connectToApi(function (res) {
          if (res) {
            toastFact.show('Connecté à Transmission');
          } else {
            toastFact.show('Erreur lors de la connection à Transmission', 'error');
          }
          $scope.$apply();
        });

        apiT4.connectToApi(function() {
          if(apiT4.t411Client.token) {
            toastFact.show('Connecté à T411');
          } else {
            toastFact.show('Erreur lors de la connection à T411', 'error');
          }
        });

        justOpen = false;
      }
    }, 0);

    /*
     Recherche rapide
     */

    $scope.recherche_rapide = "";
    $scope.torrents = [];
    $scope.showSpinnerRechercheRapide = false;

    $scope.recherche_change = function() {
      if($scope.recherche_rapide.length > 2) {
        $scope.showSpinnerRechercheRapide = true;

        apiTO.getTorrentsWithSearch($scope.recherche_rapide, function(torrents) {
          $scope.showSpinnerRechercheRapide = false;

          $scope.torrents = torrents;
          if(!$scope.$$phase) {
            $scope.$apply();
          }
        });
      } else {
        $scope.showSpinnerRechercheRapide = false;
        $scope.torrents = [];
      }
    };

    $scope.downloadTorrent = function(torrent) {
      apiTO.download(torrent.torrentLink, torrent.tracker).then(function() {
        toastFact.show('Torrent ajouté !');
      });
    };

  }]);
