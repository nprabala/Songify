angular.module("mixTapeApp", [])
    .controller("mixTapeController", ["$scope", "graphicsEngineService", "utilsService", "renderService", 
        function($scope,graphicsEngineService, utilsService, renderService) {
        $scope.hello = "Welcome To Mixtape";
        $scope.getNote = function(event) {
            var lineHeight = graphicsEngineService.lineHeight;
            var staffHeight = graphicsEngineService.staffHeight;
            var canvasHeight = graphicsEngineService.canvas_height;
            var staffGap = graphicsEngineService.staffGap;
            return utilsService.getNote(event.originalEvent.screenY, lineHeight, staffHeight, canvasHeight, staffGap);
        };
    }])

    .directive("mixtapeApp", ["$interval", "renderService", "graphicsEngineService", "utilsService", function($interval, renderService, graphicsEngineService, utilsService) {
        return {
            restrict: 'A',
            template: '<canvas id="musicCanvas" width="2000" height="1000"></canvas>',

            link: function(scope, element) {
                var intervalPromise;
                var canvas = element.find('canvas')[0];
                var canvasContext = canvas.getContext("2d");

                function canvasMouseMove(e) {
                    var rect = canvas.getBoundingClientRect();
                    scaleX = canvas.width / rect.width,
                    scaleY = canvas.height / rect.height;
                    renderService.drawNote((e.clientX - rect.left) * scaleX, e.y);
                }

                window.addEventListener('mousemove', canvasMouseMove);

                graphicsEngineService.initialise(canvasContext);

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
