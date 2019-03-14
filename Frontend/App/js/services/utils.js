angular.module("songifyApp")
.factory("utilsService", ["globalSettings",
    function(globalSettings) {
    	"use strict"
        return {

            /* Converts less common notes to more common notes (at least common
            meaning the wave files we have). */
            flatSharpExceptions: function (note){
                if (note.length < 3) {
                    return note;
                }

                var pitch = note.substr(0,1) + note.substr(2,2)
                var pitchFileMod = note.substr(1,1);


                if (pitch.substr(0,1) == "A" && pitchFileMod == "-"){
                    return "G" + "#" + pitch.substr(1,1);
                }
                if (pitch.substr(0,1) == "A" && pitchFileMod == "#"){
                    return "B" + "-" + pitch.substr(1,1);
                }
                if (pitch.substr(0,1) == "B" && pitchFileMod == "#"){
                    // need to go up to C so also increase the octave
                    return "C" + (parseInt(pitch.substr(1,1)) + 1).toString();
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
