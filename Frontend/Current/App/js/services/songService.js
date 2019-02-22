angular.module("mixTapeApp")
    .factory("songService", ["globalSettings", "utilsService", "soundService",
        function(globalSettings, utilsService, soundService) {
            return {

                requestChords: function() {
                    if (this.melody == []) return;

                    var toSend = [];
                    for (var i = 0; i < this.melody.length; i++){
                        if (this.melody[i] != "Empty") {
                            console.log(this.melody[i]["note"])
                            if (this.melody[i]["note"].length == 3) {
                                toSend.push({"note":this.melody[i]["note"].substr(0, 2), "duration":this.melody[i]["duration"]});
                            }
                            else {
                                toSend.push({"note":this.melody[i]["note"].charAt(0), "duration":this.melody[i]["duration"]});
                            }
                        }
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

                            // update chords on display
                            // TODO: Reconfigure to work with div format
                            // renderService.clearChords();
                            // renderService.addChords(this.chords);
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

                requestTranscriptionMelody: function(blob) {
                    this.playButton.disabled = true;
                    var req = new XMLHttpRequest();
                    req.open("POST","http://" + utilsService.getHostname() + ":8081/melody_transcription");
                    req.onreadystatechange = () => {
                        var notes = JSON.parse(req.response);
                        console.log(notes);

                        this.clearMelody();
                        for(var i = 0; i < 1/(globalSettings.noteRadius*2) && i < notes.length; i++) {
                            notes[i]["note"] = utilsService.flatSharpExceptionsWrapper(notes[i]["note"]);
                            this.editMelody(i, notes[i]);
                        }
                        this.updateMelody();

                        // TODO: display notes on staff

                        this.playButton.disabled = false;
                    }

                    var toSend = new File([blob], "filename.wav", {type: 'audio/wav'});
                    req.send(toSend);
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

                initialise: function(playButton) {
                    soundService.initialise();

                    this.playButton = playButton;

                    this.chords = [];
                    this.melody = [];
                    for(var i = 0; i < 1/(globalSettings.noteRadius*2); i++){
                        this.melody.push("Empty");
                    }
                },
            }
    }]);
