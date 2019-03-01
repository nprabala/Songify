angular.module("mixTapeApp")
.factory("scoreService", ["globalSettings", "utilsService",
function(globalSettings, utilsService) {

    function setupRenderer(score) {
        var renderer = new Vex.Flow.Renderer(score, Vex.Flow.Renderer.Backends.SVG);
        renderer.resize(window.innerWidth, globalSettings.SCORE_HEIGHT);
        return renderer;
    }

    function setupContext(renderer) {
        var context = renderer.getContext();
        context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");
        return context;
    }

    function drawStave(notes, context, clef) {
        var stave = new Vex.Flow.Stave(0, 0, window.innerWidth);
        stave.addClef(clef).addKeySignature('C');
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
    function newStaveNote(notes, dur, clef) {
        return new Vex.Flow.StaveNote({clef: clef, keys: notes, duration: dur });
    }

    function buildMelodyNotes(melody) {
        var notes = [];

        for (var j = 0; j < melody.length; j++){
            if (melody[j] != globalSettings.EMPTY_NOTE){
                note = pitchWrapper(melody[j]["note"]);
                dur = melody[j]["duration"];
                if (note.includes('#') || note.includes('b')) {
                    var mod = note.substring(1, 2);
                    notes.push(newStaveNote([note], durationMap(dur, false), globalSettings.clefType.TREBLE)
                    .addAccidental(0, new Vex.Flow.Accidental(mod)));
                } else {
                    notes.push(newStaveNote([note], durationMap(dur, false), globalSettings.clefType.TREBLE));
                }
            }
        }

        return notes;
    }

    // whether this is a common duration note (16th, 8th, quarter, half, whole)
    function isDurationNote(dur) {
        return (dur == 0.25 || dur == 0.5 || dur == 1 || dur == 2 || dur == 4)
    }

    function sortCompare(one, two) {
        var onePitch = globalSettings.notesEnum[one[0]];
        var oneMod = one.length > 1 ? globalSettings.pitchModEnum[one[1]]
                                    : globalSettings.pitchModEnum[''];

        var twoPitch = globalSettings.notesEnum[two[0]]
        var twoMod = two.length > 1 ? globalSettings.pitchModEnum[two[1]]
                                    : globalSettings.pitchModEnum[''];

        if (onePitch > twoPitch) {
            return 1;
        } else if (onePitch < twoPitch) {
            return -1;
        } else if (oneMod > twoMod) {
            return 1;
        } else {
            return -1;
        }
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
                isRest = true;
                notes.push("E/3");
            } else {
                // TODO: remove convert to set after we remove duplicates in model
                var splitChord = Array.from(new Set(inputChords[j]["chord"].split(".")));
                splitChord.sort(sortCompare);

                for (var i = 0; i < splitChord.length; i++) {
                    var note = pitchWrapper(splitChord[i] + globalSettings.CHORDS_OCTAVE);
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
                    chords.push(newStaveNote(notes, durationMap(duration, isRest),
                                globalSettings.clefType.BASS))
                    totalNotes+=1;
                } else {
                    var remainder = duration;
                    if (duration < 1) {
                        remainder = duration - 0.5;
                        chords.push(newStaveNote(notes, durationMap(0.5, isRest),
                                    globalSettings.clefType.BASS))
                    } else if (duration < 2) {
                        remainder = duration - 1;
                        chords.push(newStaveNote(notes, durationMap(1, isRest),
                                    globalSettings.clefType.BASS))
                    } else if (duration < 4) {
                        remainder = duration - 2;
                        chords.push(newStaveNote(notes, durationMap(2, isRest),
                                    globalSettings.clefType.BASS))
                    } else {
                        remainder = duration - 4;
                        chords.push(newStaveNote(notes, durationMap(4, isRest),
                                    globalSettings.clefType.BASS))
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

            // open group ... group used to easily remove score
            this.melodyGroup = this.melodyContext.openGroup();
            this.chordGroup = this.chordContext.openGroup();

            var melody = buildMelodyNotes(melody);
            var chordsReturn = buildChordsNotes(inputChords);
            var chords = chordsReturn[0];
            var ties = chordsReturn[1];

            drawStave(melody, this.melodyContext, globalSettings.clefType.TREBLE);
            drawStave(chords, this.chordContext, globalSettings.clefType.BASS);
            ties.forEach((t) => {t.setContext(this.chordContext).draw()})

            // close group
            this.melodyContext.closeGroup();
            this.chordContext.closeGroup();
        },

        resizeDisplay: function(width) {
            this.melodyRenderer.resize(width, globalSettings.SCORE_HEIGHT);
            this.chordRenderer.resize(width, globalSettings.SCORE_HEIGHT);
        },

        initialise: function(melodyScore, chordScore) {
            this.melodyRenderer = setupRenderer(melodyScore);
            this.chordRenderer = setupRenderer(chordScore);

            this.melodyContext = setupContext(this.melodyRenderer);
            this.chordContext = setupContext(this.chordRenderer);

            this.melodyGroup = null;
            this.chordGroup = null;
        },
    }
}]);
