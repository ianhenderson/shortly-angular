var app = angular.module('Shortly', ['ngRoute'])
  .controller('linksController', function($scope, $http){
    $scope.predicate = "-" + $scope.selector;
    $http({method: 'GET', url: 'http://localhost:4568/links'}).
      success(function(data, status, headers, config) {
        $scope.links = data;
        $scope.properties = Object.keys($scope.links[0]);
        console.log($scope.predicate);
      }).
      error(function(data, status, headers, config) {
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
  })

  .config(function($routeProvider, $locationProvider){
    $routeProvider
      .when('/', {
        templateUrl: 'templates/home.html',
        controller: 'linksController'
      })
      .when('/create', {
        templateUrl: 'templates/shorten.html',
        controller: 'shortenController'
      })
      .otherwise({
        redirectTo: '/'
      });

      $locationProvider.html5Mode(true);
  });
