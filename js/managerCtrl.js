app.controller('managerCtrl', ["$scope", "$timeout", "$filter", "toastFact", "$mdDialog", "$mdBottomSheet", "persistContainer",
  function ($scope, $timeout, $filter, toastFact, $mdDialog, $mdBottomSheet, persistContainer) {

    $scope.$watch('selectedTabManagerIndex', function (current, old) {
      switch (current) {
        case 2:
          $timeout(function() {
            $('input#recherche_rapide')[0].focus();
          }, 100);
          break;
      }
    });



    /**
     * Permet d'afficher des Toasts
     * @param msg - Message à afficher
     * @param type 'error' || 'success' || undefined
     */
    $scope.displayToast = function (msg, type) {
      toastFact.show(msg, type);
    };

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
          $scope.displayToast('Synchronisation terminée');

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
          $scope.displayToast('Synchronisation échouée');
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

    $scope.downloadEpisode = function (episode) {
      $scope.loadedEpisode.push(episode.id);

      apiDB.query('SELECT * FROM search_for_torrent WHERE origin = ?', [episode.show.title], function (err, data) {
        var target = data.length > 0 ? data[0][2] : episode.show.title,
          name = gen_name_episode(target, episode.season, episode.episode);

        apiTO.searchAndDownload(name, persistContainer.episodeQuality).then(function() {
          $scope.displayToast('Torrent ajouté !');
          remove_from_loaded_episode(episode.id);
        }, function() {
          $scope.displayToast('Aucun torrent trouvé !');
          remove_from_loaded_episode(episode.id);
        });

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
                $scope.displayToast('Sous-titre récupéré');
                remove_from_loaded_episode(episode.id);
              }, function() {
                $scope.displayToast('Erreur lors de la récupération des sous-titres');
                remove_from_loaded_episode(episode.id);
              });
            })
          } else {
            $scope.displayToast('Sous-titres non trouvés');
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
      var id = $scope.episodesUnseen.shows[index].unseen[index2].id;
      $scope.loadedEpisode.push(id);

      apiBT.seenEpisode($scope.episodesUnseen.shows[index].unseen[index2], function () {
        $scope.episodesUnseen.shows[index].unseen.splice(index2, 1);
        if($scope.episodesUnseen.shows[index].unseen.length == 0) {
          $scope.episodesUnseen.shows.splice(index, 1);
        }
        remove_from_loaded_episode(id);
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
        templateUrl: 'dist/html/modal_change_target.html',
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
        templateUrl: 'dist/html/bottom-sheet-list-template.html',
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
            $scope.displayToast('Connecté à Betaseries');
          } else {
            $scope.displayToast('Identifiants Betaseries incorrect', 'error');
          }

          $scope.$apply();

          if (!$scope.synchroInProgress) {
            $scope.synchroEpisodesUnseen();
          }
        });

        apiTR.connectToApi(function (res) {
          if (res) {
            $scope.displayToast('Connecté à Transmission');
          } else {
            $scope.displayToast('Erreur lors de la connection à Transmission', 'error');
          }
          $scope.$apply();
        });

        apiT4.connectToApi(function() {
          if(apiT4.t411Client.token) {
            $scope.displayToast('Connecté à T411');
          } else {
            $scope.displayToast('Erreur lors de la connection à T411', 'error');
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
        $scope.displayToast('Torrent ajouté !');
      });
    };

  }]);
