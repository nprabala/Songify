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

    .directive("mixtapeApp", ["$interval", "renderService", "graphicsEngineService", "utilsService", "globalSettings",
        function($interval, renderService, graphicsEngineService, utilsService, globalSettings) {
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

                canvas.style.width = canvas.width;
                canvas.style.height = canvas.height;

                var clearBtn = document.getElementById("clear");
                clearBtn.onclick = function() {
                    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
                    renderService.clearObjects();
                };

                graphicsEngineService.initialise(canvasContext);

                function canvasMouseClick(e) {
                    console.log("mouse click: " + e.x + ", " + e.y);
                    // renderService.drawNote(e.x / 2, e.y / 2 - 2*globalSettings.noteRadius);
                }

                function canvasResize(e) {
                    console.log("resizing canvas");
                    var width = window.innerWidth;
                    var height = window.innerHeight;
                    canvas.width = width;
                    canvas.height = height;
                    canvas.style.width = width;
                    canvas.style.height = height;
                    graphicsEngineService.initialise(canvasContext);
                    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
                    renderService.draw();
                }

                window.addEventListener('mousedown', canvasMouseClick);
                window.addEventListener('resize', canvasResize, true);

                renderService.draw();
                
                // function gameLoop() {
                //     var width = window.innerWidth;
                //     var height = window.innerHeight;
                //     if (canvas.width != width || canvas.height != height) {
                //         canvas.width = width;
                //         canvas.height = height;
                //    }
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
