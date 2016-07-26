// make facets and thumbs change on data change
// cache model data in session history so when going back or forward no need to make ajax request
/* // do a reset function if all checkboxes are unchecked or entire one facet is checked */
// replace serizalize with native FormData https://www.sitepoint.com/easier-ajax-html5-formdata-interface/
// http://smalljs.org/client-side-routing/page/


(function ($, Template) {
    "use strict";

    var App = {
		init: function () {

            // Used to keep track of which filter is a proiority. Beginning elements in the array become a priority
            // E.g. ["drive", "body"]
            this.facets = ["body", "drive"]; // immutable
            this.resetLink = $("#resetFilters").closest('p');
            this.deferred = $.Deferred();
            this.models;
            this.parentFilter; // mutable
            this.firstLoad = true; // mutable
            this.bindEvents();
            this.route();




		},
		bindEvents: function () {
            $('.facet')
				.on('change', '.toggle', this.toggle.bind(this));
            $('#resetFilters').on('click', this.reset.bind(this));

            // if state changes then change view depending on location.search value
            window.onpopstate = function(event) {
              console.log("state changed");

              // grap the new url
              // use new url to render facets
              // serialize all facets
              // render thumbs
              this.resetFacets()
              this.tickCheckboxes();

            }.bind(this);

            this.deferred.progress(function () {
                console.log("model changed");
                console.log(this.models);
                this.render()
            }.bind(this));

		},
        route: function() {
            console.log("route")
            if (window.location.search) {
                this.requestData(window.location.search.substr(1));
            } else {
                this.requestData();
            }
        },
        render: function() {
            this.renderThumbs();
            this.renderFacets();
            this.setURL();
        },
        reset: function (event) {


            console.log("reset clicked");
            event.preventDefault();
            this.firstLoad = false;
            this.resetFacets();
            this.requestData();
            $(this.resetLink).addClass("hidden");
        },
        resetFacets: function() {
            this.parentFilter = "";
            $(".facet").removeClass("selected");
            $(".toggle").attr("checked", false);
            $(this.resetLink).addClass("hidden")
        },
        requestData: function(params) {
            console.log("requestData")
            var endpoint = "/api/models";
            var $xhr = $.getJSON(endpoint, params);
            $.when($xhr)
            .done( function(data) {
                // store car models in mutable array. The values change depending on user selection
                this.models = JSON.parse(JSON.stringify(data.models));
                this.deferred.notify();
            }.bind(this));
        },
        toggle: function(e) {
            console.log("toggle function")
            this.firstLoad = false;

            var name = $(e.target).attr("name"); // e.g. body or drive
            var data = $( "#filterForm" ).serialize().replace(/\+/g,'%20') // send parameters/data to server
            var facet = $(e.target).closest(".facet");


            this.parentFilter = !this.parentFilter ? name : this.parentFilter;

            if ($(facet).find(".toggle").filter(":checked").length) {
                $(facet).addClass("selected")
            } else {
                $(facet).removeClass("selected")
            }

            if (!this.parentFilter) {
                this.parentFilter = name;
            } else if (this.parentFilter === name && !$(facet).hasClass("selected")) {
                // if the parent filter has been removed set parent to another selected facet
                this.parentFilter = $(".facet").filter(".selected").data("facet");
            }

            // get all data if no cheboxes are clicked
            //$(".toggle").filter(":checked").length ? this.requestData(params) : this.requestData()
            this.requestData(data)

            if ($(".toggle").filter(":checked").length) {
                $(this.resetLink).removeClass("hidden")
            } else {
                $(this.resetLink).addClass("hidden")
            }
		},
        tickCheckboxes: function() {
            console.log("tickCheckboxes");
            // this uses plugin jquery bbq
            var params = $.deparam.querystring();
            console.log(params)
            for (var key in params) {
                // add selected to facet
                $("[data-facet='" + key + "']").addClass("selected");

                // select checkboxes
                if (Array.isArray(params[key])) {
                    params[key].forEach(function(value) {
                        console.log(value)
                        $("[value='"+value+"']").prop("checked", true)
                    })
                } else {
                    $("[value='"+params[key]+"']").prop("checked", true)
                }
            }

            !Object.keys(params).length ? $(this.resetLink).addClass("hidden") : $(this.resetLink).removeClass("hidden");
        },
        setURL: function () {
            var serializedData = !$( "#filterForm" ).serialize() ? "/" : "?" + $( "#filterForm" ).serialize().replace(/\+/g,'%20');
            if (window.location.search && this.firstLoad) {
                this.tickCheckboxes();
            } else {
                history.pushState(null, null, serializedData);
            }
        },
        renderFacets: function () {
            // if a facet gets selected - it bacomes a parent so filter only children facets
            // E.g. If checkbox in the "Body" facet is clicked - it becomes a parent and
            // "Drive" facet becomes child
            var allFacets = []
            var string = [];
            var facetsToFilter; // E.g. ["body", "drive"] or ["drive"] or ["body"]

            // if nothing is clicked
            if (!this.parentFilter) {
                facetsToFilter = this.facets
            } else {
                var item = this.parentFilter === "drive" ? "body" : "drive";
                facetsToFilter = [item];
            }

            if ($('.facet.selected').length < 2) {
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
            }
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
