angular.module("mixTapeApp", [])
.controller("mixTapeController", ["$scope", "utilsService", "renderService", "globalSettings", "songService", "scoreService",
function($scope, utilsService, renderService, globalSettings, songService, scoreService) {
    $scope.hello = "Welcome To Mixtape";
    var url = window.location;
    var hostName = url.hostname;
    utilsService.setHostname(hostName);
    songService.initialise();
    scoreService.initialise();

    $scope.noteTypes = ["sixteenth","eighth","quarter","half","whole", "clear"];
    $scope.pitchAlteration = ["Sharp","Flat","Natural"]
    $scope.pitchType = "Natural";
    $scope.currentType = "quarter";
    $scope.topMessage = "Welcome to Mixtape! Click anywhere on the top staff to create your melody, then select 'Get Chords' to generate the accompaniment.";
    $scope.melodyStaff = "melody";
    $scope.chordStaff = "chords";

    $scope.playMelody = function() {
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
        songService.playMelody();
        songService.playChords();
    };

    $scope.clear = function() {
        console.log("CLEARING");
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

            if (this.currentType == "clear"){
                songService.editMelody(j, "Empty");
                songService.updateMelody();
            } else {
                songService.editMelody(j, note);
                songService.updateMelody();
            }
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

.directive("mixtapeApp", ["$interval", "renderService", "utilsService", "globalSettings", "songService", "scoreService",
function($interval, renderService, utilsService, globalSettings, songService, scoreService) {
    return {
        restrict: 'A',
        template: function(){
            var menu = '<img id="logo" src="App/img/logo.png"></img><div></div>' +
            '<div id="topMessage">{{topMessage}}</div>' +

            '<div id="noteSelection">Current note (click to add to staff): ' +
            '<select ng-model="currentType" ng-options="x for x in noteTypes" ng-change="updateNoteType()"></select>'+
            '<select ng-model="pitchType" ng-options="x for x in pitchAlteration" ng-change="updatePitchType()"></select></div>'+
            '<div id="staffController"><button id="clear" ng-click="clear()">Clear Staff</button></div>' +

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
            var score = '<div id="score" hidden><div id="scoreMelody"></div><div id="scoreChords"></div></div>';
            var padding = '<div class="padding"></div>';
            return menu + melodyStaff + score + padding;

        },

        link: function(scope, element) {
            var toggle = document.getElementById('container');
            var toggleContainer = document.getElementById('toggle-container');

            window.addEventListener("resize", () => {
                scoreService.resizeDisplay(window.innerWidth);
                scoreService.drawScore(songService.getMelody(), songService.getChords())
            });

            toggle.addEventListener('click', function() {
                globalSettings.toggleNumber = !globalSettings.toggleNumber;
                if (globalSettings.toggleNumber) {

                    document.getElementById("playChoice").enabled = false;
                    document.getElementById("clear").disabled = true;
                    songService.requestChords(() => {
                        document.getElementById("melody").hidden = true;
                        document.getElementById("score").hidden = false;
                        document.getElementById("playChoice").enabled = true;
                        scoreService.drawScore(songService.getMelody(), songService.getChords());
                    });

                    toggleContainer.style.clipPath = 'inset(0 0 0 50%)';
                    toggleContainer.style.backgroundColor = '#D74046';
                } else {
                    document.getElementById("clear").disabled = false;
                    document.getElementById("score").hidden = true;
                    document.getElementById("melody").hidden = false;

                    toggleContainer.style.clipPath = 'inset(0 50% 0 0)';
                    toggleContainer.style.backgroundColor = 'dodgerblue';
                }
            });
        }
    }
}]);
