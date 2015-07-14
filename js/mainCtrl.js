app.controller('mainCtrl', ["$scope", "persistContainer",
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
    persistContainer.apiGS = new apiGetStrike.apiGetStrike(persistContainer.apiTR);
    persistContainer.apiT4 = new apiT411.apiT411(persistContainer.apiDB);
    persistContainer.apiKA = new apiKickAss();
    persistContainer.apiTO = new apiTorrent(persistContainer.apiTR, persistContainer.apiT4, persistContainer.apiGS, persistContainer.apiKA);
    persistContainer.apiAD = new apiAddicted.apiAddicted(persistContainer.apiDB);

    /*
     Qualité des épisodes
     */

    function getEpisodeQuality(func) {
      utils.getParam(persistContainer.apiDB, 'episodeQuality', func);
    }

    getEpisodeQuality(function (res) {
      persistContainer.episodeQuality = res;
    });
  }]);