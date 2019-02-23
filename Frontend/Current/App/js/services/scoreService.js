angular.module("mixTapeApp")
    .factory("scoreService", ["globalSettings", "utilsService",
        function(globalSettings, utilsService) {
            function setupRenderer(score) {
                var renderer = new Vex.Flow.Renderer(document.getElementById(score),
                                                        Vex.Flow.Renderer.Backends.SVG);
                renderer.resize(window.innerWidth, globalSettings.scoreHeight);
                return renderer;
            }

            function setupContext(renderer) {
                var context = renderer.getContext();
                context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");
                return context;
            }

            function drawStave(notes, context) {
                var stave = new Vex.Flow.Stave(0, 0, window.innerWidth);
                stave.addClef("treble").addKeySignature('C');
                stave.setContext(context).draw();

                var voice = new Vex.Flow.Voice().setMode('soft');
                voice.addTickables(notes);

                var beams = Vex.Flow.Beam.generateBeams(notes);
                Vex.Flow.Formatter.FormatAndDraw(context, stave, notes);
                beams.forEach((b) => {b.setContext(context).draw()})
            }

            // format duration for vexflow
            function durationMap(dur, isRest) {
                var toReturn = '';
                switch(dur) {
                    case 0.25:
                        toReturn += '16';
                        break;
                    case 0.5:
                        toReturn += '8d';
                        break;
                    case 1:
                        toReturn += 'q';
                        break;
                    case 2:
                        toReturn += 'h';
                        break;
                    case 4:
                        toReturn += 'w';
                        break;
                    default:
                        toReturn += 'q';
                }

                if (isRest) {
                    return toReturn + 'r';
                } else {
                    return toReturn;
                }
            }

            // format pitch for vexflow
            function pitchWrapper(pitch) {
                var len = pitch.length;

                if (pitch.includes("#")) {
                    return pitch.substring(0, 2) + '/' + pitch.substring(2, len);
                } else if (pitch.includes("-")) {
                    return pitch.substring(0, 1) + 'b/' + pitch.substring(2, len);
                } else {
                    return pitch.substring(0, 1) + '/' + pitch.substring(1, len);
                }

            }

            // cleaner way to create new stave note
            function newStaveNote(notes, dur) {
                return new Vex.Flow.StaveNote({clef: "treble", keys: notes, duration: dur });
            }

            function buildMelodyNotes(melody) {
                var notes = [];

                for (var j = 0; j < melody.length; j++){
                    if (melody[j] != "Empty"){
                        note = pitchWrapper(melody[j]["note"]);
                        dur = melody[j]["duration"];
                        if (note.includes('#') || note.includes('b')) {
                            var mod = note.substring(1, 2);
                            notes.push(newStaveNote([note], durationMap(dur, false))
                                        .addAccidental(0, new Vex.Flow.Accidental(mod)));
                        } else {
                            notes.push(newStaveNote([note], durationMap(dur, false)));
                        }
                    }
                }

                return notes;
            }

            function isDurationNote(dur) {
                return (dur == 0.25 || dur == 0.5 || dur == 1 || dur == 2 || dur == 4)
            }

            function buildChordsNotes(inputChords) {
                var chords = [];
                var needTies = [];

                for (var j = 0; j < inputChords.length; j++){
                    var dur = inputChords[j]["duration"]
                    var notes = [];
                    var isRest = false;
                    var needAccidentals = [];
                    var totalNotes = 0;

                    if (inputChords[j]["chord"] == '') {
                        console.log("REST");
                        isRest = true;
                        notes.push("B/4");
                    } else {
                        // TODO: remove convert to set after we remove duplicates in model
                        var splitChord = Array.from(new Set(inputChords[j]["chord"].split(".")));

                        for (var i = 0; i < splitChord.length; i++) {
                            var note = pitchWrapper(splitChord[i] + '4');
                            if (note.includes('b') || note.includes('#')) {
                                needAccidentals.push([i, note.substring(1, 2)]);
                            }
                            notes.push(note);
                        }
                    }

                    // sometimes note durations have to be constructed by other
                    // notes (ie 3.5 takes half note, quater note, and eighth note)
                    var makeDuration = function(duration) {
                        if (duration == 0) return;

                        if (isDurationNote(duration)) {
                            chords.push(newStaveNote(notes, durationMap(duration, isRest)))
                            totalNotes+=1;
                        } else {
                            var remainder = duration;
                            if (duration < 1) {
                                remainder = duration - 0.5;
                                chords.push(newStaveNote(notes, durationMap(0.5, isRest)))
                            } else if (duration < 2) {
                                remainder = duration - 1;
                                chords.push(newStaveNote(notes, durationMap(1, isRest)))
                            } else if (duration < 4) {
                                remainder = duration - 2;
                                chords.push(newStaveNote(notes, durationMap(2, isRest)))
                            } else {
                                remainder = duration - 4;
                                chords.push(newStaveNote(notes, durationMap(4, isRest)))
                            }

                            totalNotes+=1;
                            makeDuration(remainder);
                        }
                    }

                    makeDuration(dur);

                    // don't tie rests and only tie if there is more than 1 chord structure involved
                    if (!isRest && totalNotes > 1) {
                        for (var i = 1; i < totalNotes; i++) {
                            var startNote = chords.length - totalNotes + i;
                            var endNote = chords.length - totalNotes + i - 1;
                            needTies.push([startNote, endNote]);
                        }
                    }

                    // add flats/sharps to be rendered
                    for (var k = 0; k < needAccidentals.length; k++) {
                        var noteIndex = needAccidentals[k][0];
                        var mod = needAccidentals[k][1];

                        var start = chords.length - totalNotes;
                        for (var i = 0; i < totalNotes; i++) {
                            var cur = start + i;
                            chords[cur].addAccidental(noteIndex, new Vex.Flow.Accidental(mod));
                        }
                    }

                }

                // add ties for notes
                var ties = [];
                for (var i = 0; i < needTies.length; i++) {
                    ties.push(new Vex.Flow.StaveTie({
                        first_note: chords[needTies[i][0]],
                        last_note: chords[needTies[i][1]],
                        first_indices: [0],
                        last_indices: [0]
                    }));
                }

                return [chords, ties];
            }

            return {
                drawScore: function(melody, inputChords) {
                    if (this.melodyGroup != null) {
                        this.melodyContext.svg.removeChild(this.melodyGroup);
                        this.chordContext.svg.removeChild(this.chordGroup);
                    }

                    // open group
                    this.melodyGroup = this.melodyContext.openGroup();
                    this.chordGroup = this.chordContext.openGroup();

                    var melody = buildMelodyNotes(melody);
                    var chordsReturn = buildChordsNotes(inputChords);
                    var chords = chordsReturn[0];
                    var ties = chordsReturn[1];

                    drawStave(melody, this.melodyContext);
                    drawStave(chords, this.chordContext);
                    ties.forEach((t) => {t.setContext(this.chordContext).draw()})

                    // close group
                    this.melodyContext.closeGroup();
                    this.chordContext.closeGroup();
                },

                resizeDisplay: function(width) {
                    this.melodyRenderer.resize(width, globalSettings.scoreHeight);
                    this.chordRenderer.resize(width, globalSettings.scoreHeight);
                },

                initialise: function() {
                    this.melodyRenderer = setupRenderer("scoreMelody");
                    this.chordRenderer = setupRenderer("scoreChords");

                    this.melodyContext = setupContext(this.melodyRenderer);
                    this.chordContext = setupContext(this.chordRenderer);

                    this.melodyGroup = null;
                    this.chordGroup = null;
                },
            }
    }]);
