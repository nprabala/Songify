angular.module("mixTapeApp", [])
    .controller("mixTapeController", ["$scope", "graphicsEngineService", "utilsService", "renderService", "globalSettings",
        function($scope,graphicsEngineService, utilsService, renderService, globalSettings) {
        $scope.hello = "Welcome To Mixtape";
        var url = window.location;
        var hostName = url.hostname;
        //Sample JSON to send. Will format notes object later.
        $scope.noteTypes = ["sixteenth","eighth","quarter","half","whole"];
        $scope.currentType = "quarter";
        $scope.chords = [];
        $scope.melody = [];
        $scope.melodySounds = [];
        $scope.chordSounds = [];
        $scope.melodyDurations = [];
        $scope.chordDurations = [];

    getMelody = function() {
        var melody = utilsService.getMelody();
        $scope.melodySounds = [];
        for (var i = 0; i < melody.length; i++) {
            var note = utilsService.cleanNote(melody[i]);
            var file = 'App/aud/' + melody[i] + '.wav';
            var howl = new Howl({ src: [file], volume: 0.4});
            $scope.melodySounds.push(howl);
        }

        $scope.melody = melody;
        $scope.melodyDurations = graphicsEngineService.durations;
    }

    getChords = function(chords) {
        $scope.chordSounds = [];
        $scope.chordDurations = [];
        renderService.clearChords();
        for (var i = 0; i < chords.length; i++) {
            var unsplitChord = chords[i]["chord"];
            var duration = chords[i]["duration"];
            var splitChord = unsplitChord.split(".");

            var chordObj = [];
            for (var j = 0; j < splitChord.length; j++) {
                var note = utilsService.cleanNote(splitChord[j] + '4');
                var file = 'App/aud/' + note + '.wav';
                var howl = new Howl({ src: [file], volume: 0.4});
                chordObj.push(howl);
            }

            $scope.chordSounds.push(chordObj);
            $scope.chordDurations.push(duration);
        }

        $scope.chords = chords;
        renderService.addChords($scope.chords);
    };

    $scope.playMelody = function() {
        getMelody();
        utilsService.playSequence($scope.melodySounds, $scope.melodyDurations, false);
    };

    $scope.playChords = async function(){
        getMelody();
        utilsService.requestChords($scope.melody, hostName, getChords);
        await utilsService.sleep(500);

        utilsService.playSequence($scope.chordSounds, $scope.chordDurations, true);
    };

    $scope.playComplete = async function() {
        getMelody();
        utilsService.requestChords($scope.melody, hostName, getChords);
        await utilsService.sleep(500);

        utilsService.playSequence($scope.melodySounds, $scope.melodyDurations, false);
        utilsService.playSequence($scope.chordSounds, $scope.chordDurations, true);
    };

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
            '<button id="" ng-click="playMelody()">Play Melody</button>' +
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

                graphicsEngineService.initialise(canvasContext, [], [], [], [],[], "quarter");

                function canvasMouseClick(e) {

                    renderService.addNote(
                        (e.x / 2) - (globalSettings.noteOffsetX * canvas.width * globalSettings.noteRadius),
                        (e.y / 2) - (globalSettings.noteOffsetY * canvas.height * globalSettings.noteRadius));
                }

                function canvasResize(e) {
                    var canvasObjs = graphicsEngineService.getObjects();
                    var canvasLocs = graphicsEngineService.getLocations();
                    var canvasChords = graphicsEngineService.getChords();
                    var canvasChordLocations = graphicsEngineService.getChordLocations();
                    var durs = graphicsEngineService.durations;
                    var curType = graphicsEngineService.currentType;
                    var width = window.innerWidth;
                    var height = window.innerHeight;
                    canvas.width = width;
                    canvas.height = height;
                    canvas.style.width = width;
                    canvas.style.height = height;
                    graphicsEngineService.initialise(canvasContext, canvasObjs, canvasLocs, canvasChords, canvasChordLocations, durs, curType);
                    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
                    renderService.draw();
                }

                window.addEventListener('mousedown', canvasMouseClick);
                window.addEventListener('resize', canvasResize, true);

                renderService.draw();
            }
        }
    }]);
