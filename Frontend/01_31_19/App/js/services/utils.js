angular.module("mixTapeApp")
    .factory("utilsService", ["globalSettings",function(globalSettings) {
    	"use strict"
    	var getPitch = function(y, full_step, staffHeight, canvasHeight, staffGap){
        		var half_step = full_step/2;
        		var staff_position = y % (staffHeight + staffGap);
        		console.log(staff_position);
        		var staff_offset = Math.floor(staff_position / half_step);
        		console.log(staff_offset);
        		var pitch = globalSettings.trebleStaff[staff_offset];
        		console.log(pitch);
        		return pitch;
        	};
        return {
        	createNote: function(x,y, full_step, staffHeight, canvasHeight, staffGap){
        		var note = {};
        		note.pitch = getPitch(y,full_step,staffHeight,canvasHeight,staffGap);
        		// note.duration = type;
        		// TODO: Write util to figure out measure number and position based on xpos and ypos
        		// note.measureNumber = measureNumber;
        		// note.measurePosition = measurePosition;
        		return note;
        	},
        }
    }]);