angular.module("mixTapeApp")
.factory("utilsService", ["globalSettings",
    function(globalSettings) {
    	"use strict"
        return {
            setHostname: function(hostname) {
                this.hostname = hostname;
            },

            getHostname: function() {
                return this.hostname;
            },
        }
        }]);
