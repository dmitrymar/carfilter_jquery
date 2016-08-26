class Utils {

    parseParms (hashurl) {
        // pieces e.g. ["drive", "All%20Wheel%20Drive", "body", "SUV"]
        var pieces = hashurl.split("/"), str = "";
        console.log(pieces)
        pieces.forEach(function(el, i) {
          if((i % 2) === 0) {
            str += '{"name":"' + el +'","'
          } else {
            str += 'value":"' + el + '"}';
            str += (pieces.length - 1) === i ? "" : ",";

          }
        })
        str = "[" + decodeURIComponent(str) + "]"
        console.log(str)
       return JSON.parse(str);

    }


    createParamArray (settings) {
		var paramsArray;

        if (!settings) {
            console.log("No settings");
            var hashurl = window.location.hash.substring(2);
            console.log(this.parseParms(hashurl))
            paramsArray = this.parseParms(hashurl);
            //paramsArray = [{"name":"drive","value":"All Wheel Drive"}];

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

    buildRouteFragment (paramsArray) {
        var url = "";
        paramsArray.forEach(function(el) {
            var hasName = url.includes(el.name);
            var prefix = hasName ? "" : "/";
            var value = hasName ? "|" + el.value : "/" + el.value;
            var name = hasName ? "" : el.name;

            url += prefix + name + value;

        });
        return encodeURI(url);
    }
}
