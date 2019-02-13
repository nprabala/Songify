angular.module("mixTapeApp")
    .factory("utilsService", ["globalSettings", "graphicsEngineService",
        function(globalSettings, graphicsEngineService) {
    	"use strict"
        return {
            getMelody: function() {
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
                        var pitchType = globalSettings.pitchAlterations[i];
                        var pitchFileMod = "";
                        if (pitchType == "Sharp"){
                            pitchFileMod = "#";
                        }
                        if(pitchType == "Flat"){
                            pitchFileMod = "-";
                        }
                        var pitch = globalSettings.trebleStaff[(diff * -1) + 3];
                        var fileString = this.flatSharpExceptions(pitch,pitchFileMod);
                        melody.push(fileString);
                    }
                }
                return melody;
            },

            requestChords: function(notes, hostName, callback) {
                var durations = graphicsEngineService.durations;
                var melody = [];

                for (var i = 0; i < notes.length; i++){
                    melody.push({"note":notes[i].charAt(0), "duration":durations[i]})
                }

                var req = new XMLHttpRequest();
                req.open("POST","http://" + hostName + ":8081/chord_progressions");
                req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                req.onreadystatechange = function() {
                    var chords = JSON.parse(req.response);
                    console.log(chords);
                    callback(chords);
                }
                req.send(JSON.stringify(melody));
            },

            sleep: function(milliseconds) {
                return new Promise(resolve => setTimeout(resolve, milliseconds))
            },

            cleanNote: function(note) {
                if (note.substr(1,1) == '#') {
                    return note.substr(0,1) + 'S' + note.substr(2,2);
                } else {
                    return note;
                }
            },

            playSequence: async function(sequence, durations, isChord) {
                if (isChord) {
                    for (var i = 0; i < sequence.length; i++) {
                        for (var j = 0; j < sequence[i].length; j++) {
                            sequence[i][j].play();
                        }

                        await this.sleep(durations[i] * 1000);
                        for (var j = 0; j < sequence[i].length; j++) {
                            sequence[i][j].stop();
                        }
                    }
                } else {
                    for (var i = 0; i < sequence.length; i++) {
                        sequence[i].play();
                        await this.sleep(durations[i]*1000);
                        sequence[i].stop();
                    }
                }
            },
            // Checks for all the flat sharp combos that really mean something else.
            flatSharpExceptions: function (pitch, pitchFileMod){
                if (pitch.substr(0,1) == "A" && pitchFileMod == "-"){
                    return "G" + "#" + pitch.substr(1,1);
                }
                if (pitch.substr(0,1) == "A" && pitchFileMod == "#"){
                    return "B" + "-" + pitch.substr(1,1);
                }
                if (pitch.substr(0,1) == "B" && pitchFileMod == "#"){
                    return "C" + pitch.substr(1,1);
                }
                if (pitch.substr(0,1) == "D" && pitchFileMod == "-"){
                    return "C" + "#" + pitch.substr(1,1);
                }
                if (pitch.substr(0,1) == "D" && pitchFileMod == "#"){
                    return "E" + "-" + pitch.substr(1,1);
                }
                if (pitch.substr(0,1) == "C" && pitchFileMod == "-"){
                    return "B" + (parseInt(pitch.substr(1,1)) - 1).toString();
                }
                if (pitch.substr(0,1) == "E" && pitchFileMod == "#"){
                    return "F" + pitch.substr(1,1);
                }
                if (pitch.substr(0,1) == "F" && pitchFileMod == "-"){
                    return "E" + pitch.substr(1,1);
                }
                if (pitch.substr(0,1) == "G" && pitchFileMod == "-"){
                    return "F" + pitch.substr(1,1);
                }
                return pitch.substr(0,1) + pitchFileMod + pitch.substr(1,1); 
            },
        }
    }]);
