angular.module("songifyApp")
.factory("scoreService", ["globalSettings", "utilsService",
function(globalSettings, utilsService) {

    /* Init renderer for vexflow using the id score. */
    function setupRenderer(score) {
        var renderer = new Vex.Flow.Renderer(score, Vex.Flow.Renderer.Backends.SVG);
        renderer.resize(window.innerWidth, globalSettings.SCORE_HEIGHT);
        return renderer;
    }

    /* Init context for the specified renderer. */
    function setupContext(renderer) {
        var context = renderer.getContext();
        context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");
        return context;
    }

    /* Draw a stave using the provided parameters. */
    function drawStave(notes, context, clef) {
        var stave = new Vex.Flow.Stave(0, 0, window.innerWidth);
        stave.addClef(clef).addKeySignature('C');
        stave.setContext(context).draw();

        var voice = new Vex.Flow.Voice().setMode('soft');
        voice.addTickables(notes);

        // connect nearby notes (a technicality for 8th and 16th notes)
        var beams = Vex.Flow.Beam.generateBeams(notes);
        Vex.Flow.Formatter.FormatAndDraw(context, stave, notes);
        beams.forEach((b) => {b.setContext(context).draw()})
    }

    /* Reformat dur for vexflow */
    function durationMap(dur, isRest) {
        var toReturn = '';
        switch(dur) {
            case globalSettings.noteDur.SIXTEENTH:
                toReturn += '16';
                break;
            case globalSettings.noteDur.EIGHTH:
                toReturn += '8d';
                break;
            case globalSettings.noteDur.QUARTER:
                toReturn += 'q';
                break;
            case globalSettings.noteDur.HALF:
                toReturn += 'h';
                break;
            case globalSettings.noteDur.WHOLE:
                toReturn += 'w';
                break;
            default:
                toReturn += 'q';
        }

        // if rest, add r to the duration string
        if (isRest) {
            return toReturn + 'r';
        } else {
            return toReturn;
        }
    }

    /* format pitch for vexflow */
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

    /* Wrapper for creating a new staveNote for vexflow*/
    function newStaveNote(notes, dur, clef) {
        return new Vex.Flow.StaveNote({clef: clef, keys: notes, duration: dur });
    }

    /* Take the melody and convert it to an array of notes readable by vexflow. */
    function buildMelodyNotes(melody) {
        var notes = [];

        for (var j = 0; j < melody.length; j++){
            // skip empty notes
            if (melody[j] != globalSettings.EMPTY_NOTE){
                note = pitchWrapper(melody[j]["note"]);
                dur = melody[j]["duration"];

                if (note.includes('#') || note.includes('b')) {
                    // have to add accidental to show the sharp/flat on the display
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

    /* whether this is a normal duration note
    (16th, 8th, quarter, half, whole) */
    function isDurationNote(dur) {
        return (dur == globalSettings.noteDur.SIXTEENTH
                || dur == globalSettings.noteDur.EIGHTH
                || dur == globalSettings.noteDur.QUARTER
                || dur == globalSettings.noteDur.HALF
                || dur == globalSettings.noteDur.WHOLE)
    }

    /* compare for music notes. Rank first by note
    and break ties by note pitch mod (sharp, flat, natural) using
    enums in globalSettings for rankings.  */
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

    /* Take the inputChords and convert it to an array that is readable
    by vexflow. */
    function buildChordsNotes(inputChords) {
        var chords = [];
        var needTies = [];                          // holds which notes need ties: (list of pairs: [first note, second note]
                                                    // where first needs tied to second)

        for (var j = 0; j < inputChords.length; j++){
            var dur = inputChords[j]["duration"]    // duration of this chord
            var notes = [];                         // array for the notes in this chord
            var isRest = false;                     // this chord is a rest
            var needAccidentals = [];               // which notes in the chord needs sharps/flats (list of pairs: [note, pitch mod])
            var totalNotes = 0;                     // number of note lengths needed to account for dur

            if (inputChords[j]["chord"] == '') {
                isRest = true;
                notes.push("E/3"); // push on a note that is located in the middle of the staff
            } else {
                // chord comes as C.E.G (for instance) and therefore needs to be split
                var splitChord = inputChords[j]["chord"].split(".");
                splitChord.sort(sortCompare);

                for (var i = 0; i < splitChord.length; i++) {
                    var note = pitchWrapper(splitChord[i] + globalSettings.CHORDS_OCTAVE);

                    // indicate that this note needs an accidental
                    if (note.includes('b') || note.includes('#')) {
                        needAccidentals.push([i, note.substring(1, 2)]);
                    }

                    notes.push(note);
                }
            }

            // sometimes note durations have to be constructed by other
            // notes (ie 3.5 takes half note, quarter note, and eighth note)
            var makeDuration = function(duration) {
                if (duration == 0) return; // base case

                // duration can be made by a note we have without remainder
                if (isDurationNote(duration)) {
                    chords.push(newStaveNote(notes, durationMap(duration, isRest),
                                globalSettings.clefType.BASS))
                    totalNotes+=1;

                // try to make duration with notes we have
                } else {
                    var remainder = duration;
                    if (duration < globalSettings.noteDur.QUARTER) {
                        remainder = duration - globalSettings.noteDur.EIGHTH;
                        chords.push(newStaveNote(notes,
                                    durationMap(globalSettings.noteDur.EIGHTH, isRest),
                                    globalSettings.clefType.BASS))

                    } else if (duration < globalSettings.noteDur.HALF) {
                        remainder = duration - globalSettings.noteDur.QUARTER;
                        chords.push(newStaveNote(notes,
                                    durationMap(globalSettings.noteDur.QUARTER, isRest),
                                    globalSettings.clefType.BASS))

                    } else if (duration < globalSettings.noteDur.WHOLE) {
                        remainder = duration - globalSettings.noteDur.HALF;
                        chords.push(newStaveNote(notes,
                                    durationMap(globalSettings.noteDur.HALF, isRest),
                                    globalSettings.clefType.BASS))

                    } else {
                        remainder = duration - globalSettings.noteDur.WHOLE;
                        chords.push(newStaveNote(notes,
                                    durationMap(globalSettings.noteDur.WHOLE, isRest),
                                    globalSettings.clefType.BASS))
                    }

                    totalNotes+=1; // update total number of note lengths
                    makeDuration(remainder); // recurse
                }
            }

            makeDuration(dur);

            /* Indicate which notes need ties (don't tie rests). For instance,
            if we needed 5 note lengths to achieve the specified duration, then
            we would tie the first note to the second, second to the third,
            third to the fourth, and the fourth to the fifth.*/
            if (!isRest && totalNotes > 1) {
                for (var i = 1; i < totalNotes; i++) {
                    var startNote = chords.length - totalNotes + i;
                    var endNote = chords.length - totalNotes + i - 1;
                    needTies.push([startNote, endNote]);
                }
            }

            // Add flat/sharp accidentals to be rendered. Loop through list
            // of accidentals we kept track of
            for (var k = 0; k < needAccidentals.length; k++) {
                var noteIndex = needAccidentals[k][0]; // get the note
                var mod = needAccidentals[k][1];        // get the pitch modification

                // add it to every chord structure we had to create in order
                // to reach duration
                var start = chords.length - totalNotes;
                for (var i = 0; i < totalNotes; i++) {
                    var cur = start + i;
                    chords[cur].addAccidental(noteIndex, new Vex.Flow.Accidental(mod));
                }
            }

        }

        // Use needTies to create vexFlow tie object to return with the chords.
        // caller will use ties to render on screen.
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
        /* Draws the score given the melody and input chords.
        Group is used to combine everything into
        one object so that it can be easily removed. There is a separate group
        for the chords and melodies since they require different renderers. */
        drawScore: function(melody, inputChords) {

            // if we already have groups on the display, remove them
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
            var ties = chordsReturn[1]; // tie for the chord notes

            drawStave(melody, this.melodyContext, globalSettings.clefType.TREBLE);
            drawStave(chords, this.chordContext, globalSettings.clefType.BASS);

            // render the ties
            ties.forEach((t) => {t.setContext(this.chordContext).draw()})

            // close group
            this.melodyContext.closeGroup();
            this.chordContext.closeGroup();
        },

        /* Resize the melody and chord renderers to fit width of display. */
        resizeDisplay: function(width) {
            this.melodyRenderer.resize(width, globalSettings.SCORE_HEIGHT);
            this.chordRenderer.resize(width, globalSettings.SCORE_HEIGHT);
        },

        /* Initialize the variables for this service. */
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
