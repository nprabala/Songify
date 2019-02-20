angular.module("mixTapeApp", [])
    .controller("mixTapeController", ["$scope", "utilsService", "renderService", "globalSettings", "songService",
        function($scope, utilsService, renderService, globalSettings, songService) {
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
        songService.updateMelody(renderService.readMelody(), renderService.readMelodyDurations());
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
        songService.updateMelody(renderService.readMelody(), renderService.readMelodyDurations());
        songService.playMelody();
        songService.playChords();
    };

    $scope.loadChords = function() {
        songService.updateMelody(renderService.readMelody(), renderService.readMelodyDurations());
        songService.updateChords();
    };

    $scope.clear = function() {
        renderService.clearObjects();
        songService.clearSong();
    };

    $scope.updateNoteType = function(){
      globalSettings.currentType = $scope.currentType;
    };

    $scope.updatePitchType = function(){
      globalSettings.pitchType = $scope.pitchType;
    };

}])

    .directive("mixtapeApp", ["$interval", "renderService", "utilsService", "globalSettings", "songService",
        function($interval, renderService, utilsService, globalSettingss, songService) {
        return {
            restrict: 'A',
            template: '<img id="logo" src="App/img/logo.png"></img><div></div>' +
            '<div id="topMessage">{{topMessage}}</div>' +
            '<div id="noteSelection">Current note (click to add to staff): ' +
            '<select ng-model="currentType" ng-options="x for x in noteTypes" ng-change="updateNoteType()"></select>'+
            '<select ng-model="pitchType" ng-options="x for x in pitchAlteration" ng-change="updatePitchType()"></select></div>'+
            '<div id="staffController"><button id="clear" ng-click="clear()">Clear Staff</button>' +
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

                renderService.initialise(element.find('canvas')[0]);
                songService.initialise();

                function canvasMouseClick(e) { renderService.addNote(e.x, e.y); }
                function canvasResize(e) { renderService.canvasResize(); }
                window.addEventListener('mousedown', canvasMouseClick);
                window.addEventListener('resize', canvasResize, true);

                renderService.draw();
            }
        }
    }]);
