angular.module("mixTapeApp")
.factory("graphicsEngineService", ["globalSettings", function(globalSettings) {
   return {
    initialise: function(canvasContext, objs, locs,durs, curType) {
        this.canvasObjects = objs; // This stores all of the canvas objects to be rendered (except the staff)
        this.canvasLocations = locs; // This stores all the locations of the canvas objects, corresponding to canvasObjects in 1:1
        
        // Collect basic data from canvas
        this.canvas = canvasContext;
        this.canvas_attributes  = this.canvas['canvas'];
        this.canvas_height = this.canvas_attributes['height'] / 2;
        this.canvas_width = this.canvas_attributes['width'] / 2;
        this.durations = durs;
        this.currentType = curType;
        this.canvas.strokeStyle = "black";
    },

    note: function(ctx, x, y, rad) {
        function draw(ctx, x, y, rad) {
            ctx.save();
            ctx.beginPath();
            ctx.translate(ctx.width / 2, ctx.height / 2);
            ctx.scale(3, 2);
            ctx.arc((x * 2) / 3, y, rad, 0, 2 * Math.PI, false);
            ctx.fillStyle = "#373737";
            ctx.fill();

            ctx.restore();
            ctx.stroke();  
        }
        this.draw = draw(ctx, x, y, rad);
    },

    getObjects: function() {
        return this.canvasObjects;
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

    // Returns the y-value of the top left corner of each staff. Param staffNum = 0 is the first row, staffNum = 1 is 2nd row, etc.
    getYOffset: function(staffNum) {
        return (this.canvas_height * globalSettings.paddingY) + staffNum * (this.canvas_height * globalSettings.measureLineSpacing);
    },

    getLineSpacing: function() {
        return (this.canvas_height * globalSettings.lineHeight) / globalSettings.numSpaces;
    },

    addNote: function(x, y) {
        this.canvasObjects.push(this.note);
        var time_duration = 1;
        if (this.currentType == "sixteenth"){
            time_duration = .25;
        } 
        if(this.currentType == "eighth"){
            time_duration = .5;
        }
        if(this.currentType == "half"){
            time_duration = 2;
        }
        if(this.currentType == "whole"){
            time_duration = 4;
        }
        this.durations.push(time_duration);
        this.canvasLocations.push([(x / this.canvas_width), (y / this.canvas_height)]);
        this.drawObjects();
    },

    drawObjects: function() {
        var noteRad = globalSettings.noteRadius * this.canvas_height;
        for (var i = 0; i < this.canvasObjects.length; i++) {
            var locs = this.canvasLocations[i];
            this.canvasObjects[i](this.canvas, locs[0] * this.canvas_width, locs[1] * this.canvas_height, noteRad);
            this.canvasObjects[i].draw;
        }
    },

    clearObjects: function() {
        this.canvasObjects = [];
        this.canvasLocations = [];
        this.canvas.clearRect(0, 0, this.canvas.width, this.canvas.height); 
        return;
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
        var measureWidth = globalSettings.numMeasures * this.canvas_width * globalSettings.measureWidth;
        var paddingLeft = globalSettings.paddingX * this.canvas_width;
        var paddingTop = globalSettings.paddingY * this.canvas_height;
        var lineSpacing = globalSettings.lineHeight * this.canvas_height;
        var measureHeight = lineSpacing * globalSettings.numSpaces;
        for (var i = 0; i < globalSettings.numLines; i++) {
            this.drawHorizontalLine(xOffset + paddingLeft, yOffset + paddingTop + (i * lineSpacing), measureWidth);    
        }
        for (var j = 0; j < globalSettings.numMeasures + 1; j++) {
            this.drawVerticalLine(xOffset + paddingLeft + (j * (measureWidth / globalSettings.numMeasures)), yOffset + paddingTop, measureHeight);
        }
    },

    drawStaff: function() {
        for (var i = 0; i < globalSettings.numMeasureLines; i++) {
            this.drawMeasures(0, i * (this.canvas_height * globalSettings.measureLineSpacing));    
        }
    }
}   
}]);