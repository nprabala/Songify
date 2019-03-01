angular.module("mixTapeApp")
.factory("renderService", ["globalSettings", "scoreService",
function(globalSettings, scoreService) {
    "use strict";

    // Checks for all the flat sharp combos that really mean something else.
    function flatSharpExceptions(pitch, pitchFileMod){
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
    };

    return {
        clearStaff: function(staff){
            var staffElem = $("#" + staff)[0];
            var rows = staffElem.children
            for(var i = 0; i < rows.length; i++){
                var row = rows[i];
                var cols = row.children;
                for(var j = 0; j < cols.length; j++){
                    this.clearNote(cols[j],i);
                }
            }
        },

        clearNote: function(col, i){
            if (i % 2 == 0 && i >= globalSettings.TOP_LINE_INDEX && i < globalSettings.trebleStaff.length - 1){
                if(col.children.length >= 2){
                    for (var k = 1; k < col.children.length; k++){
                        col.removeChild(col.children[k]);
                    }
                }
            }
            else{
                if(col.children.length >= 1){
                    for (var k = 0; k < col.children.length; k++){
                        col.removeChild(col.children[k]);
                    }
                }
            }
        },

        generateStaff: function(id){
            var idString = ' id="'+id+'" '
            var idVar = "this." + id + "Staff";
            var staff = '<div '+idString+' class="staff">';
            var noteWidthPercentage = (globalSettings.NOTE_RADIUS*2)*100;
            var notePercentage = (globalSettings.LINE_HEIGHT/2) *100;
            var curLines = 0;

            for (var i = 0; i < globalSettings.trebleStaff.length; i++){
                var line = "";

                if (i % 2 == 0 && i >= globalSettings.TOP_LINE_INDEX
                    && curLines < globalSettings.STAFF_LINES){

                        line = '<line x1="0%" y1="50%" x2="100%" y2="50%" style="stroke:rgb(0,0,0);stroke-width:2"/>';
                        curLines += 1;
                    }

                    staff += '<div id="'+String(i)+'" class="row" style="height:' + String(notePercentage)+'%;">';
                    for (var j = 0; j < 1/(globalSettings.NOTE_RADIUS*2); j++){
                        staff += '<svg id="'+String(j)+'" style="width:' + noteWidthPercentage + '%;"ng-click="drawNote('+i+','+j+','+idVar+')" class="cell"'+
                        '>' + line + '</svg>';

                    }
                    staff += '</div>';
                }
                staff += '</div>';
                return staff
        },
        // TODO: Alter to draw a particular kind of note.
        generateNoteHTML : function(noteType){
            var namespace = "http://www.w3.org/2000/svg";
            var cx = "50%";
            var cy = "50%";
            var r= "30%";
            var ry = "25%";

            if(noteType == globalSettings.noteType.WHOLE){
                var note = document.createElementNS(namespace, "ellipse");
                note.setAttributeNS(null, "rx",r);
                note.setAttributeNS(null, "ry",ry);
            } else {
                var note = document.createElementNS(namespace, "circle");
                note.setAttributeNS(null, "r",r);
            }

            note.setAttributeNS(null, "cx", cx);
            note.setAttributeNS(null, "cy",cy);

            if (noteType == globalSettings.noteType.HALF
                || noteType == globalSettings.noteType.WHOLE){

                    note.setAttributeNS(null, "fill","none");
                    note.setAttributeNS(null,"stroke","black");
                }
                return note;
            },
        convertToNote : function(i, pitchType, noteType){
            var pitch = globalSettings.trebleStaff[i];
            var time_duration = 1;
            var pitchFileMod = "";
            if (noteType == globalSettings.noteType.SIXTEENTH){
                time_duration = .25;
            }
            if(noteType == globalSettings.noteType.EIGHTH){
                time_duration = .5;
            }
            if(noteType == globalSettings.noteType.HALF){
                time_duration = 2;
            }
            if(noteType == globalSettings.noteType.WHOLE){
                time_duration = 4;
            }
            if (pitchType == globalSettings.notePitchMod.SHARP){
                pitchFileMod = "#";
            }
            if(pitchType == globalSettings.notePitchMod.FLAT){
                pitchFileMod = "-";
            }
            var fileString = flatSharpExceptions(pitch,pitchFileMod);
            var note = {"note":fileString, "duration":time_duration};
            return note;
        },

        resizeScore: function(width) {
            scoreService.resizeDisplay(window.innerWidth);
        },

        drawScore: function(melody, chord) {
            scoreService.drawScore(melody, chord);
        },

        initialise: function(melodyScore, chordsScore) {
            scoreService.initialise(melodyScore, chordsScore);
        }
    }
}]);
