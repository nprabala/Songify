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

            /*
             * Creates the sequence for playing the notes in order given sequence.

             * Len is the length of the input (in quarter notes for now)
             */
            createSequence: function(sequence, isChord, len) {
                var howlArray = [];
                var count = 0;

                /*
                 * Creates a howl object given input.

                 * isFirst determines if note is the first in its group
                 * (specifically for chords so that all the notes in the chord
                 * aren't triggering the next note to start, just the first one).
                 */
                var createHowl = function(note, isFirst) {
                    // temp hack until we handle sharps and flats
                    if (note == 'F#4') return globalSettings.noteError;

                    var file = 'App/aud/' + note + '.wav';

                    if (isFirst) {
                        return new Howl({ src: [file], loop:false, volume: 0.5,
                            onend:() => {
                                if (++count != len) {
                                    for (var i = 0; i < howlArray[count].length; i++) {
                                        howlArray[count][i].play();
                                    }
                                }
                            }
                        });
                    } else {
                        return new Howl({ src: [file], loop:false, volume: 0.5});
                    }
                };


                if (isChord) {
                    for (var i = 0; i < sequence.length; i++) {
                        var unsplitChord = sequence[i]["chord"];
                        var duration = sequence[i]["duration"];
                        var splitChord = unsplitChord.split(".");

                        // create howl objects for each note in the chord and
                        // combine into an array to push onto howlArray
                        var chords = [];
                        for (var j = 0; j < splitChord.length; j++) {
                            var howlNote = createHowl(splitChord[j] + '4', j == 0);
                            if (howlNote != globalSettings.noteError) {
                                chords.push(howlNote);
                            }
                        }

                        howlArray.push(chords);
                    }

                // Melody
                } else {
                    for (var i = 0; i < sequence.length; i++) {
                        // wrap in an array to keep consistent with chords above
                        howlArray.push([createHowl(sequence[i], true)]);
                    }
                }

                return howlArray;
            },

            // play the sequence given by soundArray
            playSequence: function(soundArray) {
                for (var i = 0; i < soundArray[0].length; i++) {
                    soundArray[0][i].play();
                }
            },
        }
    }]);
