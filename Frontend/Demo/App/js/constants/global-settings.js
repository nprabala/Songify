angular.module("mixTapeApp")
    .constant("globalSettings", {
        debug: 1,
        lineHeight: 0.05,
        measureHeight: 0.3,
        measureLineSpacing: 0.4,
        measureWidth: 0.4,
        numLines: 5, // Number of lines in a staff
        numSpaces: 4, // Number of spaces in a staff
        numMeasures: 4,
        numMeasureLines: 2,
        noteRadius: 0.01,
        paddingX: 0.2,
        paddingY: 0.2,
        noteOffsetX: 0.4, // Fine-tune adjusting to allow center of note to show up where cursor tip is
        noteOffsetY: 3.6, // Fine-tune adjusting to allow center of note to show up where cursor tip is
        trebleStaff: ["B4", "A4", "G4", "F4", "E4", "D4", "C4", "B3", "A3", "G3", "F3", "E3", "D3", "C3"],
        noteError: 'noteError',
    });
