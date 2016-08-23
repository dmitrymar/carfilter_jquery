// Finish setting up this.deferredReset
// Fix all issues with filteres
// Add unit tests
// Maybe find a library that will alternate between ajax request and localStorage
// localStorage.getItem("todos-jquery").includes("ea7dbc7c-e236-4159-a5df-ce41e18e1d8a")
// var sessionArray = JSON.stringify([{params: this.params || ""}]);
// sessionStorage.setItem("carfilter", sessionArray);

// Convert syntax to ES6 Follow this https://github.com/tastejs/todomvc/tree/530d9b435ccf1f94e470cfdcbc304c0f949b49a0/examples/vanilla-es6

/* // do a reset function if all checkboxes are unchecked or entire one facet is checked */

// replace serizalize with native FormData https://www.sitepoint.com/easier-ajax-html5-formdata-interface/
// http://smalljs.org/client-side-routing/page/


(function ($, Template, Utils, Router) {
    "use strict";

    var utils = new Utils();
    var tmpl = new Template();

    var App = {
		init: function () {

            // Used to keep track of which filter is a proiority. Beginning elements in the array become a priority
            // E.g. ["drive", "body"]
            this.facets = ["body", "drive"]; // immutable
            this.resetLink = $("#resetFilters").closest('p');
            this.deferredData = $.Deferred();
            this.deferredReset = $.Deferred();
            this.paramsArray = [];
            this.models;
            this.params = "";
            this.bindEvents();
            this.route();
		},
		bindEvents: function () {
            $('#filterForm').on('change', '.toggle', this.changeView.bind(this));
            $('#resetFilters').on('click', this.reset.bind(this));

            this.deferredData.progress(function () {
                console.log("model changed");
                console.log(this.facets);
                this.render();
            }.bind(this));

            this.deferredReset.progress(function () {
                console.log("deferredReset");
            }.bind(this));
		},
        setParams: function(settings) {
            this.paramsArray = utils.createParamArray(settings);
            this.params = utils.createParamString(this.paramsArray);
        },
        changeView: function(e) {
            console.log("changeView")
            var settings = {
                name: $(e.target).attr("name"),
                value: $(e.target).val(),
                params: this.params,
                paramsArray: this.paramsArray
            };
            this.setParams(settings);
            utils.setHash(this.paramsArray);
            this.requestData();
            // render() is fired
            this.displayResetLink();
        },
        displayResetLink: function() {
            if ($(".toggle").filter(":checked").length) {
                $(this.resetLink).removeClass("hidden");
            } else {
                $(this.resetLink).addClass("hidden");
            }
        },
        route: function() {
            // if hash hasn't changed do this
            console.log("Start Routing");


            // if hash has changed change use director library for routing
            var changeRoute = function (driveID) {
                console.log("changeRoute");
                //console.log("viewBook: bookId is populated: " + rangeId);
                this.setParams();
            }.bind(this);

            var routes = {
              '/drive/:driveID': changeRoute
            };

            var router = Router(routes);

            router.init();
            this.requestData();
        },
        render: function() {
            this.renderThumbs();
            this.renderFacets();
        },
        reset: function (event) {
            console.log("reset clicked");
            event.preventDefault();
            this.params = "";
            this.requestData();
            this.resetFacets();
            $(this.resetLink).addClass("hidden");
        },
        resetFacets: function() {
            $(".facet").removeClass("selected");
            $(".toggle").attr("checked", false);
            $(this.resetLink).addClass("hidden");
        },
        requestData: function() {
            console.log("requestData")
            var endpoint = "/api/models";
            var $xhr = $.getJSON(endpoint, this.params);
            $.when($xhr)
            .done( function(response) {

                // store car models in mutable array. The values change depending on user selection
                this.models = response.models;
                this.facets = response.facets
                this.deferredData.notify();
            }.bind(this));
        },
        renderFacets: function () {
            console.log("renderFacets");
            var facetString = "";

            for (var facet in this.facets) {
                console.log(facet);
                facetString += tmpl.renderFacetTitle(facet);
                var checkboxString = this.facets[facet].map(function(type){
                    var checked = this.params.includes(encodeURIComponent(type)) ? true : false;
                    return tmpl.renderCheckboxes(facet, type, checked);
                }.bind(this));
                facetString += checkboxString.join('');
                facetString += "<br>"
            }

            $("#filterForm").html(facetString);
        },
		renderThumbs: function () {
            this.models;
            var carsString = this.models.map(function(car){
                return tmpl.displayThumb(car);
            });

            $("#thumb-container").html(carsString.join(''));
		}
	};

	App.init();
}(window.jQuery, Template, Utils, Router));
