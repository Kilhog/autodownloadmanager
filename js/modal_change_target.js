'use strict';


app.controller('ModalChangeTargetCtrl', ["$scope", "$timeout", "$filter","$mdToast", "$mdDialog", "origin", "apiDB" ,function ($scope, $timeout, $filter, $mdToast, $mdDialog, origin, apiDB) {
  $scope.origin = origin;

  $scope.torrentname = "";

  apiDB.query("SELECT * FROM search_for_torrent WHERE origin = ?", [origin], function(err, data) {
    if(data == 0) {
      $scope.torrentname = origin;
    } else {
      $scope.torrentname = data[0][2];
    }
  });

  apiDB.query("SELECT * FROM search_for_sub WHERE origin = ?", [origin], function(err, data) {
    if(data == 0) {
      $scope.subname = origin;
    } else {
      $scope.subname = data[0][2];
    }

    $scope.$apply();
  });

  $scope.ok = function() {
    $modalInstance.close({torrentName: $scope.torrentname, subName: $scope.subname});
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
}]);
