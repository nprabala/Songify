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
                        melody.push([globalSettings.trebleStaff[(diff * -1) + 3]]);
                    }
                }
                return melody;
            },

            playSequence: async function(sequence, isChords) {
                const sleep = (milliseconds) => {
                    return new Promise(resolve => setTimeout(resolve, milliseconds))
                };

                if (isChords) {
                    for (var i = 0; i < sequence.length; i++) {
                        var unsplitChord = sequence[i]["chord"];
                        var duration = sequence[i]["duration"];
                        var splitChord = unsplitChord.split(".");

                        var chords = [];
                        for (var j = 0; j < splitChord.length; j++) {
                            if (splitChord[j] == 'F#') continue; // TODO: Temp hack until sharps

                            var file = 'App/aud/' + splitChord[j] + '4' + '.wav';
                            var howl = new Howl({ src: [file], volume: 0.4});
                            howl.play();
                        }
                        await sleep(duration * 1000);
                    }

                } else {
                    var durations = graphicsEngineService.durations;
                    for (var i = 0; i < sequence.length; i++) {
                        var file = 'App/aud/' + sequence[i] + '.wav';
                        var howl = new Howl({ src: [file], volume: 0.4});
                        howl.play();
                        await sleep(durations[i]*1000); // currently duration is 1
                    }
                }
            },
        }
    }]);
