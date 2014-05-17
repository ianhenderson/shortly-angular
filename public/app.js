var app = angular.module('Shortly', [])
  .controller('linksController', function($scope, $http){
    $http({method: 'GET', url: 'http://localhost:4568'}).
      success(function(data, status, headers, config) {
        $scope.links = data;
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });

  });
