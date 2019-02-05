angular.module("mixTapeApp")
    .factory("renderService", ["graphicsEngineService", "globalSettings",
        function(graphicsEngineService, globalSettings) {
            "use strict";

            function drawStaff() {
                graphicsEngineService.drawStaff();
            }

            function drawNote(x, y) {
                graphicsEngineService.drawNote(x, y);
            }


            return {
                draw: function() {
                    drawStaff();
                },
                drawNote: function(x, y) {
                    drawNote(x, y);
                }
            }
        }]);
