angular.module("songifyApp", [])
.controller("songifyController", ["$scope", "utilsService", "renderService", "globalSettings", "songService",
function($scope, utilsService, renderService, globalSettings, songService) {

    /* Load variables/lists from global settings */
    $scope.pitchType = globalSettings.pitchType.NATURAL;
    $scope.bpm = globalSettings.bpm.SLOW;
    $scope.currentType = globalSettings.noteType.QUARTER;
    $scope.topMessage = globalSettings.TOP_MESSAGE;
    $scope.melodyStaff = globalSettings.MELODY_STAFF;
    $scope.pitchAlteration = Object.keys(globalSettings.pitchType).map(function(key) {
        return globalSettings.pitchType[key];
    });
    $scope.noteTypes = Object.keys(globalSettings.noteType).map(function(key) {
        return globalSettings.noteType[key];
    });
    $scope.bpmOptions = Object.keys(globalSettings.bpm).map(function(key) {
        return globalSettings.bpm[key];
    });

    /* Initialize services */
    songService.initialise(window.location.hostname);
    renderService.initialise(document.getElementById('scoreMelody'),
                             document.getElementById('scoreChords'));

    /* Method for handeling whether to play just melody or melody + chords */
    $scope.choosePlayback = function() {
        if (globalSettings.toggleView) {
            songService.playMelody($scope.bpm);
            songService.playChords($scope.bpm);
        }
        else {
            songService.playMelody($scope.bpm);
        }
    };

    /* Method for clearing melody, chords, and display */
    $scope.clear = function() {
        renderService.clearStaff(globalSettings.MELODY_STAFF);
        songService.clearSong();
    };

    /* Method for drawing note on display and adding to the melody */
    $scope.drawNote = function(i,j, staff){
        var staffElem = $("#" + staff)[0];
        var rows = staffElem.children
        var row = rows[i];
        var col = row.children[j];
        var noteHTML = renderService.generateNoteHTML(this.currentType, this.pitchType);
        var note = renderService.convertToNote(i, this.pitchType, this.currentType);

        if (staff == globalSettings.MELODY_STAFF){
            // clear any other note at this x location
            for (var k = 0; k < rows.length; k++){
                renderService.clearNote(rows[k].children[j],k);
            }

            if (this.currentType == globalSettings.noteType.CLEAR){
                songService.editMelody(j, globalSettings.EMPTY_NOTE);
            } else {
                songService.playNote(note['note']);
                songService.editMelody(j, note);
                col.appendChild(noteHTML);
            }

        }
    };
}])

.directive("songifyApp", ["$interval", "renderService", "utilsService", "globalSettings", "songService",
function($interval, renderService, utilsService, globalSettings, songService) {
    return {
        restrict: 'A',
        template: function(){
            var menu = '<img id="logo" src="App/img/logo.png"></img><div></div>' +
            '<div id="topMessage">{{topMessage}}' +
            ' Please leave any feedback <a href=' + globalSettings.FEEDBACK_LINK + ' target="_blank"> here</a>.</div>'+

            '<div id="noteSelection">Select note: ' +
            '<select ng-model="currentType" ng-options="x for x in noteTypes"></select>'+
            '<select ng-model="pitchType" ng-options="x for x in pitchAlteration"></select></div>'+

            '<div id="noteSelection">Select playback speed: ' +
            '<select ng-model="bpm" ng-options="x for x in bpmOptions"></select></div>'+

            '<div id="container">' +
            '<div class="inner-container">' +
            '<div class="toggle"><p>Melody + Chords</p></div><div class="toggle"><p>Melody Only</p></div>' +
            '</div>' + //inner-container

            '<div class="inner-container" id="toggle-container">' +
            '<div class="toggle"><p>Melody + Chords</p></div><div class="toggle"><p>Melody Only</p></div>' +
            '</div>' + //inner-container
            '</div>' + //container
            '<div id="playbackController">' +
                '<button id="clear" ng-click="clear()">Clear Staff</button>' +
                '<button id="playChoice" ng-click="choosePlayback()">Play</button>' +
            '</div>';

            var melodyStaff = renderService.generateStaff(globalSettings.MELODY_STAFF);
            var score = '<div id="score" hidden><div id="scoreMelody"></div><div id="scoreChords"></div></div>';
            var padding = '<div class="padding"></div>';
            return menu + melodyStaff + score + padding;
        },

        link: function(scope, element) {
            var toggle = document.getElementById('container');
            var toggleContainer = document.getElementById('toggle-container');
            var melodyStaff = document.getElementById(globalSettings.MELODY_STAFF);

            window.addEventListener("resize", () => {
                renderService.resizeScore(window.innerWidth);

                // only redraw if toggled for score
                if (globalSettings.toggleView) {
                    renderService.drawScore(songService.getMelody(), songService.getChords());
                }
            });

            /* if toggle set to melody + chords (i.e. score) */
            var toggleScore = function() {
                document.getElementById("playChoice").disabled = true;
                document.getElementById("clear").disabled = true;

                songService.requestChords(() => {
                    melodyStaff.hidden = true;
                    document.getElementById("score").hidden = false;
                    document.getElementById("playChoice").disabled = false;
                    renderService.drawScore(songService.getMelody(), songService.getChords());
                });

                toggleContainer.style.clipPath = 'inset(0 0 0 50%)';
                toggleContainer.style.backgroundColor = globalSettings.SCORE_TOGGLE_COLOR;
            };

            /* if toggle set to melody only (i.e. melody input) */
            var toggleMelodyInput = function() {
                document.getElementById("clear").disabled = false;
                document.getElementById("score").hidden = true;
                melodyStaff.hidden = false;

                toggleContainer.style.clipPath = 'inset(0 50% 0 0)';
                toggleContainer.style.backgroundColor = globalSettings.MELODY_TOGGLE_COLOR;
            }

            /* adjusting toggle*/
            toggle.addEventListener('click', function() {
                globalSettings.toggleView = !globalSettings.toggleView;
                if (globalSettings.toggleView) toggleScore();
                else toggleMelodyInput();
            });
        }
    }
}]);
