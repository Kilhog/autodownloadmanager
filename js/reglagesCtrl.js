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

    $scope.refreshTR = function() {
      $scope.transmission_obj = persistContainer.apiTR.transmission_obj;

      persistContainer.apiDB.query("SELECT * FROM params WHERE nom = ?", ['TRaccess'], function(err, rows) {
        if (rows.length > 0) {
          var TRaccess = JSON.parse(rows[0][2]);

          $scope.TRhost = TRaccess.host;
          $scope.TRport = TRaccess.port;
          $scope.TRusername = TRaccess.username;
          $scope.TRpassword = TRaccess.password;

          $scope.$apply();
        }
      });
    };

    $scope.refreshTR();

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

    $scope.refreshBT = function() {
      $scope.user = persistContainer.apiBT.user;

      persistContainer.apiDB.query("SELECT * FROM params WHERE nom = ?", ['BTaccess'], function(err, rows) {
        if (rows.length > 0) {
          var BTaccess = JSON.parse(rows[0][2]);
          $scope.BTnom = BTaccess.login;
          $scope.BTpassword = BTaccess.password;
          $scope.$apply();
        }
      });
    };

    $scope.refreshBT();

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

    $scope.changeQuality = function () {
      persistContainer.apiDB.query('DELETE FROM params WHERE nom = ?', ['episodeQuality'], function (err, rows) {
      });
      persistContainer.apiDB.query('INSERT INTO params (nom, value) VALUES (?, ?)', ['episodeQuality', $scope.episodeQuality], function (err, rows) {
        persistContainer.episodeQuality = $scope.episodeQuality;
        $scope.displayToast('Changement enregistré');
      });
    };

    $scope.refreshQuality = function() {
      $scope.episodeQuality = persistContainer.episodeQuality;
    };

    $scope.refreshQuality();

    /*
     Dossier ST
     */

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

    $scope.refreshST = function() {
      persistContainer.apiDB.query("SELECT * FROM params WHERE nom = ?", ['strFolder'], function(err, rows) {
        if (rows.length > 0) {
          $scope.pathDownloadFolder = rows[0][2];
          $scope.$apply();
        }
      });
    };

    $scope.refreshST();

    /*
     T411
     */

    $scope.refreshT411 = function() {
      $scope.t411Token = persistContainer.apiT4.t411Client.token;
      $scope.t411Name = persistContainer.apiT4.name;

      persistContainer.apiDB.query("SELECT * FROM params WHERE nom = ?", ['T4access'], function(err, rows) {
        if (rows.length > 0) {
          var T4access = JSON.parse(rows[0][2]);

          $scope.T4nom = T4access.login;
          $scope.T4password = T4access.password;

          $scope.$apply();
        }
      });
    };

    $scope.refreshT411();

    $scope.disconnectT411 = function() {
      persistContainer.apiT4.disconnectToApi(function(){
        $scope.refreshT411();
      });
    };

    $scope.connectT411 = function(username, password) {
      persistContainer.apiT4.saveAccess(username, password, function() {
        persistContainer.apiT4.connectToApi(function() {
          $scope.refreshT411();
          $scope.$apply();
        });
      });
    };
  }]);