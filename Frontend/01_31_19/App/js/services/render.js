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

            function getObjects() {
                graphicsEngineService.getObjects();
            }

            function addObject(x, y, length) {
                graphicsEngineService.addObject(x, y, length);
            }

            function drawObjects() {
                graphicsEngineService.drawObjects();
            }

            function clearObjects() {
                graphicsEngineService.clearObjects();
                graphicsEngineService.drawObjects();
            } 

            return {
                draw: function() {
                    drawStaff();
                },
                drawNote: function(x, y) {
                    addObject(x, y, 100);
                    drawObjects();
                },
                getObjects: function() {
                    getObjects();
                },
                clearObjects: function() {
                    clearObjects();
                    drawStaff();
                }
            }
        }]);
