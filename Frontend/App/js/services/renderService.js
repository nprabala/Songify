angular.module("songifyApp")
.factory("renderService", ["globalSettings", "scoreService",
function(globalSettings, scoreService) {
    "use strict";

    return {
        //Clears the staff
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

        //Clears a note at a particular index within the div grid structure.
        clearNote: function(col, i){
            if (i % 2 == 0){
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

        // Generates HTML for the staff. Instead of using an HTML5 canvas or a table, it simulates the best of both worlds
        // using a series of divs with svg canvases nested inside them.
        // Each div constitutes one half step on the staff. Each svg contains one note. The overall structure
        // is modelled as an xy grid.
        // Globalsettings determines the size of canvas, size of notes, and number of notes allowed as input.
        generateStaff: function(id){
            var idString = ' id="'+id+'" '
            var idVar = "this." + id + "Staff";
            var staff = '<div '+idString+' class="staff">';
            var noteWidthPercentage = (globalSettings.NOTE_RADIUS*2)*100;
            var notePercentage = (globalSettings.LINE_HEIGHT/2) *100;
            var curLines = 0;

            for (var i = 0; i < globalSettings.trebleStaff.length; i++){
                var line = "";

                // lines for main staff
                if (i % 2 == 0 && i >= globalSettings.TOP_LINE_INDEX && curLines < globalSettings.STAFF_LINES){

                    line = '<line x1="0%" y1="50%" x2="100%" y2="50%" style="stroke:rgb(0,0,0);stroke-width:2"/>';
                    curLines += 1;
                
                        
                // faint lines for notes above and below staff   
                } else if (i % 2 == 0 && (curLines >= globalSettings.STAFF_LINES || i < globalSettings.TOP_LINE_INDEX)) {
                    line = '<line x1="0%" y1="50%" x2="100%" y2="50%" style="stroke:rgb(0,0,0);stroke-width:0.1"/>';
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

        // Generates HTML tags for individual notes to be rendered on the svg canvases
        // Generates different HTML depending on the type of note (half, eighth etc) and
        // the pitch (natural, sharp, flat).
        generateNoteHTML : function(noteType, pitchType){
            var namespace = "http://www.w3.org/2000/svg";
            var img = document.createElementNS(namespace, "image");
            var imgFile = "";
            if (noteType == globalSettings.noteType.WHOLE) {
                if (pitchType == globalSettings.pitchType.SHARP) {
                    imgFile = "App/img/whole_sharp.png";
                } else if (pitchType == globalSettings.pitchType.FLAT) {
                    imgFile = "App/img/whole_flat.png";
                } else {
                    imgFile = "App/img/whole.png";
                }
            }
            else if (noteType == globalSettings.noteType.HALF) {
                if (pitchType == globalSettings.pitchType.FLAT) {
                    imgFile = "App/img/half_flat.png";
                } else if (pitchType == globalSettings.pitchType.SHARP) {
                    imgFile = "App/img/half_sharp.png";
                } else {
                    imgFile = "App/img/half.png";
                }
            }
            else if (noteType == globalSettings.noteType.QUARTER) {
                if (pitchType == globalSettings.pitchType.FLAT) {
                    imgFile = "App/img/quarter_flat.png";
                } else if (pitchType == globalSettings.pitchType.SHARP) {
                    imgFile = "App/img/quarter_sharp.png";
                } else {
                    imgFile = "App/img/quarter.png";
                }
            }
            else if (noteType == globalSettings.noteType.EIGHTH) {
                if (pitchType == globalSettings.pitchType.FLAT) {
                    imgFile = "App/img/eighth_flat.png";
                } else if (pitchType == globalSettings.pitchType.SHARP) {
                    imgFile = "App/img/eighth_sharp.png";
                } else {
                    imgFile = "App/img/eighth.png";
                }
            }
            else if (noteType == globalSettings.noteType.SIXTEENTH) {
                if (pitchType == globalSettings.pitchType.FLAT) {
                    imgFile = "App/img/sixteenth_flat.png";
                } else if (pitchType == globalSettings.pitchType.SHARP) {
                    imgFile = "App/img/sixteenth_sharp.png";
                } else {
                    imgFile = "App/img/sixteenth.png";
                }
            }

            img.setAttributeNS(null, "href", imgFile);
            img.setAttributeNS(null, "height", "200%");
            img.setAttributeNS(null, "width", "100%");
            img.setAttributeNS(null, "y", "-120%");
            return img;
        },
        // Takes in individual fields that describe note inputs
        // and converts it into an object that references the audio file for a note
        // and how long that file should be played.
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
            if (pitchType == globalSettings.pitchType.SHARP){
                pitchFileMod = "#";
            }
            if(pitchType == globalSettings.pitchType.FLAT){
                pitchFileMod = "-";
            }
            var fileString = pitch.substr(0,1) + pitchFileMod + pitch.substr(1,1);
            var note = {"note":fileString, "duration":time_duration};
            return note;
        },

        // Enables resizing
        resizeScore: function(width) {
            scoreService.resizeDisplay(window.innerWidth);
        },

        // Calls relevant rendering functions to draw the score.
        drawScore: function(melody, chord) {
            scoreService.drawScore(melody, chord);
        },

        // Initializes fields.
        initialise: function(melodyScore, chordsScore) {
            scoreService.initialise(melodyScore, chordsScore);
        }
    }
}]);
