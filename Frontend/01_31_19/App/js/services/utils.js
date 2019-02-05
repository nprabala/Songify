angular.module("mixTapeApp")
    .factory("utilsService", ["globalSettings", function(globalSettings) {
    	"use strict"
        return {
        	getNote: function(y, full_step, staffHeight, canvasHeight, staffGap) {
        		var half_step = full_step / 2;
        		var staff_position = y % (staffHeight + staffGap);
        		console.log("staff position: " + staff_position);
        		var staff_offset = Math.floor(staff_position / half_step);
        		console.log(staff_offset);
        		var note = globalSettings.trebleStaff[staff_offset];
        		console.log("note: " + note);
        		return note;
        	}
        }
    }]);