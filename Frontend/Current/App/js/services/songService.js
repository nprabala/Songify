angular.module("mixTapeApp")
    .factory("songService", ["globalSettings", "utilsService", "soundService",
        function(globalSettings, utilsService, soundService) {
            return {

                requestChords: function(callback) {
                    var toSend = [];
                    for (var i = 0; i < this.melody.length; i++){
                        if (this.melody[i] != "Empty") {
                            if (this.melody[i]["note"].length == 3) {
                                toSend.push({"note":this.melody[i]["note"].substr(0, 2), "duration":this.melody[i]["duration"]});
                            }
                            else {
                                toSend.push({"note":this.melody[i]["note"].charAt(0), "duration":this.melody[i]["duration"]});
                            }
                        }
                    }

                    // just call callback and return
                    if (toSend.length == 0) {
                        callback();
                        return;
                    }

                    var req = new XMLHttpRequest();
                    req.open("POST","http://" + utilsService.getHostname() + ":8081/chord_progressions");
                    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    req.onreadystatechange = () => {

                        // TODO: checking for 200 still doesn't deal with error
                        if (req.status == 200) {
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

                            // update sounds
                            soundService.updateChords(compiledChords, compiledDurations);
                            callback();
                        }
                    }
                    req.send(JSON.stringify(toSend));
                },

                editMelody: function(index, note) {
                    this.melody[index] = note;
                },

                updateMelody: function() {
                    var compiledMelody = [];
                    var compiledDurations = [];
                    for (var j = 0; j < this.melody.length; j++){
                        if (this.melody[j] != "Empty"){
                            compiledMelody.push(this.melody[j]["note"]);
                            compiledDurations.push(this.melody[j]["duration"])
                        }
                    }

                    soundService.updateMelody(compiledMelody, compiledDurations);
                },

                getChords: function() {
                    return this.chords;
                },

                getMelody: function() {
                    return this.melody;
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
                    this.clearMelody();
                    this.chords = [];
                    soundService.clearSounds();
                },

                clearMelody: function() {
                    for(var i = 0; i < 1/(globalSettings.noteRadius*2); i++){
                        this.melody[i] = "Empty";
                    }
                },

                initialise: function() {
                    soundService.initialise();

                    this.chords = [];
                    this.melody = [];
                    for(var i = 0; i < 1/(globalSettings.noteRadius*2); i++){
                        this.melody.push("Empty");
                    }
                },
            }
    }]);
