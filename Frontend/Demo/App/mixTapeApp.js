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

    $scope.getMelody = function() {
        var objs = graphicsEngineService.getObjects();
        var locs = graphicsEngineService.getLocations();
        var width = graphicsEngineService.getCanvasWidth();
        var height = graphicsEngineService.getCanvasHeight();
        var yOffset = (graphicsEngineService.getYOffset(0) / 2).toFixed(2);
        var lineSpacing = graphicsEngineService.getLineSpacing();
        var melody = [];
        var result = "";
        for (var i = 0; i < locs.length; i++) {
            var diff = yOffset - (locs[i][1] * height).toFixed(2);
            diff = Math.round(diff / lineSpacing);
            if (diff >= -8 && diff <= 3) {
                melody.push([globalSettings.trebleStaff[(diff * -1) + 3]]);
            }
        }

        $scope.melodySounds = [];
        for (var i = 0; i < melody.length; i++) {
            // TODO: can't have # in name, possible better solution
            if (melody[i][1] == '#') {
                melody[i] = melody[i][0] + 'S' + melody[2];
            }
            var file = 'App/aud/' + melody[i] + '.wav';
            var howl = new Howl({ src: [file], volume: 0.4});
            $scope.melodySounds.push(howl);
        }

        $scope.melody = melody;
        $scope.melodyDurations = graphicsEngineService.durations;
    }

    $scope.getChords = function(callback) {
        $scope.getMelody();

        var notes = $scope.melody;
        var durations = graphicsEngineService.durations;
        var melody = [];

        for (var i = 0; i < notes.length; i++){
            melody.push({"note":notes[i][0].charAt(0), "duration":durations[i]})
        }

        var req = new XMLHttpRequest();
        req.open("POST","http://" + hostName + ":8081/chord_progressions");
        req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        req.onreadystatechange = function() {
            var chords = JSON.parse(req.response);
            console.log(chords);

            $scope.chordSounds = [];
            $scope.chordDurations = [];
            renderService.clearChords();
            for (var i = 0; i < chords.length; i++) {
                var unsplitChord = chords[i]["chord"];
                var duration = chords[i]["duration"];
                var splitChord = unsplitChord.split(".");

                var chordObj = [];
                for (var j = 0; j < splitChord.length; j++) {
                    // TODO: can't have # in name, possible better solution
                    if (splitChord[j][1] == '#') {
                        splitChord[j] = splitChord[j][0] + 'S'
                    }
                    var file = 'App/aud/' + splitChord[j] + '4' + '.wav';
                    var howl = new Howl({ src: [file], volume: 0.4});
                    chordObj.push(howl);
                }

                $scope.chordSounds.push(chordObj);
                $scope.chordDurations.push(duration);
            }

            $scope.chords = chords;
            renderService.addChords($scope.chords);
            callback();
        };

        req.send(JSON.stringify(melody));
    };
    
    $scope.sleep = function(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    };

    $scope.playSequence = async function(sequence, durations, isChord) {

        if (isChord) {
            for (var i = 0; i < sequence.length; i++) {
                for (var j = 0; j < sequence[i].length; j++) {
                    sequence[i][j].play();
                }

                await $scope.sleep(durations[i] * 1000);
            }
        } else {
            for (var i = 0; i < sequence.length; i++) {
                sequence[i].play();
                await $scope.sleep(durations[i]*1000);
            }
        }
    }

    $scope.playMelody = function() {
        $scope.getMelody();
        $scope.playSequence($scope.melodySounds, $scope.melodyDurations, false);
    };

    $scope.playChords = function(){
        var callback = async function() { 
            await $scope.sleep(500); // TODO: keep until find better solution
            $scope.playSequence($scope.chordSounds, $scope.chordDurations, true); 
        };
        $scope.getChords(callback);
    };

    $scope.playComplete = function() {
        $scope.getMelody();
        var callback = async function() {
            await $scope.sleep(500); // TODO: keep until find better solution
            $scope.playSequence($scope.melodySounds, $scope.melodyDurations, false);
            $scope.playSequence($scope.chordSounds, $scope.chordDurations, true);
        }
        $scope.getChords(callback);
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
