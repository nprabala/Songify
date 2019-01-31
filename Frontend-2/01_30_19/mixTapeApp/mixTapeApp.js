'use strict';

// Declare app level module which depends on views, and core components
angular.module('mixTapeApp', [
  'ngRoute',
  'mixTapeApp.main',
  'mixTapeApp.record'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/main'});
}]);
