angular.module("mixTapeApp")
    .factory("utilsService", ["globalSettings",
        function(globalSettings) {
    	"use strict"
        return {
            setHostname: function(hostname) {
                this.hostname = hostname;
            },

            getHostname: function() {
                return this.hostname;
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
