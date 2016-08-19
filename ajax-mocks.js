(function ($, deparam, Cardata) {

	var cardata = new Cardata();
	var json = cardata.zevs;

$.mockjax({
  url: "/api/models",
  contentType: "application/json",
  response: function(settings) {

		var query = decodeURIComponent(settings.data);
		var models = $("body").data("models") || [];
		var filteredFacets = {"range": [], "body": [], "drive": []};
		var firstFacet = query.substring(0, 5);
		var queryObj = deparam(query);
		var oppositeFacets = {
			range: ["body", "drive"],
			body: ["range", "drive"],
			drive: ["range", "body"]
		};

		function filterArray (obj) {
			var counter = 0;

			for (var key in queryObj) {
				// key e.g "range"

				if (Object.keys(queryObj).length === 1) {
					// if 1 facet is matched. E.g. SUV

					// obj[key1] e.g. "0-100"
					if (query.includes(obj[key])) {
						return true;
					}
				} else if (Object.keys(queryObj).length === 2) {
					// if 2 facets are matched // For ex. 200-400 miles, SUV

						if (query.includes(obj[key])) {
							for (var key2 in queryObj) {
								if (key !== key2 && query.includes(obj[key2])) {
									return true;
								}
							}
						}
				} else {
					// if all facets are in query then check that each facet type is matched
					// For ex. 200-400 miles, SUV, All wheel drive

					if (query.includes(obj[key])) {
						counter++;
					}

					if (counter === 3) {return true;}
				}
			} // end top for loop
		}

		function storeData(item) {
			var facetType;
			for (var key in json.facets) {
				if (json.facets[key].includes(item)) {
					facetType = key;
				}
			}
			//var facetType = json.facets.body.includes(item) ? "body" : "drive";
			var facetTypeArray = $( "body" ).data( facetType ) || [];
			!facetTypeArray.includes(item) ? facetTypeArray.push(item) : facetTypeArray.push();
			$( "body" ).data( facetType,  facetTypeArray);

		}

		function filterFacet (item) {
			if (JSON.stringify(models).includes(item)) {
				console.log("filterFacet")
				storeData(item)
				return true;
			}
		}

		function parentChildrenFacets(facet) {
			filteredFacets[facet].push.apply(filteredFacets[facet], json.facets[facet].filter(filterFacet));
			oppositeFacets[facet].forEach(function(el) {
				filteredFacets[el] = $( "body" ).data( el );
			});
		}

		function getFilteredFacets() {
			if (Object.keys(queryObj).length === 1) {
				console.log("equal 1");
				for (var key in json.facets) {
					if (queryObj.hasOwnProperty(key)) {
						oppositeFacets[key].forEach(function(el) {
							filteredFacets[el].push.apply(filteredFacets[el], json.facets[el].filter(filterFacet));
						});
						filteredFacets[key] = json.facets[key];
					}
				}
			} else {
				console.log("queryObj length is > 1")

				for (var facet in json.facets) {
					if (firstFacet.includes(facet)) {
						parentChildrenFacets(facet);
					}
				}
			}
		}

		function getFilteredData() {
			// if models is empty then use json.models to filter
			if (models.length) {
				models = models.filter(filterArray);
			} else {
				models.push.apply(models, json.models.filter(filterArray));
				debugger
			}
			$("body").data("models", models);
			getFilteredFacets();
			return {
				"models": models, "facets": filteredFacets
			};
		}

		// if no parameters are sent then display all data
		this.responseText = !settings.data ? json : getFilteredData();
  }
});

}(window.jQuery, deparam, Cardata));
