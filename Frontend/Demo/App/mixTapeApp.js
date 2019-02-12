angular.module("mixTapeApp", [])
    .controller("mixTapeController", ["$scope", "graphicsEngineService", "utilsService", "renderService",
        function($scope,graphicsEngineService, utilsService, renderService) {
        $scope.hello = "Welcome To Mixtape";
        var url = window.location;
        var hostName = url.hostname;
        //Sample JSON to send. Will format notes object later.
        $scope.noteTypes = ["sixteenth","eighth","quarter","half","whole"];
        $scope.currentType = "quarter";
        $scope.chords = [];

    $scope.sendMelody = function() {
        var notes = utilsService.getMelody();
        var durations = graphicsEngineService.durations;
        var melody = [];
        document.getElementById("debug").innerHTML = "Chords retrieved!";
        for (var i = 0; i < notes.length; i++){
            melody.push({"note":notes[i][0].charAt(0), "duration":durations[i]})
        }
        var req = new XMLHttpRequest();
        req.open("POST","http://" + hostName + ":8081/chord_progressions");
        req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        req.send(JSON.stringify(melody));
        req.onreadystatechange = function() {
        // Typical action to be performed when the document is ready:
            $scope.chords = JSON.parse(req.response);
            console.log($scope.chords);
        };
    };

    $scope.playChords = function(){
        utilsService.playSequence($scope.chords, true);
    };

    $scope.playComplete = function() {
        utilsService.playSequence($scope.chords, true);
        utilsService.playSequence(utilsService.getMelody(), false);
    }

    $scope.updateGraphics = function(){
      graphicsEngineService.currentType = $scope.currentType;
    };
}])

    .directive("mixtapeApp", ["$interval", "renderService", "graphicsEngineService", "utilsService", "globalSettings",
        function($interval, renderService, graphicsEngineService, utilsService, globalSettings) {
        return {
            restrict: 'A',
            template: '<div id="debug">Welcome to Mixtape!</div>' +
            '<button id="clear">Clear</button>' +
            '<button id="playback">Play Melody</button>' +
            '<button id="" ng-click="sendMelody()">Retrieve Chords</button>' +
            '<button id="" ng-click="playChords()">Play Chords</button>' +
            '<button id="" ng-click="playComplete()">Play with Chords</button>' +
            '<select ng-model="currentType" ng-options="x for x in noteTypes" ng-change="updateGraphics()"></select>'+
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
                    document.getElementById("debug").innerHTML = "Notes cleared!";
                };

                var audioBtn = document.getElementById("playback");
                audioBtn.onclick = function() {
                    var melody = utilsService.getMelody();
                    document.getElementById("debug").innerHTML = "Playing: " + melody;
                    utilsService.playSequence(melody, false);
                };

                graphicsEngineService.initialise(canvasContext, [], [],[], "quarter");

                function canvasMouseClick(e) {

                    renderService.addNote(
                        (e.x / 2) - (globalSettings.noteOffsetX * canvas.width * globalSettings.noteRadius),
                        (e.y / 2) - (globalSettings.noteOffsetY * canvas.height * globalSettings.noteRadius));
                }

                function canvasResize(e) {
                    var canvasObjs = graphicsEngineService.getObjects();
                    var canvasLocs = graphicsEngineService.getLocations();
                    var durs = graphicsEngineService.durations;
                    var curType = graphicsEngineService.currentType;
                    var width = window.innerWidth;
                    var height = window.innerHeight;
                    canvas.width = width;
                    canvas.height = height;
                    canvas.style.width = width;
                    canvas.style.height = height;
                    graphicsEngineService.initialise(canvasContext, canvasObjs, canvasLocs, durs, curType);
                    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
                    renderService.draw();
                }

                window.addEventListener('mousedown', canvasMouseClick);
                window.addEventListener('resize', canvasResize, true);

                renderService.draw();
            }
        }
    }]);
