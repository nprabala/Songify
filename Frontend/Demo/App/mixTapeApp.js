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
        $scope.noteGrid = {};
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


    $scope.drawNote = function(i,j){
        var col = $("." + "cell");
        col = col[(1/(globalSettings.noteRadius*2))*i + j];
        if(col.firstChild){
            col.removeChild(col.children[0]);
        }
        var note = this.generateNoteHTML(this.currentType);
        col.appendChild(note);

    };


    // TODO: Alter to draw a particular kind of note.
    $scope.generateNoteHTML = function(noteType){
        var namespace = "http://www.w3.org/2000/svg";
        var cx = "50%";
        var cy = "50%";
        r= "30%";
        var note = document.createElementNS(namespace, "circle");
        note.setAttributeNS(null, "cx", cx);
        note.setAttributeNS(null, "cy",cy);
        note.setAttributeNS(null, "r",r);
        if(noteType == "half"){
            note.setAttributeNS(null, "fill","none");
            note.setAttributeNS(null,"stroke","black");
        }


        return note;
    };

}])

    .directive("mixtapeApp", ["$interval", "renderService", "utilsService", "globalSettings", "songService",
        function($interval, renderService, utilsService, globalSettings, songService) {
        return {
            restrict: 'A',
            template: function(){
                var menu = '<img id="logo" src="App/img/logo.png"></img><div></div>' +
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
            '<div id="playbackController"><button id="playChoice" ng-click="choosePlayback()">Play</button></div>';
            var staff = '<div class="staff">';
            var noteWidthPercentage = (globalSettings.noteRadius*2)*100;
            var notePercentage = (globalSettings.lineHeight/2) *100;
            for (var i = 0; i < globalSettings.trebleStaff.length; i++){
                var line = "";
                if (i % 2 == 0 && i >= 2 && i < globalSettings.trebleStaff.length -1){
                    line = '<line x1="0%" y1="50%" x2="100%" y2="50%" style="stroke:rgb(0,0,0);stroke-width:2"/>';
                }
                staff += '<div class="row" style="height:' + String(notePercentage)+'%;">';
                for (var j = 0; j < 1/(globalSettings.noteRadius*2); j++){
                    var id = String(j);
                    staff += '<svg id="'+id+'" style="width:' + noteWidthPercentage + '%;"ng-click="drawNote('+i+','+j+')" class="cell"'+
                    '>' + line + '</svg>';

                }
                staff += '</div>';
            }
            staff += '</div>';
            return menu + staff;

            // '<div id="playbackController"><button id="" ng-click="playMelody()">Play Melody</button>' +
            // '<button id="playChords" ng-click="playChords()">Play Chords</button>' +
            // '<button id="playComplete" ng-click="playComplete()">Play Melody with Chords</button></div>' +

            },

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

                // renderService.initialise(element.find('canvas')[0]);
                // songService.initialise();

                // function canvasMouseClick(e) { renderService.addNote(e.x, e.y); }
                // function canvasResize(e) { renderService.canvasResize(); }
                // window.addEventListener('mousedown', canvasMouseClick);
                // window.addEventListener('resize', canvasResize, true);

                // renderService.draw();
            }
        }
    }]);





