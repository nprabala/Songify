angular.module("mixTapeApp", [])
.controller("mixTapeController", ["$scope", "utilsService", "renderService", "globalSettings", "songService",
    function($scope, utilsService, renderService, globalSettings, songService) {
        $scope.hello = "Welcome To Mixtape";
        var url = window.location;
        var hostName = url.hostname;
        utilsService.setHostname(hostName);
        songService.initialise();

        $scope.noteTypes = ["sixteenth","eighth","quarter","half","whole", "clear"];
        $scope.pitchAlteration = ["Sharp","Flat","Natural"]
        $scope.pitchType = "Natural";
        $scope.currentType = "quarter";
        $scope.topMessage = "Welcome to Mixtape! Click anywhere on the top staff to create your melody, then select 'Get Chords' to generate the accompaniment.";
        $scope.noteGrid = [];
        $scope.chordGrid = [];
        $scope.melodyStaff = "melody";
        $scope.chordStaff = "chords";

        for(var i = 0; i < 1/(globalSettings.noteRadius*2); i++){
            $scope.noteGrid.push("Empty");
        }

        $scope.updateMelody = function(){
            var compiledMelody = [];
            var compiledDurations = [];
            for (var j = 0; j < this.noteGrid.length; j++){
                if (this.noteGrid[j] != "Empty"){
                    compiledMelody.push(this.noteGrid[j]["note"]);
                    compiledDurations.push(this.noteGrid[j]["duration"])
                }
            }
            songService.updateMelody(compiledMelody, compiledDurations);
        }

        $scope.playMelody = function() {
            this.updateMelody();
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
            this.updateMelody();
            songService.playMelody();
            songService.playChords();
        };

        $scope.loadChords = function() {
            this.updateMelody();
            songService.updateChords();
            // TODO: Flesh out drawing chords on the staff element.
            // $scope.chords = songService.chords;
            // $scope.drawChords();
        };

        $scope.clear = function() {
            console.log("CLEARING");
            for(var i = 0; i < 1/(globalSettings.noteRadius*2); i++){
                $scope.noteGrid[i] = "Empty";
            }
            utilsService.clearStaff("melody");
            utilsService.clearStaff("chord");
            songService.clearSong();
        };

        $scope.updateNoteType = function(){
          globalSettings.currentType = $scope.currentType;
      };

      $scope.updatePitchType = function(){
          globalSettings.pitchType = $scope.pitchType;
      };


      $scope.drawNote = function(i,j, staff){
        var staffElem = $("#" + staff)[0];
        var rows = staffElem.children
        var row = rows[i];
        var col = row.children[j];
        var noteHTML = utilsService.generateNoteHTML(this.currentType);
        var note = utilsService.convertToNote(i);
        if (staff == "melody"){
            for (var k = 0; k < rows.length; k++){
                utilsService.clearNote(rows[k].children[j],k);
            }
            if(this.currentType == "clear"){
                this.noteGrid[j] = "Empty";
                return;
            }
            this.noteGrid[j] = note;
        }
        else{
            // TODO: Enable editing of chords.
            // utilsService.clearNote(col,i);
            // if(this.currentType == "clear"){
            //     // TODO: Handle weird case when chord contains two of same note.
            //     this.chordGrid[j].remove(note["note"]);
            //     return;
            // }

        }
        col.appendChild(noteHTML);

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
            var melodyStaff = utilsService.generateStaff("melody");
            var chordStaff = utilsService.generateStaff("chord");
            var padding = '<div class="padding"></div>';
            return menu + melodyStaff + padding + chordStaff;

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
        }
    }
}]);





