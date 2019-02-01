angular.module("mixTapeApp")
    .factory("graphicsEngineService", ["globalSettings", function(globalSettings) {
       "use strict";
        return {
            initialise: function(canvasContext) {
                this.canvas = canvasContext;
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

            // right now this only draws the first measure, and is heavily hardcoded
            drawStaff: function() {
                this.drawVerticalLine(globalSettings.padding, globalSettings.padding, globalSettings.staffHeight);
                for (var i = 0; i < globalSettings.staffLines; i++) {
                    this.drawHorizontalLine(globalSettings.padding, 
                        i * globalSettings.lineHeight + globalSettings.padding, globalSettings.measureLength);
                }
                this.drawVerticalLine(globalSettings.padding + globalSettings.measureLength, globalSettings.padding, globalSettings.staffHeight);
            }
        }   
    }]);