angular.module("mixTapeApp")
.factory("graphicsEngineService", ["globalSettings", function(globalSettings) {
   "use strict";
   return {
    initialise: function(canvasContext) {

        //Collect basic data from canvas
        this.canvas = canvasContext;
        this.canvas_attributes  = this.canvas['canvas'];
        this.canvas_height = this.canvas_attributes['height'];
        this.canvas_width = this.canvas_attributes['width'];

        //Generate staff centric variables
        this.canvas_vertical_padding = this.canvas_attributes['offsetTop'];
        this.canvas_horizontal_padding = this.canvas_attributes['offsetLeft'];
        this.staffHeight = Math.floor((.9*this.canvas_height)/ globalSettings.numLines);
        this.staffOffset = Math.floor(this.canvas_width / 20);
        this.measureLength = Math.floor((this.canvas_width - 2*this.staffOffset) / globalSettings.numMeasures)

        this.lineHeight = Math.floor(this.staffHeight / 5)
        this.canvas.strokeStyle = "black";


    },
    
    blankScreen: function() {
        this.canvas.fillStyle = globalSettings.gameBoardBackgroundColour;
        this.canvas.fillRect(0, 0, globalSettings.gameBoardWidth, globalSettings.gameBoardHeight);
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

    drawStaff: function() {
        this.staffGap = 10;
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