class Utils {

    createParamArray (settings) {
		var paramsArray;

        if (!settings) {

            paramsArray = [{"name":"drive","value":"All Wheel Drive"}];

        } else {

            var paramObj = {"name": settings.name, "value": settings.value};
            paramsArray = settings.paramsArray;
            if (JSON.stringify(settings.paramsArray).includes(settings.value)) {
                paramsArray = settings.paramsArray.filter(function(e){
                    return JSON.stringify(e) !== JSON.stringify(paramObj);
                });
            } else {
                paramsArray.push(paramObj);
            }

        }

        return paramsArray;
    }

    createParamString (paramsArray) {
        var paramString = $.param(paramsArray);
        paramString = paramString.replace(/\+/g,'%20');
        return paramString;
    }

    setHash(paramsArray) {
        var url = "";
        paramsArray.forEach(function(el) {
            var hasName = url.includes(el.name);
            var prefix = hasName ? "" : "/";
            var value = hasName ? "|" + el.value : "/" + el.value;
            var name = hasName ? "" : el.name;

            url += prefix + name + value;

        });
        window.location.hash = url;
    }
}
