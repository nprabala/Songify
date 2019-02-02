angular.module("mixTapeApp")
    .factory("utilsService", ["globalSettings",function(globalSettings) {
    	"use strict"
        return {
        	getNote: function(y){
        		var full_step = globalSettings.lineHeight;
        		var half_step = globalSettings.lineHeight/2;
        		var staff_position = y - globalSettings.padding;
        		console.log(staff_position);
        		var staff_offset = Math.floor(staff_position / half_step);
        		console.log(staff_offset);
        		var note = globalSettings.trebleStaff[staff_offset];
        		console.log(note);
        		return note;
        	}
        	// enter necessary functions here
        }
    }]);