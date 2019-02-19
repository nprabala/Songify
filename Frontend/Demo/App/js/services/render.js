angular.module("mixTapeApp")
    .factory("renderService", ["graphicsEngineService", "globalSettings",
        function(graphicsEngineService, globalSettings) {
            "use strict";

            function drawStaff() {
                graphicsEngineService.drawStaff();
            }

            function addNote(x, y) {
                graphicsEngineService.addNote(x, y);
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
                graphicsEngineService.redraw();
            } 
            
            function addChords(chords) {
                graphicsEngineService.addChords(chords);
            }
            
            function clearChords() {
                graphicsEngineService.clearChords();
            }

            return {
                draw: function() {
                    drawStaff();
                    drawObjects();
                },
                addNote: function(x, y) {
                    addNote(x, y);
                },
                getObjects: function() {
                    getObjects();
                },
                clearObjects: function() {
                    clearObjects();
                    drawStaff();
                },
                addChords: function(chords) {
                    addChords(chords);
                },
                clearChords: function() {
                    clearChords();
                }
            }
        }]);
