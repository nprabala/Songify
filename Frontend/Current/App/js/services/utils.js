angular.module("mixTapeApp")
.factory("utilsService", ["globalSettings",
    function(globalSettings) {
    	"use strict"
        return {
                // Checks for all the flat sharp combos that really mean something else.
    flatSharpExceptions: function (pitch, pitchFileMod){
        console.log(pitch)
        console.log(pitchFileMod)
        if (pitch.substr(0,1) == "A" && pitchFileMod == "-"){
            return "G" + "S" + pitch.substr(1,1);
        }
        if (pitch.substr(0,1) == "A" && pitchFileMod == "#"){
            return "B" + "-" + pitch.substr(1,1);
        }
        if (pitch.substr(0,1) == "B" && pitchFileMod == "#"){
            // need to go up to C so also increase the octave
            return "C" + (parseInt(pitch.substr(1,1)) + 1).toString();
        }
        if (pitch.substr(0,1) == "D" && pitchFileMod == "-"){
            return "C" + "S" + pitch.substr(1,1);
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
