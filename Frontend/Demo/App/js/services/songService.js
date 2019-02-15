angular.module("mixTapeApp")
    .factory("songService", ["globalSettings", "utilsService", "graphicsEngineService", "soundService", "renderService",
        function(globalSettings, utilsService, graphicsEngineService, soundService, renderService) {
            function readMelody() {
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
                        var pitchType = globalSettings.pitchAlterations[i];
                        var pitchFileMod = "";
                        if (pitchType == "Sharp"){
                            pitchFileMod = "#";
                        }
                        if(pitchType == "Flat"){
                            pitchFileMod = "-";
                        }
                        var pitch = globalSettings.trebleStaff[(diff * -1) + 3];
                        var fileString = utilsService.flatSharpExceptions(pitch,pitchFileMod);
                        melody.push(fileString);
                    }
                }
                return melody;
            };

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
                req.open("POST","http://" + hostname + ":8081/chord_progressions");
                req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                req.onreadystatechange = function() {
                    var chords = JSON.parse(req.response);
                    console.log(chords);

                    callback(chords);
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
                    // TODO: Ideally we can pass the two below functions as args
                    renderService.clearChords();
                    renderService.addChords(this.chords);
                },


                updateChords: function() {
                    if (this.melody != []) {
                        requestChords(this.melody, this.melodyDurations, this.hostname,
                            this.getChordsCallback);
                    }
                },

                updateMelody: function() {
                    this.melody = readMelody();
                    this.melodyDurations = graphicsEngineService.durations;
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

                initialise: function(hostname) {
                    soundService.initialise();
                    this.hostname = hostname;
                    this.chords = [];
                    this.melody = [];
                    this.melodyDurations = [];
                    this.chordDurations = [];
                },
            }
    }]);
