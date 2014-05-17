var app = angular.module('Shortly', [])
  .controller('linksController', function($scope, $http){
    $http({method: 'GET', url: 'http://localhost:4568/links'}).
      success(function(data, status, headers, config) {
        $scope.links = data;
        console.log(data);
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });
  })

  .controller('shortenController', function($scope, $http){

    $scope.submit = function(){
      $scope.message = {
        url: $scope.text
      };

      $http({
        method: 'POST',
        url: 'http://localhost:4568/links',
        data: JSON.stringify($scope.message),
      }).
        success(function(data, status, headers, config) {
          $scope.links = data;
          console.log(data);
        }).
        error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
    };
  });
