(function ($, deparam, Cardata) {

	var cardata = new Cardata();
	var json = cardata.zevs;

$.mockjax({
  url: "/api/models",
  contentType: "application/json",
  response: function(settings) {

		var query = decodeURIComponent(settings.data);
		var models = [];
		var filteredFacets = {"range": [], "body": [], "drive": []};
		var firstFacet = query.substring(0, 5);
		var queryObj = deparam(query);
		var oppositeFacets = {
			range: ["body", "drive"],
			body: ["range", "drive"],
			drive: ["range", "body"]
		};

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
			models = _.filter(json.models, _.matches(queryObj));

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
