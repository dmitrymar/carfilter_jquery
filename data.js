class Cardata {
  constructor() {
    this.zevs = {
		"models": [{
			"link": "//www.bmwusa.com/bmw/bmwi/i3",
			"imageURL": "//media.ed.edmunds-media.com/bmw/i3/2016/oem/2016_bmw_i3_4dr-hatchback_base_fq_oem_3_276.jpg",
			"year": 2016,
			"make": "BMW",
			"model": "i3",
			"maxRange": 81,
			"range": "0-100",
			"price": "42,400",
			"body": "Hatchback",
			"drive": "Rear Wheel Drive"
        }, {
            "link": "//www.chevrolet.com/spark-ev-electric-vehicle.html",
			"imageURL": "//media.ed.edmunds-media.com/chevrolet/spark-ev/2016/oem/2016_chevrolet_spark-ev_4dr-hatchback_2lt_fq_oem_1_276.jpg",
			"year": 2016,
			"make": "Chevrolet",
			"model": "Spark EV",
			"maxRange": 82,
			"range": "0-100",
			"price": "25,120",
			"body": "Hatchback",
			"drive": "Front Wheel Drive"
		}, {
			"link": "//www.fiatusa.com/en/500e/",
			"imageURL": "//media.ed.edmunds-media.com/fiat/500e/2016/oem/2016_fiat_500e_2dr-hatchback_base_fq_oem_1_276.jpg",
			"year": 2016,
			"make": "FIAT",
			"model": "500e",
			"maxRange": 87,
			"range": "0-100",
			"price": "31,800",
			"body": "Hatchback",
			"drive": "Front Wheel Drive"
        }, {
			"link": "//www.ford.com/cars/focus/trim/electric/",
			"imageURL": "//media.ed.edmunds-media.com/ford/focus/2016/oem/2016_ford_focus_4dr-hatchback_electric_fq_oem_3_276.jpg",
			"year": 2016,
			"make": "Ford",
			"model": "Focus Electric",
			"maxRange": 76,
			"range": "0-100",
			"price": "29,170",
			"body": "Hatchback",
			"drive": "Front Wheel Drive"
		}, {
			"link": "//www.kia.com/us/en/vehicle/soul-ev/2016",
			"imageURL": "//media.ed.edmunds-media.com/kia/soul-ev/2016/oem/2016_kia_soul-ev_wagon_plus_fq_oem_4_276.jpg",
			"year": 2016,
			"make": "Kia",
			"model": "Soul EV",
			"maxRange": 90,
			"range": "0-100",
			"price": "31,950",
			"body": "Wagon",
			"drive": "Front Wheel Drive"
		}, {
			"link": "//www.mbusa.com/mercedes/vehicles/model/class-B/model-B250E",
			"imageURL": "//media.ed.edmunds-media.com/mercedes-benz/b-class-electric-drive/2016/oem/2016_mercedes-benz_b-class-electric-drive_4dr-hatchback_b250e_fq_oem_1_276.jpg",
			"year": 2016,
			"make": "Mercedes-Benz",
			"model": "B250e",
			"maxRange": 87,
			"range": "0-100",
			"price": "41,450",
			"body": "Hatchback",
			"drive": "Front Wheel Drive"
        }, {
			"link": "//www.mitsubishicars.com/imiev",
			"imageURL": "//media.ed.edmunds-media.com/mitsubishi/i-miev/2012/oem/2012_mitsubishi_i-miev_4dr-hatchback_es_fq_oem_6_276.jpg",
			"year": 2016,
			"make": "Mitsubishi",
			"model": "i-MiEV",
			"maxRange": 62,
			"range": "0-100",
			"price": "22,995",
			"body": "Hatchback",
			"drive": "Rear Wheel Drive"
		}, {
            "link": "//www.nissanusa.com/Leaf",
			"imageURL": "//media.ed.edmunds-media.com/nissan/leaf/2016/oem/2016_nissan_leaf_4dr-hatchback_sl_fq_oem_4_276.jpg",
			"year": 2016,
			"make": "Nissan",
			"model": "Leaf",
			"maxRange": 107,
			"range": "100-200",
			"price": "34,200",
			"body": "Hatchback",
			"drive": "Front Wheel Drive"
        }, {
			"link": "//www.smartusa.com/models/electric-coupe",
			"imageURL": "//media.ed.edmunds-media.com/smart/fortwo/2016/oem/2016_smart_fortwo_2dr-hatchback_electric-drive-coupe_fq_oem_2_276.jpg",
			"year": 2016,
			"make": "smart",
			"model": "fortwo Electric",
			"maxRange": 68,
			"range": "0-100",
			"price": "25,000",
			"body": "Hatchback",
			"drive": "Rear Wheel Drive"
		}, {
			"link": "//www.teslamotors.com/models",
			"imageURL": "//media.ed.edmunds-media.com/tesla/model-s/2016/oem/2016_tesla_model-s_sedan_p90d_fq_oem_2_276.jpg",
			"year": 2016,
			"make": "Tesla",
			"model": "Model S",
			"maxRange": 303.2,
			"range": "200-400",
			"price": "75,000",
			"body": "Sedan",
			"drive": "All Wheel Drive"
		}, {
			"link": "//www.teslamotors.com/modelx",
			"imageURL": "//media.ed.edmunds-media.com/tesla/model-x/2016/oem/2016_tesla_model-x_4dr-suv_p90d_fq_oem_1_276.jpg",
			"year": 2016,
			"make": "Tesla",
			"model": "Model X",
			"maxRange": 257,
			"range": "200-400",
			"price": "83,000",
			"body": "SUV",
			"drive": "All Wheel Drive"
		}, {
			"link": "//www.vw.com/models/e-golf",
			"imageURL": "//media.ed.edmunds-media.com/volkswagen/e-golf/2016/oem/2016_volkswagen_e-golf_4dr-hatchback_sel-premium_fq_oem_4_276.jpg",
			"year": 2016,
			"make": "Volkswagen",
			"model": "e-Golf",
			"maxRange": 83,
			"range": "0-100",
			"price": "28,995",
			"body": "Hatchback",
			"drive": "Front Wheel Drive"
		}],
		"facets": {
			"range": ["0-100", "100-200", "200-400"],
			"body": ["Hatchback", "Sedan", "SUV", "Wagon"],
			"drive": ["Front Wheel Drive", "All Wheel Drive", "Rear Wheel Drive"]
		}
	};

  }
}
