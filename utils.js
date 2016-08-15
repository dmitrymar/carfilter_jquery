(function (window) {
	'use strict';
    function Utils() {
		this.test = "test";
	}
    Utils.prototype.createParamArray = function (name, value, paramsArray) {
        var paramObj = {"name": name, "value": value};

        if (JSON.stringify(paramsArray).includes(value)) {
            paramsArray = paramsArray.filter(function(e){
                return JSON.stringify(e) !== JSON.stringify(paramObj)
            });
        } else {
            paramsArray.push(paramObj)
        }

        return paramsArray;
    };

	Utils.prototype.createParamString = function (name, value, params, paramsArray) {
	    var paramString = $.param(paramsArray);
	    paramString = paramString.replace(/\+/g,'%20');
	    return paramString;
	};



    // Export to window
	window.app = window.app || {};
	window.app.Utils = Utils;
})(window);
