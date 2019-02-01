'use strict';

angular.module('mixTapeApp.main', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'components/main/main.html',
    controller: 'MainController'
  });
}])

.controller('MainController', [function() {

}]);