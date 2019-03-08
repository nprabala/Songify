angular.module("mixTapeApp").constant("globalSettings", {
    EMPTY_NOTE: "Empty",
    TOP_MESSAGE: "Welcome to Mixtape! Click anywhere on the staff to create your melody, then select 'Melody + Chords' to see the accompaniment.",
    HELLO_MESSAGE: "Welcome To Mixtape",
    TOP_LINE_INDEX: 4,
    SCORE_HEIGHT: 150,
    LINE_HEIGHT: 0.12,
    STAFF_LINES: 5, // Number of lines in a staff
    NOTE_RADIUS: 0.01,
    CHORDS_OCTAVE: '3',
    CHORD_VOLUME: 0.1,
    MELODY_VOLUME: 0.4,

    notesEnum: {
        'C':1,
        'D':2,
        'E':3,
        'F':4,
        'G':5,
        'A':6,
        'B':7
    },

    pitchModEnum: {
        '#':1,
        '-':2,
        '' :3
    },

    clefType: {
        TREBLE: "treble",
        BASS: "bass"
    },

    trebleStaff: ["C6", "B5", "A5", "G5", "F5", "E5", "D5", "C5", "B4", "A4", "G4", "F4", "E4", "D4", "C4"],

    noteType: {
        SIXTEENTH: "sixteenth",
        EIGHTH: "eighth",
        QUARTER: "quarter",
        HALF: "half",
        WHOLE: "whole",
        CLEAR: "*CLEAR NOTE*"
    },

    pitchType: {
        FLAT: "Flat",
        SHARP: "Sharp",
        NATURAL: "Natural",
    },

    notePitchMod: {
        SHARP: "Sharp",
        FLAT: "Flat",
        NATURAL: "Natural"
    },
    
    // Non-constants
    toggleView: false, // true = show score, false = show melody input
    
});
