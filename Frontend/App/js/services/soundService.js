angular.module("songifyApp")
.factory("soundService", ["globalSettings","utilsService",

    function(globalSettings, utilsService) {

        /* Sleep function */
        const sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(resolve, milliseconds))
        };

        /* Replace uncommon notes with more common notes (Cb -> B for instance)
        since we have limited wav files. Also replaces '#' with 'S' since #
        not allowed in file name. */
        function cleanNote(note) {
            note =  utilsService.flatSharpExceptions(note);
            if (note.includes("#")) {
                note = note.substr(0,1) + 'S' + note.substr(2,2);
            }

            return note;
        }

        /* Returns a map from note to howl object for playing the note. */
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
            /* Update melody and melodyDuration to reflect the passed in
            parameters. */
            updateMelody: function(notes, duration) {
                this.melody = [];
                for (var i = 0; i < notes.length; i++) {
                    var note = cleanNote(notes[i]);
                    this.melody.push(this.allMelodyNotes[note]);
                }
                this.melodyDuration = duration;
            },

            /* Update chord and chordDuration to reflect the passed in
            parameters. */
            updateChords: function(chords, duration) {
                this.chords = [];
                for (var i = 0; i < chords.length; i++) {
                    var chordObj = [];

                    if (chords[i][0] == "") {
                        // empty chord
                        chordObj.push(this.allChordNotes[''])
                    } else {
                        // loop through each note in the chord
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

            /* Loop through chords and play with the specified duration. Use
            sleep function to sustain note for the duration and then stop it.
            Since chords are arrays containing individual notes, have to loop
            through chords and then the notes in each chord and call play on
            each note individually. */
            playChords: async function(bpm) {
                try {
                    for (var i = 0; i < this.chords.length; i++) {
                        for (var j = 0; j < this.chords[i].length; j++) {
                            this.chords[i][j].play();
                        }
                        
                         if (bpm === globalSettings.bpm.SLOW) {
                            await sleep(this.chordsDuration[i] * globalSettings.ONE_SEC);
                        } else {
                            await sleep(this.chordsDuration[i] * globalSettings.ONE_SEC / 2);
                        }

                        for (var j = 0; j < this.chords[i].length; j++) {
                            this.chords[i][j].stop();
                        }
                    }
                } catch(error) {
                    console.log(error);
                }
            },

            /* Loop through melody and play with the specified duration. Use
            sleep function to sustain note for the duration and then stop it. */
            playMelody: async function(bpm) {
                try {
                    for (var i = 0; i < this.melody.length; i++) {
                        this.melody[i].play();
                        
                        if (bpm === globalSettings.bpm.SLOW) {
                            await sleep(this.melodyDuration[i] * globalSettings.ONE_SEC);
                        } else {
                            await sleep(this.melodyDuration[i] * globalSettings.ONE_SEC / 2);
                        }
                        
                        this.melody[i].stop();
                    }
                } catch(error) {
                    console.log(error);
                }
            },

            /* Clears out the melody/chord variables.  */
            clearSounds: function() {
                this.melody = [];
                this.chords = [];
                this.melodyDuration = [];
                this.chordsDuration = [];
            },

            /* Play an individual note for NOTE_CLICK_PLAY_LENGTH duration. */
            playNote: async function(note) {
                var note = cleanNote(note);
                var howl = this.allSingleNotes[note];

                try {
                    howl.play();
                    await sleep(globalSettings.NOTE_CLICK_PLAY_DUR);
                    howl.stop();
                } catch(error) {
                    console.log(error);
                }
            },

            /* initialize variables for this service. Uses 3 different maps for
            the melody, chords, and click-staff-to-play notes. This is to prevent different
            voices from stopping notes for another voice. For instance, if melody plays
            A5 for 4 beats and the chords comes in 1 beat after the A5 starts and plays A5 for only
            1 beat, then it would stop both instances of the note. However, by having
            different maps (and knowing a voice - be that melody or chord - can
            only play a particular note once at a time) we prevent this from happening
            since they will each have their own version of the sound. The click-staff-to-play
            also gets its own sound for similar reasons. */
            initialise: function() {
                this.melody = [];
                this.chords = [];
                this.melodyDuration = [];
                this.chordsDuration = [];

                this.allMelodyNotes = getSounds(globalSettings.MELODY_VOLUME);
                this.allChordNotes = getSounds(globalSettings.CHORD_VOLUME);
                this.allSingleNotes = getSounds(globalSettings.MELODY_VOLUME);  // click-staff-to-play
            },
        }
    }]);
