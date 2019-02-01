'use strict';

angular.module('mixTapeApp.record', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/record', {
    templateUrl: 'components/record/record.html',
    controller: 'RecordController'
  });
}])

.controller('RecordController', [function() {

}]);