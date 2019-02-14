angular.module("mixTapeApp")
    .factory("soundService", [
        function() {
            return {
                getSounds: function(note) {
                    return this.sounds[note];
                },

                playSequence: async function(sequence, durations, isChord) {
                    if (isChord) {
                        for (var i = 0; i < sequence.length; i++) {
                            for (var j = 0; j < sequence[i].length; j++) {
                                sequence[i][j].play();
                            }

                            await this.sleep(durations[i] * 1000);
                            for (var j = 0; j < sequence[i].length; j++) {
                                sequence[i][j].stop();
                            }
                        }
                    } else {
                        for (var i = 0; i < sequence.length; i++) {
                            sequence[i].play();
                            await this.sleep(durations[i]*1000);
                            sequence[i].stop();
                        }
                    }
                },

                initialise: function() {
                    this.sleep = function(milliseconds) {
                        return new Promise(resolve => setTimeout(resolve, milliseconds))
                    };

                    this.sounds = {
                        'A3' : new Howl({ src: ['App/aud/A3.wav'], volume: 0.4}),
                        'A4' : new Howl({ src: ['App/aud/A4.wav'], volume: 0.4}),
                        'B-3' : new Howl({ src: ['App/aud/B-3.wav'], volume: 0.4}),
                        'B-4' : new Howl({ src: ['App/aud/B-4.wav'], volume: 0.4}),
                        'B3' : new Howl({ src: ['App/aud/B3.wav'], volume: 0.4}),
                        'B4' : new Howl({ src: ['App/aud/B4.wav'], volume: 0.4}),
                        'C3' : new Howl({ src: ['App/aud/C3.wav'], volume: 0.4}),
                        'C4' : new Howl({ src: ['App/aud/C4.wav'], volume: 0.4}),
                        'CS3' : new Howl({ src: ['App/aud/CS3.wav'], volume: 0.4}),
                        'CS4' : new Howl({ src: ['App/aud/CS4.wav'], volume: 0.4}),
                        'D3' : new Howl({ src: ['App/aud/D3.wav'], volume: 0.4}),
                        'D4' : new Howl({ src: ['App/aud/D4.wav'], volume: 0.4}),
                        'E-3' : new Howl({ src: ['App/aud/E-3.wav'], volume: 0.4}),
                        'E-4' : new Howl({ src: ['App/aud/E-4.wav'], volume: 0.4}),
                        'E3' : new Howl({ src: ['App/aud/E3.wav'], volume: 0.4}),
                        'E4' : new Howl({ src: ['App/aud/E4.wav'], volume: 0.4}),
                        'F3' : new Howl({ src: ['App/aud/F3.wav'], volume: 0.4}),
                        'F4' : new Howl({ src: ['App/aud/F4.wav'], volume: 0.4}),
                        'FS3' : new Howl({ src: ['App/aud/FS3.wav'], volume: 0.4}),
                        'FS4' : new Howl({ src: ['App/aud/FS4.wav'], volume: 0.4}),
                        'G3' : new Howl({ src: ['App/aud/G3.wav'], volume: 0.4}),
                        'G4' : new Howl({ src: ['App/aud/G4.wav'], volume: 0.4}),
                        'GS3' : new Howl({ src: ['App/aud/GS3.wav'], volume: 0.4}),
                        'GS4' : new Howl({ src: ['App/aud/GS4.wav'], volume: 0.4}),
                    };
                },
            }
    }]);
