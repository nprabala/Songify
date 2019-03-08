angular.module("mixTapeApp")
.factory("soundService", ["globalSettings","utilsService",

    function(globalSettings, utilsService) {
        const sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(resolve, milliseconds))
        };

        function cleanNote(note) {
            // for example, replace Cb with B
            note =  utilsService.flatSharpExceptions(note);

            // replace # with S since can't have in file name
            if (note.includes("#")) {
                note = note.substr(0,1) + 'S' + note.substr(2,2);
            }

            return note;
        }

        function getSounds(volume) {
            return {
                'A5' : new Howl({ src: ['App/aud/A5.wav'], volume: volume}),
                'A4' : new Howl({ src: ['App/aud/A4.wav'], volume: volume}),
                'A3' : new Howl({ src: ['App/aud/A3.wav'], volume: volume}),
                'B-5' : new Howl({ src: ['App/aud/B-5.wav'], volume: volume}),
                'B-4' : new Howl({ src: ['App/aud/B-4.wav'], volume: volume}),
                'B-3' : new Howl({ src: ['App/aud/B-3.wav'], volume: volume}),
                'B5' : new Howl({ src: ['App/aud/B5.wav'], volume: volume}),
                'B4' : new Howl({ src: ['App/aud/B4.wav'], volume: volume}),
                'B3' : new Howl({ src: ['App/aud/B3.wav'], volume: volume}),
                 'B2' : new Howl({ src: ['App/aud/B2.wav'], volume: volume}),
                'C6' : new Howl({ src: ['App/aud/C6.wav'], volume: volume}),
                'C5' : new Howl({ src: ['App/aud/C5.wav'], volume: volume}),
                'C4' : new Howl({ src: ['App/aud/C4.wav'], volume: volume}),
                'C3' : new Howl({ src: ['App/aud/C3.wav'], volume: volume}),
                'CS6' : new Howl({ src: ['App/aud/CS6.wav'], volume: volume}),
                'CS5' : new Howl({ src: ['App/aud/CS5.wav'], volume: volume}),
                'CS4' : new Howl({ src: ['App/aud/CS4.wav'], volume: volume}),
                'CS3' : new Howl({ src: ['App/aud/CS3.wav'], volume: volume}),
                'D5' : new Howl({ src: ['App/aud/D5.wav'], volume: volume}),
                'D4' : new Howl({ src: ['App/aud/D4.wav'], volume: volume}),
                'D3' : new Howl({ src: ['App/aud/D3.wav'], volume: volume}),
                'E-5' : new Howl({ src: ['App/aud/E-5.wav'], volume: volume}),
                'E-4' : new Howl({ src: ['App/aud/E-4.wav'], volume: volume}),
                'E-3' : new Howl({ src: ['App/aud/E-3.wav'], volume: volume}),
                'E5' : new Howl({ src: ['App/aud/E5.wav'], volume: volume}),
                'E4' : new Howl({ src: ['App/aud/E4.wav'], volume: volume}),
                'E3' : new Howl({ src: ['App/aud/E3.wav'], volume: volume}),
                'F5' : new Howl({ src: ['App/aud/F5.wav'], volume: volume}),
                'F4' : new Howl({ src: ['App/aud/F4.wav'], volume: volume}),
                'F3' : new Howl({ src: ['App/aud/F3.wav'], volume: volume}),
                'FS5' : new Howl({ src: ['App/aud/FS5.wav'], volume: volume}),
                'FS4' : new Howl({ src: ['App/aud/FS4.wav'], volume: volume}),
                'FS3' : new Howl({ src: ['App/aud/FS3.wav'], volume: volume}),
                'G5' : new Howl({ src: ['App/aud/G5.wav'], volume: volume}),
                'G4' : new Howl({ src: ['App/aud/G4.wav'], volume: volume}),
                'G3' : new Howl({ src: ['App/aud/G3.wav'], volume: volume}),
                'GS5' : new Howl({ src: ['App/aud/GS5.wav'], volume: volume}),
                'GS4' : new Howl({ src: ['App/aud/GS4.wav'], volume: volume}),
                'GS3' : new Howl({ src: ['App/aud/GS3.wav'], volume: volume}),

                // note for empty string doesn't matter, just has to be muted
                '' : new Howl({ src: ['App/aud/GS4.wav'], volume: volume, mute:true}),
            };
        }

        return {
            updateMelody: function(notes, duration) {
                this.melody = [];
                for (var i = 0; i < notes.length; i++) {
                    var note = cleanNote(notes[i]);
                    this.melody.push(this.allMelodyNotes[note]);
                }
                this.melodyDuration = duration;
            },

            updateChords: function(chords, duration) {
                this.chords = [];
                for (var i = 0; i < chords.length; i++) {
                    var chordObj = [];

                    if (chords[i][0] == "") {
                        chordObj.push(this.allChordNotes[''])
                    } else {
                        for (var j = 0; j < chords[i].length; j++) {
                            var note = cleanNote(chords[i][j] + globalSettings.CHORDS_OCTAVE);
                            chordObj.push(this.allChordNotes[note]);
                            chordObj[j].volume(globalSettings.CHORD_VOLUME);
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

            playNote: async function(note) {
                var note = cleanNote(note);
                var howl = this.allSingleNotes[note];

                howl.play();
                await sleep(250);
                howl.stop();
            },

            initialise: function() {
                this.melody = [];
                this.chords = [];
                this.melodyDuration = [];
                this.chordsDuration = [];
                this.allMelodyNotes = getSounds(globalSettings.MELODY_VOLUME);
                this.allChordNotes = getSounds(globalSettings.CHORD_VOLUME);
                this.allSingleNotes = getSounds(globalSettings.MELODY_VOLUME);
            },
        }
    }]);
