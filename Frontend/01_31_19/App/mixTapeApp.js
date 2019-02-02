angular.module("mixTapeApp", [])
    .controller("mixTapeController", ["$scope", "graphicsEngineService", "utilsService", function($scope,graphicsEngineService, utilsService) {
        $scope.hello = "Welcome To Mixtape";
        $scope.notes = [];
        $scope.addNote = function(event){
            var lineHeight = graphicsEngineService.lineHeight;
            var staffHeight = graphicsEngineService.staffHeight;
            var canvasHeight = graphicsEngineService.canvas_height;
            var leftOffset = graphicsEngineService.canvas_horizontal_padding;
            var topOffset = graphicsEngineService.canvas_vertical_padding;
            var staffGap = graphicsEngineService.staffGap;
            var xPos  = event.originalEvent.screenX;
            var yPos  = event.originalEvent.screenY;
            var note = utilsService.createNote(xPos, yPos,lineHeight,staffHeight,canvasHeight,staffGap);
            $scope.notes.push(note);
            graphicsEngineService.drawNote(xPos - leftOffset - staffGap,yPos - topOffset - staffGap);
        };
    }])

    .directive("mixtapeApp", ["$interval", "renderService", "graphicsEngineService",
     "utilsService", function($interval, renderService, graphicsEngineService,  utilsService) {
        return {
            restrict: 'A',
            template: '<canvas id="gameCanvas" ng-click="addNote($event)" width="2000" height="1000" style="border:1px solid #000000;"></canvas>',

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
