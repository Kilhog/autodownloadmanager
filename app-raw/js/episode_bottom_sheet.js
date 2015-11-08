app.controller('ListBottomSheetCtrl', ['$scope', '$mdBottomSheet', 'episode',
  function($scope, $mdBottomSheet, episode) {
    $scope.episode = episode;

    $scope.seenEpisode = function (){
      $mdBottomSheet.hide("seen");
    };
    $scope.downloadEpisode = function (){
      $mdBottomSheet.hide("download");
    };
    $scope.downloadStr = function (){
      $mdBottomSheet.hide("str");
    };
  }
]);
