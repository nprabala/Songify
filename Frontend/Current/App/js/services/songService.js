angular.module("mixTapeApp")
    .factory("songService", ["globalSettings", "utilsService", "soundService", "renderService",
        function(globalSettings, utilsService, soundService, renderService) {
            function requestChords(notes, durations, hostname, callback) {
                var melody = [];
                for (var i = 0; i < notes.length; i++){
                    if (notes[i].length == 3) {
                        melody.push({"note":notes[i].substr(0, 2), "duration":durations[i]});
                    }
                    else {
                        melody.push({"note":notes[i].charAt(0), "duration":durations[i]});
                    }
                }
                console.log("chords for melody: " + JSON.stringify(melody));
                var req = new XMLHttpRequest();
                req.open("POST","http://" + utilsService.getHostname() + ":8081/chord_progressions");
                req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                req.onreadystatechange = function() {
                    if (req.status == 200) {
                        console.log(req.response);
                        var chords = JSON.parse(req.response);
                        console.log(chords);

                        callback(chords);
                    }
                }
                req.send(JSON.stringify(melody));
            };



            return {
                getChordsCallback: function(chords) {
                    this.chords = chords;

                    // update durations
                    this.chordDurations = [];
                    for (var i = 0; i < chords.length; i++) {
                        var duration = chords[i]["duration"];
                        this.chordDurations.push(duration);
                    }

                    // update sounds
                    soundService.updateChords(this.chords, this.chordDurations);

                    // update chords on display
                    // TODO: Reconfigure to work with div format
                    // renderService.clearChords();
                    // renderService.addChords(this.chords);
                },


                updateChords: function() {
                    if (this.melody != []) {
                        requestChords(this.melody, this.melodyDurations, this.hostname,
                            this.getChordsCallback);
                    }
                },

                updateMelody: function(melody, durations) {
                    this.melody = melody;
                    this.melodyDurations = durations;
                    soundService.updateMelody(this.melody, this.melodyDurations);
                },

                getMelody: function() {
                    return this.melody;
                },

                getMelodyDurations: function() {
                    return this.melodyDurations;
                },

                getChords: function() {
                    return this.chords;
                },

                getChordsDurations: function() {
                    return this.chordDurations;
                },

                playMelody: function() {
                    if (this.melody != []) {
                        soundService.playMelody();
                    }
                },

                playChords: function() {
                    if (this.chords != []) {
                        soundService.playChords();
                    }
                },


                clearSong: function() {
                    this.chords = [];
                    this.melody = [];
                    this.melodyDurations = [];
                    this.chordDurations = [];
                    soundService.clearSounds();
                },

                initialise: function() {
                    soundService.initialise();
                    this.chords = [];
                    this.melody = [];
                    this.melodyDurations = [];
                    this.chordDurations = [];
                },
            }
    }]);
