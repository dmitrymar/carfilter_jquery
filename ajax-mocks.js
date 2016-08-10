(function ($) {

var json = {
	"models": [{
		"link": "http://www.fiatusa.com/en/500e/",
		"imageURL": "http://media.ed.edmunds-media.com/fiat/500e/2016/oem/2016_fiat_500e_2dr-hatchback_base_fq_oem_1_276.jpg",
		"year": "2016",
		"make": "FIAT",
		"model": "500e",
		"trim": "",
		"range": "87",
		"price": "31,800",
		"body": "Hatchback",
		"drive": "Front Wheel Drive"
	}, {
		"link": "http://www.nissanusa.com/Leaf",
		"imageURL": "http://media.ed.edmunds-media.com/nissan/leaf/2016/oem/2016_nissan_leaf_4dr-hatchback_sl_fq_oem_4_276.jpg",
		"year": "2016",
		"make": "Nissan",
		"model": "Leaf",
		"trim": "30kWh",
		"range": "107",
		"price": "34,200",
		"body": "Hatchback",
		"drive": "Front Wheel Drive"
	}, {
		"link": "https://www.mbusa.com/mercedes/vehicles/model/class-B/model-B250E",
		"imageURL": "http://media.ed.edmunds-media.com/mercedes-benz/b-class-electric-drive/2016/oem/2016_mercedes-benz_b-class-electric-drive_4dr-hatchback_b250e_fq_oem_1_276.jpg",
		"year": "2016",
		"make": "Mercedes-Benz",
		"model": "B250e",
		"trim": "",
		"range": "87",
		"price": "41,450",
		"body": "Hatchback",
		"drive": "Front Wheel Drive"
	}, {
		"link": "https://www.teslamotors.com/models",
		"imageURL": "http://media.ed.edmunds-media.com/tesla/model-s/2016/oem/2016_tesla_model-s_sedan_p90d_fq_oem_2_276.jpg",
		"year": "2016",
		"make": "Tesla",
		"model": "Model S",
		"trim": "70D",
		"range": "240",
		"price": "75,000",
		"body": "Sedan",
		"drive": "All Wheel Drive"
	}, {
		"link": "http://www.mitsubishicars.com/imiev",
		"imageURL": "http://media.ed.edmunds-media.com/mitsubishi/i-miev/2012/oem/2012_mitsubishi_i-miev_4dr-hatchback_es_fq_oem_6_276.jpg",
		"year": "2016",
		"make": "Mitsubishi",
		"model": "i-MiEV",
		"trim": "",
		"range": "62",
		"price": "22,995",
		"body": "Hatchback",
		"drive": "Rear Wheel Drive"
	}, {
		"link": "https://www.teslamotors.com/modelx",
		"imageURL": "https://media.ed.edmunds-media.com/tesla/model-x/2016/oem/2016_tesla_model-x_4dr-suv_p90d_fq_oem_1_276.jpg",
		"year": "2016",
		"make": "Tesla",
		"model": "Model X",
		"trim": "75D",
		"range": "237",
		"price": "83,000",
		"body": "SUV",
		"drive": "All Wheel Drive"
	}]
}

$.mockjax({
  url: "/api/models",
  contentType: "application/json",
  response: function(settings) {
	  console.log("settings.data");
	  console.log(settings.data)

	// if parameters have not been sent or are sent but empty
	if (!settings.data) {
		// if no parameters are sent then display all data
		this.responseText = json;
	} else {
		var query = decodeURIComponent(settings.data);
		var models = [];
		var bodyCount = (query.match(/body/g) || []).length;
		var driveCount = (query.match(/drive/g) || []).length;

		function filterArray (obj) {
			if (bodyCount > 0 && driveCount === 0) {
				if (query.includes(obj.body)) {
					return true;
				}
			} else if (driveCount > 0 && bodyCount === 0) {
				if (query.includes(obj.drive)) {
					return true;
				}
			} else if (bodyCount > 0 && driveCount > 0) {
				if (query.includes(obj.body) && query.includes(obj.drive)) {
					return true;
				}
			}
		}

		models.push.apply(models, json.models.filter(filterArray))
		this.responseText = {"models": models};
	}
  }
});

}(window.jQuery));
