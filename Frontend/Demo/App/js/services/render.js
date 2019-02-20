angular.module("mixTapeApp")
    .factory("renderService", ["graphicsEngineService", "globalSettings", "utilsService",
        function(graphicsEngineService, globalSettings, utilsService) {
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
                readMelody: function() {
                    return graphicsEngineService.readMelody();
                },

                readMelodyDurations: function() {
                    return graphicsEngineService.getMelodyDurations();
                },

                canvasResize: function() {
                    var canvasObjs = graphicsEngineService.getObjects();
                    var canvasLocs = graphicsEngineService.getLocations();
                    var canvasChords = graphicsEngineService.getChords();
                    var canvasChordLocations = graphicsEngineService.getChordLocations();
                    var durs = graphicsEngineService.durations;

                    var width = window.innerWidth;
                    var height = window.innerHeight;
                    this.canvas.width = width;
                    this.canvas.height = height;
                    this.canvas.style.width = width;
                    this.canvas.style.height = height;

                    graphicsEngineService.initialise(this.canvasContext, canvasObjs, canvasLocs, canvasChords, canvasChordLocations, durs);
                    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    graphicsEngineService.drawStaff();
                    graphicsEngineService.redraw();
                },

                initialise: function(canvas) {
                    this.canvas = canvas;
                    this.canvasContext = this.canvas.getContext("2d");

                    this.canvasContext.scale(1,1);
                    this.canvas.width = window.innerWidth;
                    this.canvas.height = window.innerHeight;
                    this.canvas.style.width = canvas.width;
                    this.canvas.style.height = canvas.height;

                    graphicsEngineService.initialise(this.canvasContext, [], [], [], [],[]);
                },

                draw: function() {
                    drawStaff();
                    drawObjects();
                },
                addNote: function(x, y) {
                    addNote((x / 2) - (globalSettings.noteOffsetX * this.canvas.width * globalSettings.noteRadius),
                            (y / 2) - (globalSettings.noteOffsetY * this.canvas.height * globalSettings.noteRadius));
                },
                getObjects: function() {
                    getObjects();
                },
                clearObjects: function() {
                    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

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
