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
    console.log("paramsArray")
    console.log(paramsArray);
    var paramString = $.param(paramsArray);
    paramString = paramString.replace(/\+/g,'%20');
    console.log(paramString)
    // var string = name + "=" + value;
    // string = string.replace(/\s/g,'%20');
    // if (params) {
    //     if (params.includes(string)) {
    //         console.log("replace string")
    //         params = params.replace(string,'');
    //         params = params.replace("?&",'?');
    //     } else {
    //         params = params + "&" + string;
    //     }
    // } else {
    //     params = "?" + string;
    // }
    // params = params === "?" ? null : params;
    return paramString;
};



    // Export to window
	window.app = window.app || {};
	window.app.Utils = Utils;
})(window);
