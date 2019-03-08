'use strict';

var mixTapeApp = angular.module('mixTapeApp', ['ngRoute', 'ngMaterial']);

mixTapeApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/info', {
                templateUrl: 'components/documentation/about-us.html',
                controller: 'AboutUsController'
            }).
            when('/record', {
                templateUrl: 'components/record/record.html',
                controller: 'RecordController'
            });
    }]);

mixTapeApp.controller('MainController', ['$scope',
    function ($scope) {
        $scope.main = {};
        $scope.main.header = "E1";
    }]);
