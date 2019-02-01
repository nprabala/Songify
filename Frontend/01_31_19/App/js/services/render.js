angular.module("mixTapeApp")
    .factory("renderService", ["graphicsEngineService", "globalSettings", "coordinateSystem",
        function(graphicsEngineService, globalSettings, coordinateSystem) {
            "use strict";

            function blankScreen() {
                graphicsEngineService.blankScreen();
            }

            function drawStaff() {
                graphicsEngineService.drawStaff();
            }

            return {
                draw: function() {
                    blankScreen();
                    drawStaff();
                }
            }
        }]);
