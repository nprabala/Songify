angular.module("mixTapeApp").constant("globalSettings", {
    EMPTY_NOTE: "Empty",
    TOP_MESSAGE: "Welcome to Mixtape! Click anywhere on the top staff to create your melody, then select 'Get Chords' to generate the accompaniment.",
    HELLO_MESSAGE: "Welcome To Mixtape",
    TOP_LINE_INDEX: 4,
    SCORE_HEIGHT: 150,
    TOGGLE_VIEW: false, // true = show score, false = show melody input
    LINE_HEIGHT: 0.12,
    STAFF_LINES: 5, // Number of lines in a staff
    NOTE_RADIUS: 0.01,

    trebleStaff: ["C6", "B5", "A5", "G5", "F5", "E5", "D5", "C5", "B4", "A4", "G4", "F4", "E4", "D4", "C4"],

    noteType: {
        SIXTEENTH: "sixteenth",
        EIGHTH: "eighth",
        QUARTER: "quarter",
        HALF: "half",
        WHOLE: "whole",
        CLEAR: "*CLEAR NOTE*"
    },

    notePitchMod: {
        SHARP: "Sharp",
        FLAT: "Flat",
        NATURAL: "Natural"
    },
});
