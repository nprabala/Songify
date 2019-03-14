angular.module("songifyApp")
.factory("songService", ["globalSettings", "utilsService", "soundService",
function(globalSettings, utilsService, soundService) {

    return {
        /* Request chords from the chord progressions server. */
        requestChords: function(callback) {
            var toSend = [];

            /* Gather all notes to send and format for JSON */
            for (var i = 0; i < this.melody.length; i++){
                if (this.melody[i] != globalSettings.EMPTY_NOTE) {
                    var note = utilsService.flatSharpExceptions(this.melody[i]["note"]);
                    var dur = this.melody[i]["duration"];

                    if (note.length == 3) {
                        toSend.push({"note": note.substr(0, 2), "duration": dur});
                    } else {
                        toSend.push({"note": note.charAt(0), "duration": dur});
                    }
                }
            }

            // If nothing to send, just call callback and return
            if (toSend.length == 0) {
                callback();
                return;
            }

            var req = new XMLHttpRequest();
            req.open("POST","http://" + this.hostName + ":8081/chord_progressions");
            req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            req.onreadystatechange = () => {
                // only parse if success
                if (req.readyState == 4 && req.status == 200) {
                    var chords = JSON.parse(req.response);
                    console.log(chords);
                    this.chords = chords;

                    var compiledChords = [];
                    var compiledDurations = [];
                    for (var i = 0; i < chords.length; i++) {
                        var splitChord = chords[i]["chord"].split(".");
                        compiledChords.push(splitChord);
                        compiledDurations.push(chords[i]["duration"]);
                    }

                    // update sounds with new chords
                    soundService.updateChords(compiledChords, compiledDurations);
                }

                // callback function for updating display/anything else
                // that needs to be done
                callback();
            }
            req.send(JSON.stringify(toSend));
        },

        /* Update the current melody at index with the note. Call soundService
        to also update the melody given the modified melody. */
        editMelody: function(index, note) {
            this.melody[index] = note;

            var compiledMelody = [];
            var compiledDurations = [];
            for (var j = 0; j < this.melody.length; j++){
                if (this.melody[j] != globalSettings.EMPTY_NOTE){
                    compiledMelody.push(this.melody[j]["note"]);
                    compiledDurations.push(this.melody[j]["duration"])
                }
            }

            soundService.updateMelody(compiledMelody, compiledDurations);
        },

        /* Getters. */

        getChords: function() {
            return this.chords;
        },
        getMelody: function() {
            return this.melody;
        },


        /* Methods for playing melody, chords, and single note. */

        playMelody: function(bpm) {
            if (this.melody != []) {
                soundService.playMelody(bpm);
            }
        },
        playChords: function(bpm) {
            if (this.chords != []) {
                soundService.playChords(bpm);
            }
        },
        playNote: function(note) {
            soundService.playNote(note);
        },


        /* Clears melody and chords. Also calls soundService
        to clear stored sounds. */
        clearSong: function() {
            this.clearMelody();
            this.chords = [];
            soundService.clearSounds();
        },

        /* Marks all melody indices with EMPTY_NOTE, effectively clearing
        the melody. */
        clearMelody: function() {
            for(var i = 0; i < 1/(globalSettings.NOTE_RADIUS*2); i++){
                this.melody[i] = globalSettings.EMPTY_NOTE;
            }
        },

        /* Method for initializing variables for this service. Loops through
        each possible melody index and adds EMPTY_NOTE to begin. */
        initialise: function(hostName) {
            this.hostName = hostName;
            soundService.initialise();

            this.chords = [];
            this.melody = [];

            // 1/(globalSettings.NOTE_RADIUS*2) is the number of notes that will
            // fit on the screen (i.e. total number of melody notes possible)
            for(var i = 0; i < 1/(globalSettings.NOTE_RADIUS*2); i++){
                this.melody.push(globalSettings.EMPTY_NOTE);
            }
        },
    }
}]);
