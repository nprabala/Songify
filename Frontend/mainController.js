'use strict';

var mixTapeApp = angular.module('mixTapeApp', ['ngRoute', 'ngMaterial']);

mixTapeApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/info', {
                templateUrl: 'components/documentation/about-us.html',
                controller: 'AboutUsController'
            });
    }]);

mixTapeApp.controller('MainController', ['$scope',
    function ($scope) {
        $scope.main = {};
        $scope.main.header = "E1"
        $scope.FetchModel = function(url, doneCallback) {
            var request = new XMLHttpRequest();
            request.onreadystatechange = doneCallback;
            request.open('GET',url,true);
            request.send();
     };
    }]);
