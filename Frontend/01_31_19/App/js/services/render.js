angular.module("mixTapeApp")
    .factory("renderService", ["graphicsEngineService", "globalSettings",
        function(graphicsEngineService, globalSettings) {
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
