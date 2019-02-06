angular.module("mixTapeApp")
    .factory("utilsService", ["globalSettings", "graphicsEngineService", 
        function(globalSettings, graphicsEngineService) {
    	"use strict"
        return {
            getMelody: function() {
                var objs = graphicsEngineService.getObjects();
                var locs = graphicsEngineService.getLocations();
                var width = graphicsEngineService.getCanvasWidth();
                var height = graphicsEngineService.getCanvasHeight();
                var yOffset = (graphicsEngineService.getYOffset(0) / 2).toFixed(2); 
                var lineSpacing = graphicsEngineService.getLineSpacing();
                var melody = [];
                var result = "";
                for (var i = 0; i < locs.length; i++) {
                    var diff = yOffset - (locs[i][1] * height).toFixed(2);
                    diff = Math.round(diff / lineSpacing);
                    if (diff >= -8 && diff <= 3) {
                        melody.push(globalSettings.trebleStaff[(diff * -1) + 3]);
                    }
                }
                return melody.toString();
            }
        }
    }]);