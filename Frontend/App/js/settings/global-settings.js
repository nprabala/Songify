angular.module("songifyApp").constant("globalSettings", {

    EMPTY_NOTE: "Empty",                     // marks empty note in melody
    TOP_MESSAGE: "Welcome to Songify! Click anywhere on the staff to create \
                    your melody, then select 'Melody + Chords' to see the \
                    accompaniment.",         // top message displayed on page

    ONE_SEC: 1000,                          // 1000ms in 1s
    TOP_LINE_INDEX: 4,                       // index of F5 in the trebleStaff (top line on staff)
    SCORE_HEIGHT: 150,                      // height of the score
    LINE_HEIGHT: 0.12,                      // staff line spacing
    STAFF_LINES: 5,                         // Number of lines in a staff
    NOTE_RADIUS: 0.01,                      // radius of note spacing
    CHORDS_OCTAVE: '3',                     // octave to give the notes in the returned chords
    CHORD_VOLUME: 0.1,                      // volume to play chords (quieter than melody)
    MELODY_VOLUME: 0.4,                     // volume to play melody
    MELODY_STAFF: "melody",                 // id of the melody staff
    SCORE_TOGGLE_COLOR: '#D74046',          // color for melody+chords toggle
    MELODY_TOGGLE_COLOR: 'dodgerblue',      // color for melody toggle
    NOTE_CLICK_PLAY_DUR: 250,               // when user clicks on staff, play that note for this long
    FEEDBACK_LINK: "https://docs.google.com/forms/d/e/1FAIpQLSfDzcagQexDrkSgBXNArMylQuoaUbY6ojhOWUCrt7jeHCH4dA/viewform?usp=sf_link", // Feedback link

    // enum for notes
    notesEnum: {
        'C':1,
        'D':2,
        'E':3,
        'F':4,
        'G':5,
        'A':6,
        'B':7
    },

    // enum for note pitches
    pitchModEnum: {
        '#':1,
        '-':2,
        '' :3
    },

    // enum for clef types
    clefType: {
        TREBLE: "treble",
        BASS: "bass"
    },

    // notes on the staff in the order from top note to bottom note
    trebleStaff: ["C6", "B5", "A5", "G5", "F5", "E5", "D5", "C5", "B4", "A4", "G4", "F4", "E4", "D4", "C4"],

    // enum for note type
    noteType: {
        SIXTEENTH: "sixteenth",
        EIGHTH: "eighth",
        QUARTER: "quarter",
        HALF: "half",
        WHOLE: "whole",
        CLEAR: "*CLEAR NOTE*"
    },

    // enum for note durations
    noteDur: {
        SIXTEENTH: 0.25,
        EIGHTH: 0.5,
        QUARTER: 1,
        HALF: 2,
        WHOLE: 4,
    },

    // enum for pitch selection in drop down menu
    pitchType: {
        FLAT: "Flat",
        SHARP: "Sharp",
        NATURAL: "Natural",
    },

    // enum for how fast to play back
    bpm: {
        SLOW: "Slow",    // ~60bpm
        FAST: "Fast",   //~120 bpm
    },

    // Non-constants
    toggleView: false, // melody (false) melody+chord (true) toggle
});
