angular.module("mixTapeApp")
.factory("graphicsEngineService", ["globalSettings", "utilsService", function(globalSettings, utilsService) {
   return {
       readMelody: function() {
           var objs = this.getObjects();
           var locs = this.getLocations();
           var width = this.getCanvasWidth();
           var height = this.getCanvasHeight();
           var yOffset = (this.getYOffset(0) / 2).toFixed(2);
           var lineSpacing = this.getLineSpacing();
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
                   var fileString = utilsService.flatSharpExceptions(pitch,pitchFileMod);
                   melody.push(fileString);
               }
           }

           return melody;
       },

       getMelodyDurations: function() {
           return this.durations;
       },

    initialise: function(canvasContext, objs, locs, chords, clocs, durs) {
        this.canvasObjects = objs; // This stores all of the canvas objects to be rendered (except the staff)
        this.canvasLocations = locs; // This stores all the locations of the canvas objects, corresponding to canvasObjects in 1:1
        this.canvasChords = chords;
        this.canvasChordLocations = clocs;

        // Collect basic data from canvas
        this.canvas = canvasContext;
        this.canvas_attributes  = this.canvas['canvas'];
        this.canvas_height = this.canvas_attributes['height'] / 2;
        this.canvas_width = this.canvas_attributes['width'] / 2;
        this.durations = durs;
        this.canvas.strokeStyle = "black";
    },

    getChordLocations: function() {
        return this.canvasChordLocations;
    },

    note: function(ctx, x, y, rad, duration, pitchType) {
        function draw(ctx, x, y, rad, duration) {
            ctx.save();
            ctx.beginPath();
            ctx.translate(ctx.width / 2, ctx.height / 2);
            ctx.scale(3, 2);
            ctx.arc((x * 2) / 3, y, rad, 0, 2 * Math.PI, false);
            if (duration == 4) {
                ctx.fillStyle = globalSettings.palettePink[0];
            }
            else if (duration == 2) {
                ctx.fillStyle = globalSettings.palettePink[1];
            }
            else if (duration == 1) {
                ctx.fillStyle = globalSettings.palettePink[2];
            }
            else if (duration == 0.5) {
                ctx.fillStyle = globalSettings.palettePink[3];
            }
            else if (duration == 0.25) {
                ctx.fillStyle = globalSettings.palettePink[4];
            }
            ctx.fill();
            ctx.restore();
            ctx.stroke();
        }
        this.draw = draw(ctx, x, y, rad, duration);
    },

    chord: function(ctx, x, y, rad) {
        function draw(ctx, x, y, rad) {
            ctx.save();
            ctx.beginPath();
            ctx.translate(ctx.width / 2, ctx.height / 2);
            ctx.scale(3, 2);
            ctx.arc((x * 2) / 3, y, rad, 0, 2 * Math.PI, false);
            ctx.fillStyle = "#0000ff";
            ctx.fill();

            ctx.restore();
            ctx.stroke();
        }
        this.draw = draw(ctx, x, y, rad);
    },

    getObjects: function() {
        return this.canvasObjects;
    },

    getChords: function() {
      return this.canvasChords;
    },

    getCanvasHeight: function() {
        return this.canvas_height;
    },

    getCanvasWidth: function() {
        return this.canvas_width;
    },

    getLocations: function() {
        return this.canvasLocations;
    },

    // Returns the y-value of the top left corner of each staff.
    // Param staffNum = 0 is the first row, staffNum = 1 is 2nd row, etc.
    getYOffset: function(staffNum) {
        return (this.canvas_height * globalSettings.paddingY) +
        staffNum * (this.canvas_height * globalSettings.measureLineSpacing);
    },

    getLineSpacing: function() {
        return (this.canvas_height * globalSettings.lineHeight) / globalSettings.numSpaces;
    },

    // param note = letter note that should be rendered as a chord
    // param sequence = the index of canvasObjects/canvasLocations that
    // the chord should be rendered underneath (for example, if sequence == 0,
    // should find the first location in canvasLocations and use that
    // x-pos to render the chord underneath that note)
    // TODO: should not render when chordObj = ""
    addChordNote: function(note, dur) {
        this.canvasChords.push(this.chord);
        var yPos = this.getYOffset(1) / 2;
        var chordY = 0;
        if (note == "F" || note == "F#" || note == "F-") {
            chordY = yPos / this.canvas_height;
        }
        else if (note == "G" || note == "G#" || note == "G-") {
            chordY = (yPos / this.canvas_height) - (globalSettings.noteRadius);
        }
        else if (note == "A" || note == "A#" || note == "A-") {
            chordY = (yPos / this.canvas_height) + (6 * globalSettings.noteRadius);
        }
        else if (note == "B" || note == "B#" || note == "B-") {
            chordY = (yPos / this.canvas_height) + (5 * globalSettings.noteRadius);
        }
        else if (note == "C" || note == "C#" || note == "C-") {
            chordY =  (yPos / this.canvas_height) + (4 * globalSettings.noteRadius);
        }
        else if (note == "D" || note == "D#" || note == "D-") {
            chordY = (yPos / this.canvas_height) + (2.5 * globalSettings.noteRadius);
        }
        else if (note == "E" || note == "E#" || note == "E-") {
            chordY = (yPos / this.canvas_height) + (globalSettings.noteRadius);
        }
        else {
           chordY = (yPos / this.canvas_height);
        }
        var newDur = 0;
        for (var i = 0; i < this.durations.length; i++) {
            newDur += this.durations[i];
            if (newDur > dur) {
                newDur = i;
                break;
            }
        }
        console.log("adding canvas chords!!");
        this.canvasChordLocations.push([this.canvasLocations[newDur][0], chordY]);
    },

    addChords: function(chords) {
        var dur = 0;
        for (var i = 0; i < chords.length; i++) {
            var chord = chords[i]["chord"].split(".");
            for (var j = 0; j < chord.length; j++) {
                this.addChordNote(chord[j], dur);
            }
            dur += chords[i]["duration"];
        }
        this.drawChords();
    },



    addNote: function(x, y) {
        var time_duration = 1;
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
        var height = this.getCanvasHeight();
        var lineSpacing = this.getLineSpacing();
        var yOffset = (this.getYOffset(0) / 2).toFixed(2);
        var diff = yOffset - ((y / this.canvas_height)* height).toFixed(2);
        diff = Math.round(diff / lineSpacing);
        if (diff >= -8 && diff <= 3) {
            globalSettings.pitchAlterations.push(globalSettings.pitchType);
            this.canvasObjects.push(this.note);
            this.durations.push(time_duration);
            this.canvasLocations.push([(x / this.canvas_width), (y / this.canvas_height)]);
            this.drawObjects();
        }
    },
    drawObjects: function() {
        var noteRad = globalSettings.noteRadius * this.canvas_height;
        var i = this.canvasObjects.length - 1;
        if (i < 0) return;
        var locs = this.canvasLocations[i];
        this.canvasObjects[i](this.canvas, locs[0] * this.canvas_width, locs[1] * this.canvas_height, noteRad, this.durations[i]);
        this.canvasObjects[i].draw;
    },

    drawChords: function() {
        var noteRad = globalSettings.noteRadius * this.canvas_height;
        for (var j = 0; j < this.canvasChords.length; j++) {
            var locs = this.canvasChordLocations[j];
            this.canvasChords[j](this.canvas, locs[0] * this.canvas_width, locs[1] * this.canvas_height, noteRad);
            this.canvasChords[j].draw;
        }
    },

    redraw: function() {
        var noteRad = globalSettings.noteRadius * this.canvas_height;
        for (var i = 0; i < this.canvasObjects.length; i++) {
            var locs = this.canvasLocations[i];
            this.canvasObjects[i](this.canvas, locs[0] * this.canvas_width, locs[1] * this.canvas_height, noteRad, this.durations[i]);
            this.canvasObjects[i].draw;
        }

        for (var j = 0; j < this.canvasChords.length; j++) {
            var locs = this.canvasChordLocations[j];
            this.canvasChords[j](this.canvas, locs[0] * this.canvas_width, locs[1] * this.canvas_height, noteRad);
            this.canvasChords[j].draw;
        }
    },

    clearChords: function() {
        this.canvasChords = [];
        this.canvasChordLocations = [];
    },

    clearObjects: function() {
        this.canvasObjects = [];
        this.canvasLocations = [];
        this.clearChords();
        this.durations = [];
        globalSettings.pitchAlterations = [];
        this.canvas.clearRect(0, 0, this.canvas.width, this.canvas.height);

    },

    drawHorizontalLine: function(x, y, length) {
        this.canvas.beginPath();
        this.canvas.moveTo(x, y);
        this.canvas.lineTo(x + length, y);
        this.canvas.stroke();
    },

    drawVerticalLine: function(x, y, length) {
        this.canvas.beginPath();
        this.canvas.moveTo(x, y);
        this.canvas.lineTo(x, y + length);
        this.canvas.stroke();
    },

    drawMeasures: function(xOffset, yOffset) {
        var self = this;
        var img = new Image();
        img.onload = function() {
             self.canvas.drawImage(img, 100, -4, 140, 140);
             self.canvas.drawImage(img, 100, 130, 140, 140);
        };
        img.src = "App/img/treble.png";

        var measureWidth = globalSettings.numMeasures * this.canvas_width * globalSettings.measureWidth;
        var paddingLeft = globalSettings.paddingX * this.canvas_width;
        var paddingTop = globalSettings.paddingY * this.canvas_height;
        var lineSpacing = globalSettings.lineHeight * this.canvas_height;
        var measureHeight = lineSpacing * globalSettings.numSpaces;
        for (var i = 0; i < globalSettings.numLines; i++) {
            this.drawHorizontalLine(xOffset + paddingLeft, yOffset + paddingTop + (i * lineSpacing), measureWidth);
        }
        // for (var j = 0; j < globalSettings.numMeasures + 1; j++) {
        //     this.drawVerticalLine(xOffset + paddingLeft + (j * (measureWidth / globalSettings.numMeasures)), yOffset + paddingTop, measureHeight);
        // }
    },

    drawStaff: function() {
        for (var i = 0; i < globalSettings.numMeasureLines; i++) {
            this.drawMeasures(0, i * (this.canvas_height * globalSettings.measureLineSpacing));
        }
    }
}
}]);