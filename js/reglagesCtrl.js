app.controller('reglagesCtrl', ["$scope", "$timeout", "$filter", "toastFact", "$mdDialog", "$mdBottomSheet", "persistContainer",
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
      persistContainer.apiTR.disconnectToApi(function () {
        $scope.transmission_obj = persistContainer.apiTR.transmission_obj;
      });
    };

    $scope.connectTransmission = function (host, port, username, password) {
      persistContainer.apiTR.saveAccess(host, port, username, password, function () {
        persistContainer.apiTR.connectToApi(function (res) {
          $scope.transmission_obj = persistContainer.apiTR.transmission_obj;
          if (res) {
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
        persistContainer.apiBT.connectToApi(function () {
          $scope.user = persistContainer.apiBT.user;

          if (persistContainer.apiBT.user.token) {
            $scope.displayToast('Connecté à Betaseries');
          } else {
            $scope.displayToast('Identifiants Betaseries incorrect', 'error');
          }

          $scope.$apply();
        });
      });
    };

    $scope.disconnectBetaseries = function () {
      persistContainer.apiBT.disconnectToApi(function () {
        $scope.user = persistContainer.apiBT.user;
        $scope.$apply();
      });
    };

    /*
     Qualité Episodes
     */

    $scope.episodeQuality = persistContainer.episodeQuality;

    $scope.changeQuality = function () {
      persistContainer.apiDB.query('DELETE FROM params WHERE nom = ?', ['episodeQuality'], function (err, rows) {
      });
      persistContainer.apiDB.query('INSERT INTO params (nom, value) VALUES (?, ?)', ['episodeQuality', $scope.episodeQuality], function (err, rows) {
        persistContainer.episodeQuality = $scope.episodeQuality;
        $scope.displayToast('Changement enregistré');
      });
    };

    /*
     Dossier ST
     */

    $scope.pathDownloadFolder = persistContainer.pathDownloadFolder;

    $scope.selectStrFolder = function (func) {
      ipc.send('dialog-selection-dossier');
    };

    ipc.on('dialog-selection-dossier-reply', function (arg) {
      var strPath = arg[0];
      $scope.pathDownloadFolder = persistContainer.pathDownloadFolder = strPath;
      $scope.$apply();

      persistContainer.apiDB.query('DELETE FROM params WHERE nom = ?', ['strFolder'], function (err, rows) {
        persistContainer.apiDB.query('INSERT INTO params (nom, value) VALUES (?, ?)', ['strFolder', strPath], function (err, rows) {
          $scope.displayToast('Dossier sous titres modifié');
        });
      });
    });

    /*
     T411
     */

    $scope.refreshT411 = function() {
      $scope.t411Token = persistContainer.apiT4.t411Client.token;
      $scope.t411Name = persistContainer.apiT4.name;
    };

    $scope.refreshT411();

    $scope.disconnectT411 = function() {
      persistContainer.apiT4.disconnectToApi(function(){
        $scope.refreshT411();
      });
    };

    $scope.connectT411 = function(username, password) {
      persistContainer.apiT4.connectToApi(username, password, function() {
        $scope.refreshT411();
        $scope.$apply();
      });
    };
  }]);