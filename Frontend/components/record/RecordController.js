'use strict';

var mixTapeApp = angular.module('mixTapeApp', ['ngRoute', 'ngMaterial']);

mixTapeApp.controller('RecordController', ['$scope',
    function ($scope) {
        $scope.hello = "Hello World";
        // $scope.main.header = "E1";
    }]);
