/* // do a reset function if all checkboxes are unchecked or entire one facet is checked */
(function ($, Template) {
    "use strict";

    var App = {
		init: function () {

            // Used to keep track of which filter is a proiority. Beginning elements in the array become a priority
            // E.g. ["drive", "body"]
            this.facets = ["body", "drive"]; // immutable
            this.levels = [];
            this.requestData()
			this.bindEvents();
		},
		bindEvents: function () {
            $('.facet')
				.on('change', '.toggle', this.toggle.bind(this))
		},
        render: function() {
            this.renderThumbs();
            this.renderFacets();
        },
        requestData: function(params) {
            var endpoint = "/api/models";
            var $xhr = $.getJSON(endpoint, params);
            $.when($xhr)
            .done( function(data) {
                //console.log(data)
                // store car models in mutable array. The values change depending on user selection
                this.models = JSON.parse(JSON.stringify(data.models));
                this.render();
            }.bind(this));
        },
        toggle: function(e) {
            //a list of selected checkboxes that gets sent to api endpoint
            // E.g. {body: ["Hatchback"], drive: ["SUV"]}

            var name = $(e.target).attr("name"); // e.g. body or drive
            var data = $( "form" ).serializeArray(); // send parameters/data to server

            if (this.levels.indexOf(name) === -1) {
                this.levels.push(name)
            }

            // if first element in this levels doesn't match first element in data
            // then reverse array sequence to make it the same
            if (data.length && (this.levels[0] !== data[0].name)) {
                data.reverse();
            }
            // get all data if no cheboxes are clicked
            //$(".toggle").filter(":checked").length ? this.requestData(params) : this.requestData()
            this.requestData(data)
		},
        renderFacets: function () {
            // if a facet gets selected - it bacomes a parent so filter only children facets
            // E.g. If checkbox in the "Body" facet is clicked - it becomes a parent and
            // "Drive" facet becomes child
            var allFacets = []
            var string = [];
            var facetsToFilter; // E.g. ["body", "drive"] or ["drive"] or ["body"]

            // if nothing is clicked
            if (!this.levels.length) {
                facetsToFilter = this.facets
            } else if (this.levels.length === 1) {
                var item = this.levels[0] === "drive" ? "body" : "drive";
                facetsToFilter = [item];
            } else if (this.levels.length === 2) {
                // set to the value to filter a child facet
                facetsToFilter = [this.levels[1]]
            }

            //!this.levels.length ? ["body", "drive"] : ["drive"]
            facetsToFilter.forEach(function(facet) {
                function filterFacet(obj) {

                    if (allFacets.indexOf(obj[facet]) === -1) {
                        allFacets.push(obj[facet])
                        return true;
                    } else {
                        return false;
                    }
                }
                var facetArray = this.models.filter(filterFacet);
                var string = facetArray.map(function(car){
                    car.attribute = facet
                    car.value = car[facet]

                    return Template.displayName(car)
                });

                $("#" +facet + "-container").html(string.join(''));
            }.bind(this))
        },
		renderThumbs: function () {
            var carsString = this.models.map(function(car){
                return Template.displayThumb(car)
            });

            $("#thumb-container").html(carsString.join(''));
		}
	};

	App.init();
}(window.jQuery, Template));
