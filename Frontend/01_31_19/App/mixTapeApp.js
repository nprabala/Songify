angular.module("mixTapeApp", [])
    .controller("mixTapeController", ["$scope", "graphicsEngineService", "utilsService", "renderService", 
        function($scope,graphicsEngineService, utilsService, renderService) {
        $scope.hello = "Welcome To Mixtape";
        // $scope.getNote = function(event) {
        //     var lineHeight = graphicsEngineService.lineHeight;
        //     var staffHeight = graphicsEngineService.staffHeight;
        //     var canvasHeight = graphicsEngineService.canvas_height;
        //     var staffGap = graphicsEngineService.staffGap;
        //     return utilsService.getNote(event.originalEvent.screenY, lineHeight, staffHeight, canvasHeight, staffGap);
        // };
    }])

    .directive("mixtapeApp", ["$interval", "renderService", "graphicsEngineService", "utilsService", "globalSettings",
        function($interval, renderService, graphicsEngineService, utilsService, globalSettings) {
        return {
            restrict: 'A',
            template: '<audio id="B4"><source src="App/aud/B4.wav" type="audio/wav"></audio>' + 
            '<button id="clear">Clear</button>' + 
            '<button id="melody">Get Melody</button>' + 
            '<button id="playback">Play Melody</button>' + 
            '<div id="debug">Debug state: Ready</div>' + 
            '<canvas id="musicCanvas"></canvas>',

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
                    document.getElementById("debug").innerHTML = "Debug state: Cleared";
                };

                var melodyBtn = document.getElementById("melody");
                melodyBtn.onclick = function() {
                    var melody = utilsService.getMelody();
                    document.getElementById("debug").innerHTML = "Melody: " + melody;
                };

                // TODO: need to fix
                var audioBtn = document.getElementById("playback");
                audioBtn.onclick = function() {
                    var melody = utilsService.getMelody();
                    var note;
                    var audio;
                    document.getElementById("debug").innerHTML = "Playing: " + melody;
                    for (var i = 0; i < melody.length; i++) {
                        note = melody[i];
                        audio = new Audio("App/aud/" + note + ".wav");
                        window.setTimeout(function () {
                            audio.play();
                        }, 1000);
                    }
                };

                graphicsEngineService.initialise(canvasContext, [], []);

                function canvasMouseClick(e) {
                    renderService.addNote(
                        (e.x / 2) - (globalSettings.noteOffsetX * canvas.width * globalSettings.noteRadius), 
                        (e.y / 2) - (globalSettings.noteOffsetY * canvas.height * globalSettings.noteRadius));    
                }

                function canvasResize(e) {
                    var canvasObjs = graphicsEngineService.getObjects();
                    var canvasLocs = graphicsEngineService.getLocations();
                    var width = window.innerWidth;
                    var height = window.innerHeight;
                    canvas.width = width;
                    canvas.height = height;
                    canvas.style.width = width;
                    canvas.style.height = height;
                    graphicsEngineService.initialise(canvasContext, canvasObjs, canvasLocs);
                    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
                    renderService.draw();
                }

                window.addEventListener('mousedown', canvasMouseClick);
                window.addEventListener('resize', canvasResize, true);

                renderService.draw();
            }
        }
    }]);
