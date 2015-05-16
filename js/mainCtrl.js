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
    persistContainer.apiGS = new apiGetStrike.apiGetStrike(persistContainer.apiTR, persistContainer.apiDB);
    persistContainer.apiAD = new apiAddicted.apiAddicted(persistContainer.apiDB);

    /*
     Qualité des épisodes
     */

    function getEpisodeQuality(func) {
      persistContainer.apiDB.query('SELECT * FROM params WHERE nom = ?', ['episodeQuality'], function (err, rows) {
        if (rows.length > 0) {
          func(rows[0][2]);
        }
      });
    }

    getEpisodeQuality(function (res) {
      persistContainer.episodeQuality = res;
    });
  }]);