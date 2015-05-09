app.controller('ListBottomSheetCtrl', function($scope, $mdBottomSheet) {
  $scope.SeenEpisode = function (){
    $mdBottomSheet.hide("seen");
  };

});
