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
            template: '<button id="clear">Clear</button><canvas id="musicCanvas"></canvas>',

            link: function(scope, element) {
                var intervalPromise;
                var canvas = element.find('canvas')[0];
                var canvasContext = canvas.getContext("2d");

                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                canvasContext.scale(1,1);

                var clearBtn = document.getElementById("clear");
                clearBtn.onclick = function() {
                    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
                    renderService.clearObjects();
                };

                function canvasMouseMove(e) {
                    renderService.drawNote(e.x, e.y);
                }

                window.addEventListener('mousemove', canvasMouseMove);

                graphicsEngineService.initialise(canvasContext);
                renderService.draw();
                
                // function gameLoop() {
                //     renderService.draw();
                // }

                // intervalPromise = $interval(gameLoop, 50);
                // scope.$on("$destroy", function() {
                //     if (intervalPromise) {
                //         $interval.cancel(intervalPromise);
                //         intervalPromise = undefined;
                //     }
                // });
            }
        }
    }]);
