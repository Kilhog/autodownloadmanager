app.directive('ngEnter', function() {
  return function(scope, element, attrs) {
    element.bind("keydown keypress", function(event) {
      if (event.which === 13) {
        scope.$apply(function() {
          scope.$eval(attrs.ngEnter);
        });
        event.preventDefault();
      }
    });
  };
});

app.controller('reglagesCtrl', ["$scope", "$timeout", "$filter", "toastFact", "$mdDialog", "$mdBottomSheet", "persistContainer",
  function ($scope, $timeout, $filter, toastFact, $mdDialog, $mdBottomSheet, persistContainer) {

    $scope.config = {};

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

      utils.getParam(persistContainer.apiDB, 'TRaccess', function(TRaccess) {
        $scope.TRhost = TRaccess.host;
        $scope.TRport = TRaccess.port;
        $scope.TRusername = TRaccess.username;
        $scope.TRpassword = TRaccess.password;

        $scope.$apply();
      }, true);
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

      utils.getParam(persistContainer.apiDB, 'BTaccess', function(BTaccess) {
        $scope.BTnom = BTaccess.login;
        $scope.BTpassword = BTaccess.password;

        $scope.$apply();
      }, true);
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
      utils.setParam(persistContainer.apiDB, 'episodeQuality', $scope.config.episodeQuality, function() {
        persistContainer.episodeQuality = $scope.config.episodeQuality;
        $scope.displayToast('Changement enregistré');
      });
    };

    $scope.refreshQuality = function() {
      $scope.config.episodeQuality = persistContainer.episodeQuality;
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

      utils.setParam(persistContainer.apiDB, 'strFolder', strPath, function() {
        $scope.displayToast('Dossier sous titres modifié');
      });
    });

    $scope.refreshST = function() {
      utils.getParam(persistContainer.apiDB, 'strFolder', function(res) {
        $scope.pathDownloadFolder = res;
        $scope.$apply();
      });
    };

    $scope.refreshST();

    /*
     T411
     */

    $scope.refreshT411 = function() {
      $scope.t411Token = persistContainer.apiT4.t411Client.token;
      $scope.t411Name = persistContainer.apiT4.name;

      utils.getParam(persistContainer.apiDB, 'T4access', function(T4access) {
        $scope.T4nom = T4access.login;
        $scope.T4password = T4access.password;

        $scope.$apply();
      }, true);
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
