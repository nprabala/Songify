angular.module("mixTapeApp", [])
.controller("mixTapeController", ["$scope", "utilsService", "renderService", "globalSettings", "songService",
function($scope, utilsService, renderService, globalSettings, songService) {
    $scope.hello = globalSettings.HELLO_MESSAGE;
    $scope.pitchType = globalSettings.notePitchMod.NATURAL;
    $scope.currentType = globalSettings.noteType.QUARTER;
    $scope.topMessage = globalSettings.TOP_MESSAGE;
    $scope.melodyStaff = "melody";

    $scope.pitchAlteration = Object.keys(globalSettings.notePitchMod).map(function(key) {
        return globalSettings.notePitchMod[key];
    });

    $scope.noteTypes = Object.keys(globalSettings.noteType).map(function(key) {
        return globalSettings.noteType[key];
    });

    songService.initialise(window.location.hostname);
    renderService.initialise(document.getElementById('scoreMelody'),
                             document.getElementById('scoreChords'));

    $scope.playMelody = function() {
        songService.playMelody();
    };

    $scope.choosePlayback = function() {
        if (globalSettings.TOGGLE_VIEW) {
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
        renderService.clearStaff("melody");
        songService.clearSong();
    };


    $scope.drawNote = function(i,j, staff){
        var staffElem = $("#" + staff)[0];
        var rows = staffElem.children
        var row = rows[i];
        var col = row.children[j];
        var noteHTML = renderService.generateNoteHTML(this.currentType);
        var note = renderService.convertToNote(i, this.pitchType, this.currentType);

        if (staff == "melody"){
            for (var k = 0; k < rows.length; k++){
                renderService.clearNote(rows[k].children[j],k);
            }

            if (this.currentType == globalSettings.clearNote){
                songService.editMelody(j, globalSettings.EMPTY_NOTE);
                songService.updateMelody();
            } else {
                songService.editMelody(j, note);
                songService.updateMelody();
                col.appendChild(noteHTML);
            }
        }
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
            '<select ng-model="currentType" ng-options="x for x in noteTypes"></select>'+
            '<select ng-model="pitchType" ng-options="x for x in pitchAlteration"></select></div>'+
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

            var melodyStaff = renderService.generateStaff("melody");
            var score = '<div id="score" hidden><div id="scoreMelody"></div><div id="scoreChords"></div></div>';
            var padding = '<div class="padding"></div>';
            return menu + melodyStaff + score + padding;

        },

        link: function(scope, element) {
            var toggle = document.getElementById('container');
            var toggleContainer = document.getElementById('toggle-container');

            window.addEventListener("resize", () => {
                renderService.resizeScore(window.innerWidth);

                // only redraw if toggled for score
                if (globalSettings.TOGGLE_VIEW) {
                    renderService.drawScore(songService.getMelody(), songService.getChords());
                }
            });

            var toggleScore = function() {
                document.getElementById("playChoice").disabled = true;
                document.getElementById("clear").disabled = true;

                songService.requestChords(() => {
                    document.getElementById("melody").hidden = true;
                    document.getElementById("score").hidden = false;
                    document.getElementById("playChoice").disabled = false;
                    renderService.drawScore(songService.getMelody(), songService.getChords());
                });

                toggleContainer.style.clipPath = 'inset(0 0 0 50%)';
                toggleContainer.style.backgroundColor = '#D74046';
            };

            var toggleMelodyInput = function() {
                document.getElementById("clear").disabled = false;
                document.getElementById("score").hidden = true;
                document.getElementById("melody").hidden = false;

                toggleContainer.style.clipPath = 'inset(0 50% 0 0)';
                toggleContainer.style.backgroundColor = 'dodgerblue';
            }

            toggle.addEventListener('click', function() {
                globalSettings.TOGGLE_VIEW = !globalSettings.TOGGLE_VIEW;
                if (globalSettings.TOGGLE_VIEW) toggleScore();
                else toggleMelodyInput();
            });
        }
    }
}]);
