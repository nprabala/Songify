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

            flatSharpExceptionsWrapper: function(note) {
                if (note.substr(1,1) == '#' || note.substr(1,1) == '-') {
                    return this.flatSharpExceptions(note.substr(0,1) + note.substr(2,1),
                                                    note.substr(1,1));
                } else {
                    return note;
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
                if (i % 2 == 0 && i >= 2 && i < globalSettings.trebleStaff.length - 1){
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
                var noteWidthPercentage = (globalSettings.noteRadius*2)*100;
                var notePercentage = (globalSettings.lineHeight/2) *100;
                var curLines = 0;

                for (var i = 0; i < globalSettings.trebleStaff.length; i++){
                    var line = "";

                    if (i % 2 == 0 && i >= 4 && curLines < globalSettings.maxLines){
                        line = '<line x1="0%" y1="50%" x2="100%" y2="50%" style="stroke:rgb(0,0,0);stroke-width:2"/>';
                        curLines += 1;
                    }

                    staff += '<div id="'+String(i)+'" class="row" style="height:' + String(notePercentage)+'%;">';
                    for (var j = 0; j < 1/(globalSettings.noteRadius*2); j++){
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
                    if(noteType == "whole"){
                        var note = document.createElementNS(namespace, "ellipse");
                        note.setAttributeNS(null, "rx",r);
                        note.setAttributeNS(null, "ry",ry);
                    }
                    else{
                        var note = document.createElementNS(namespace, "circle");
                        note.setAttributeNS(null, "r",r);
                    }
                    note.setAttributeNS(null, "cx", cx);
                    note.setAttributeNS(null, "cy",cy);
                    if(noteType == "half" || noteType == "whole"){
                        note.setAttributeNS(null, "fill","none");
                        note.setAttributeNS(null,"stroke","black");
                    }
                    return note;
                },
                convertToNote : function(i){
                    var pitch = globalSettings.trebleStaff[i];
                    var time_duration = 1;
                    var pitchFileMod = "";
                    if (globalSettings.currentType == "sixteenth"){
                        time_duration = .25;
                    }
                    if(globalSettings.currentType == "eighth"){
                        time_duration = .5;
                    }
                    if(globalSettings.currentType == "half"){
                        time_duration = 2;
                    }
                    if(globalSettings.currentType == "whole"){
                        time_duration = 4;
                    }
                    if (globalSettings.pitchType == "Sharp"){
                     pitchFileMod = "#";
                 }
                 if(globalSettings.pitchType == "Flat"){
                     pitchFileMod = "-";
                 }
                 var fileString = this.flatSharpExceptions(pitch,pitchFileMod);
                 var note = {"note":fileString, "duration":time_duration};
                 return note;
             },
             addToChord: function(note, chords, start){
                    //TODO: Allow notes to be added to a chord that start same but end at different times.

                    var chord = chords[start]["chord"];

                    chord += note["note"]
                },
            }
        }]);
