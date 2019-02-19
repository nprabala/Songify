angular.module("mixTapeApp", [])
    .controller("mixTapeController", ["$scope", "graphicsEngineService", "utilsService", "renderService", "globalSettings", "soundService", "songService",
        function($scope,graphicsEngineService, utilsService, renderService, globalSettings, soundService, songService) {
        $scope.hello = "Welcome To Mixtape";
        var url = window.location;
        var hostName = url.hostname;
        utilsService.setHostname(hostName);
        //Sample JSON to send. Will format notes object later.
        $scope.noteTypes = ["sixteenth","eighth","quarter","half","whole"];
        $scope.pitchAlteration = ["Sharp","Flat","Natural"]
        $scope.pitchType = "Natural";
        $scope.currentType = "quarter";
        $scope.topMessage = "Welcome to Mixtape! Click anywhere on the top staff to create your melody, then select 'Get Chords' to generate the accompaniment.";

    $scope.playMelody = function() {
        songService.updateMelody();
        songService.playMelody();
    };
    
    $scope.choosePlayback = function() {
        if (globalSettings.toggleNumber) {
            $scope.playComplete();
        }
        else {
            $scope.playMelody();
        }
    };

    $scope.playChords = async function(){
        songService.playChords();
    };

    $scope.playComplete = async function() {
        songService.updateMelody();
        songService.playMelody();
        songService.playChords();
    };

    $scope.loadChords = function() {
        songService.updateMelody();
        songService.updateChords();
    }

    $scope.updateNoteType = function(){
      globalSettings.currentType = $scope.currentType;
    };

    $scope.updatePitchType = function(){
      globalSettings.pitchType = $scope.pitchType;
    };

}])

    .directive("mixtapeApp", ["$interval", "renderService", "graphicsEngineService", "utilsService", "globalSettings", "soundService", "songService",
        function($interval, renderService, graphicsEngineService, utilsService, globalSettings, soundService, songService) {
        return {
            restrict: 'A',
            template: '<img id="logo" src="App/img/logo.png"></img><div></div>' +
            '<div id="topMessage">{{topMessage}}</div>' +
            '<div id="noteSelection">Current note (click to add to staff): ' +
            '<select ng-model="currentType" ng-options="x for x in noteTypes" ng-change="updateNoteType()"></select>'+
            '<select ng-model="pitchType" ng-options="x for x in pitchAlteration" ng-change="updatePitchType()"></select></div>'+
            '<div id="staffController"><button id="clear">Clear Staff</button>' +
            '<button id="" ng-click="loadChords()">Get Chords</button></div>' +
            
            '<div id="container">' +
                '<div class="inner-container">' + 
                    '<div class="toggle"><p>Melody + Chords</p></div><div class="toggle"><p>Melody Only</p></div>' + 
                '</div>' + //inner-container
    	        
    	        '<div class="inner-container" id="toggle-container">' + 
        	        '<div class="toggle"><p>Melody + Chords</p></div><div class="toggle"><p>Melody Only</p></div>' + 
    		    '</div>' + //inner-container
		    '</div>' + //container
		    
		    '<div id="playbackController"><button id="playChoice" ng-click="choosePlayback()">Play</button></div>' +
            
            // '<div id="playbackController"><button id="" ng-click="playMelody()">Play Melody</button>' +
            // '<button id="playChords" ng-click="playChords()">Play Chords</button>' +
            // '<button id="playComplete" ng-click="playComplete()">Play Melody with Chords</button></div>' +
            '<canvas id="musicCanvas"></canvas>',

            link: function(scope, element) {
                var toggle = document.getElementById('container');
                var toggleContainer = document.getElementById('toggle-container');

                toggle.addEventListener('click', function() {
                	globalSettings.toggleNumber = !globalSettings.toggleNumber;
                	if (globalSettings.toggleNumber) {
                		toggleContainer.style.clipPath = 'inset(0 0 0 50%)';
                		toggleContainer.style.backgroundColor = '#D74046';
                	} else {
                		toggleContainer.style.clipPath = 'inset(0 50% 0 0)';
                		toggleContainer.style.backgroundColor = 'dodgerblue';
                	}
                });
                
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
                    songService.clearSong();
                };

                graphicsEngineService.initialise(canvasContext, [], [], [], [],[]);
                songService.initialise(utilsService.getHostname());

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
                    var width = window.innerWidth;
                    var height = window.innerHeight;
                    canvas.width = width;
                    canvas.height = height;
                    canvas.style.width = width;
                    canvas.style.height = height;
                    graphicsEngineService.initialise(canvasContext, canvasObjs, canvasLocs, canvasChords, canvasChordLocations, durs);
                    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
                    renderService.draw();
                }

                window.addEventListener('mousedown', canvasMouseClick);
                window.addEventListener('resize', canvasResize, true);

                renderService.draw();
            }
        }
    }]);
