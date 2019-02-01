angular.module("mixTapeApp", [])

    .controller("mixTapeController", ["$scope", function($scope) {
    }])

    .directive("centipedeGame", ["$interval", "renderService", "graphicsEngineService", function($interval, renderService, graphicsEngineService) {
        return {
            restrict: 'A',
            template: '<canvas id="gameCanvas" width="2000" height="1000" style="border:1px solid #000000;"></canvas>',

            link: function(scope, element) {
                var intervalPromise;
                var canvas = element.find('canvas')[0].getContext("2d");

                graphicsEngineService.initialise(canvas);

                function gameLoop() {
                    renderService.draw();
                }

                intervalPromise = $interval(gameLoop, 50);

                scope.$on("$destroy", function() {
                    if (intervalPromise) {
                        $interval.cancel(intervalPromise);
                        intervalPromise = undefined;
                    }
                });
            }
        }
    }]);
