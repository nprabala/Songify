angular.module("mixTapeApp")
    .constant("globalSettings", {
        maxLines: 5,
        scoreHeight: 150,
        debug: 1,
        toggleNumber: false,
        lineHeight: 0.12,
        measureHeight: 0.3,
        measureLineSpacing: 0.4,
        measureWidth: 0.4,
        numLines: 5, // Number of lines in a staff
        numSpaces: 4, // Number of spaces in a staff
        numMeasures: 4,
        numMeasureLines: 2,
        noteRadius: 0.01,
        paddingX: 0.2,
        paddingY: 0.1,
        noteOffsetX: 0.3, // Fine-tune adjusting to allow center of note to show up where cursor tip is
        noteOffsetY: 26, // Fine-tune adjusting to allow center of note to show up where cursor tip is
        trebleStaff: ["C6", "B5", "A5", "G5", "F5", "E5", "D5", "C5", "B4", "A4", "G4", "F4", "E4", "D4", "C4"],
        noteError: 'noteError',
        currentType: 'quarter',
        pitchType: "natural",
        pitchAlterations: [],
        palettePink: ["#D6D2D2", "#F1E4F3", "#F4BBD3", "#F686BD", "#FE5D9F"],

    });
