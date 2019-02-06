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
        numMeasureLines: 4,
        noteRadius: 0.01,
        paddingX: 0.2,
        paddingY: 0.2,
        noteOffsetX: 0.4, // Fine-tune adjusting to allow center of note to show up where cursor tip is
        noteOffsetY: 3.6, // Fine-tune adjusting to allow center of note to show up where cursor tip is
        trebleStaff: ["B", "A", "G", "F", "E", "D", "C", "B", "A", "G", "F", "E", "D", "C"],
    });
