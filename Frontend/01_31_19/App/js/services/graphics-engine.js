angular.module("mixTapeApp")
.factory("graphicsEngineService", ["globalSettings", function(globalSettings) {
   return {
    initialise: function(canvasContext) {
        if (globalSettings.debug) {
            console.log("initialising canvas");
        }
        this.canvasObjects = [];
        this.canvasLocations = [];
        //Collect basic data from canvas
        this.canvas = canvasContext;
        this.canvas_attributes  = this.canvas['canvas'];
        this.canvas_height = this.canvas_attributes['height'];
        this.canvas_width = this.canvas_attributes['width'];

        //Generate staff centric variables
        this.canvas_vertical_padding = this.canvas_attributes['offsetTop'];
        this.canvas_horizontal_padding = this.canvas_attributes['offsetLeft'];
        this.staffHeight = Math.floor((.9 * this.canvas_height) / globalSettings.numLines);
        this.staffOffset = Math.floor(this.canvas_width / 20);
        this.measureLength = Math.floor((this.canvas_width - 2 * this.staffOffset) / globalSettings.numMeasures);

        this.lineHeight = Math.floor(this.staffHeight / 5);
        this.canvas.strokeStyle = "black";
    },

    note: function(ctx, x, y, length) {
        function draw(ctx, x, y, length) {
            if (globalSettings.debug) {
                console.log("drawing note from graphics engine: " + x + ", " + y);
            }
            ctx.save();
            ctx.beginPath();

            ctx.translate(ctx.width / 2, ctx.height / 2);
            ctx.scale(3, 2);
            ctx.arc((x * 2) / 3, y, globalSettings.noteRadius, 0, 2 * Math.PI, false);
            ctx.fillStyle = "#373737";
            ctx.fill();

            ctx.restore();
            ctx.stroke();  
        }
        this.draw = draw(ctx, x, y, length);
    },

    getObjects: function() {
        if (globalSettings.debug) {
            console.log("number of objects: " + this.canvasObjects.length);
            console.log("current objects: " + this.canvasObjects);    
        }
    },

    addObject: function(x, y, z) {
        this.canvasObjects.push(this.note);
        this.canvasLocations.push([x, y, z]);
        if (globalSettings.debug) console.log("adding to canvas locs: " + x + ", " + y + ", " + z);
    },

    drawObjects: function() {
        if (globalSettings.debug) console.log("drawing objects!");
        for (var i = 0; i < this.canvasObjects.length; i++) {
            var locs = this.canvasLocations[i];
            console.log("drawing at " + locs[0]);
            this.canvasObjects[i](this.canvas, locs[0], locs[1], locs[2]);
            this.canvasObjects[i].draw;
        }
    },

    clearObjects: function() {
        console.log("clearing objects");
        this.canvasObjects = [];
        this.canvasLocations = [];
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

    // drawNote: function(x, y) {
    //     if (globalSettings.debug) {
    //         console.log("drawing note from graphics engine: " + x + ", " + y);
    //     }
    //     this.canvas.save();
    //     this.canvas.beginPath();

    //     this.canvas.translate(this.canvas.width / 2, this.canvas.height / 2);
    //     this.canvas.scale(3, 2);
    //     this.canvas.arc((x * 2) / 3, y, globalSettings.noteRadius, 0, 2 * Math.PI, false);
    //     this.canvas.fillStyle = "#373737";
    //     this.canvas.fill();

    //     this.canvas.restore();
    //     this.canvas.stroke();
    // },

    drawStaff: function() {
        this.staffGap = 30;
                // Generate each line
                for (var j = 0; j < globalSettings.numLines; j++){

                    var barTop = j*this.staffHeight + this.staffGap;
                    // Generate all the measures in each line
                    for (var k = 0; k < globalSettings.numMeasures; k++){
                        this.drawVerticalLine(this.staffOffset + k*this.measureLength, barTop, this.staffHeight - this.lineHeight);
                        for (var i = 0; i < globalSettings.staffLines; i++) {
                            // Generate a staff for each measure

                            this.drawHorizontalLine(this.staffOffset + k*this.measureLength, 
                                i * this.lineHeight + barTop, this.measureLength);
                        }
                        //Draw end of system(line)
                        this.drawVerticalLine(this.staffOffset + (k+1)*this.measureLength, barTop, this.staffHeight - this.lineHeight);


                    }

                }
            }
        }   
    }]);