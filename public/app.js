var app = angular.module('Shortly', [])
  .controller('linksController', function($scope){
    $scope.links = ["yo", "thing", "things", "Omkar"];
  });
