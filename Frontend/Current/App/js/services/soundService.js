angular.module("mixTapeApp")
.factory("soundService", ["globalSettings",

    function(globalSettings) {
        const sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(resolve, milliseconds))
        };

        function cleanNote(note) {
            if (note.substr(1,1) == '#') {
                return note.substr(0,1) + 'S' + note.substr(2,2);
            } else {
                return note;
            }
        }

        return {
            updateMelody: function(notes, duration) {
                this.melody = [];
                for (var i = 0; i < notes.length; i++) {
                    var note = cleanNote(notes[i]);
                    this.melody.push(this.sounds[note]);
                }
                this.melodyDuration = duration;
            },

            updateChords: function(chords, duration) {
                this.chords = [];
                for (var i = 0; i < chords.length; i++) {
                    var chordObj = [];

                    if (chords[i][0] == "") {
                        chordObj.push(this.sounds[''])
                    } else {
                        for (var j = 0; j < chords[i].length; j++) {
                            var note = cleanNote(chords[i][j]
                                        + globalSettings.CHORDS_OCTAVE);
                            chordObj.push(this.sounds[note]);
                            chordObj[j].volume(0.2); // quieter than melody
                        }
                    }

                    this.chords.push(chordObj);
                }

                this.chordsDuration = duration;
            },

            playChords: async function() {
                for (var i = 0; i < this.chords.length; i++) {
                    for (var j = 0; j < this.chords[i].length; j++) {
                        this.chords[i][j].play();
                    }

                    await sleep(this.chordsDuration[i] * 1000);
                    for (var j = 0; j < this.chords[i].length; j++) {
                        this.chords[i][j].stop();
                    }
                }
            },

            playMelody: async function() {
                for (var i = 0; i < this.melody.length; i++) {
                    this.melody[i].play();
                    await sleep(this.melodyDuration[i]*1000);
                    this.melody[i].stop();
                }
            },

            clearSounds: function() {
                this.melody = [];
                this.chords = [];
                this.melodyDuration = [];
                this.chordsDuration = [];
            },

            initialise: function() {
                this.melody = [];
                this.chords = [];
                this.melodyDuration = [];
                this.chordsDuration = [];
                this.sounds = {
                    'A5' : new Howl({ src: ['App/aud/A5.wav'], volume: 0.4}),
                    'A4' : new Howl({ src: ['App/aud/A4.wav'], volume: 0.4}),
                    'A3' : new Howl({ src: ['App/aud/A3.wav'], volume: 0.4}),
                    'B-5' : new Howl({ src: ['App/aud/B-5.wav'], volume: 0.4}),
                    'B-4' : new Howl({ src: ['App/aud/B-4.wav'], volume: 0.4}),
                    'B-3' : new Howl({ src: ['App/aud/B-3.wav'], volume: 0.4}),
                    'B5' : new Howl({ src: ['App/aud/B5.wav'], volume: 0.4}),
                    'B4' : new Howl({ src: ['App/aud/B4.wav'], volume: 0.4}),
                    'B3' : new Howl({ src: ['App/aud/B3.wav'], volume: 0.4}),
                    'C6' : new Howl({ src: ['App/aud/C6.wav'], volume: 0.4}),
                    'C5' : new Howl({ src: ['App/aud/C5.wav'], volume: 0.4}),
                    'C4' : new Howl({ src: ['App/aud/C4.wav'], volume: 0.4}),
                    'C3' : new Howl({ src: ['App/aud/C3.wav'], volume: 0.4}),
                    'CS5' : new Howl({ src: ['App/aud/CS5.wav'], volume: 0.4}),
                    'CS4' : new Howl({ src: ['App/aud/CS4.wav'], volume: 0.4}),
                    'CS3' : new Howl({ src: ['App/aud/CS3.wav'], volume: 0.4}),
                    'D5' : new Howl({ src: ['App/aud/D5.wav'], volume: 0.4}),
                    'D4' : new Howl({ src: ['App/aud/D4.wav'], volume: 0.4}),
                    'D3' : new Howl({ src: ['App/aud/D3.wav'], volume: 0.4}),
                    'E-5' : new Howl({ src: ['App/aud/E-5.wav'], volume: 0.4}),
                    'E-4' : new Howl({ src: ['App/aud/E-4.wav'], volume: 0.4}),
                    'E-3' : new Howl({ src: ['App/aud/E-3.wav'], volume: 0.4}),
                    'E5' : new Howl({ src: ['App/aud/E5.wav'], volume: 0.4}),
                    'E4' : new Howl({ src: ['App/aud/E4.wav'], volume: 0.4}),
                    'E3' : new Howl({ src: ['App/aud/E3.wav'], volume: 0.4}),
                    'F5' : new Howl({ src: ['App/aud/F5.wav'], volume: 0.4}),
                    'F4' : new Howl({ src: ['App/aud/F4.wav'], volume: 0.4}),
                    'F3' : new Howl({ src: ['App/aud/F3.wav'], volume: 0.4}),
                    'FS5' : new Howl({ src: ['App/aud/FS5.wav'], volume: 0.4}),
                    'FS4' : new Howl({ src: ['App/aud/FS4.wav'], volume: 0.4}),
                    'FS3' : new Howl({ src: ['App/aud/FS3.wav'], volume: 0.4}),
                    'G5' : new Howl({ src: ['App/aud/G5.wav'], volume: 0.4}),
                    'G4' : new Howl({ src: ['App/aud/G4.wav'], volume: 0.4}),
                    'G3' : new Howl({ src: ['App/aud/G3.wav'], volume: 0.4}),
                    'GS5' : new Howl({ src: ['App/aud/GS5.wav'], volume: 0.4}),
                    'GS4' : new Howl({ src: ['App/aud/GS4.wav'], volume: 0.4}),
                    'GS3' : new Howl({ src: ['App/aud/GS3.wav'], volume: 0.4}),

                    // note for empty string doesn't matter, just has to be muted
                    '' : new Howl({ src: ['App/aud/GS4.wav'], volume: 0.4, mute:true}),
                };
            },
        }
    }]);
