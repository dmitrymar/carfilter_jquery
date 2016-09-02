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


(function ($, Template, Utils, Router, Cardata) {
    "use strict";

    var utils = new Utils();
    var tmpl = new Template();
    var routes = {
    //   '/drive/:driveID': changeRoute,
    //   '/drive/:driveID/body/:bodyID': changeRoute,
      '/?((\w|.)*)': function() {
          App.setParams();
      }.bind(this)
    };
    var router = new Router(routes);
    var cardata = new Cardata();

    var App = {
		init: function () {

            // Used to keep track of which filter is a proiority. Beginning elements in the array become a priority
            // E.g. ["drive", "body"]
            this.resetLink = $("#resetFilters").closest('p');
            this.deferredData = $.Deferred();
            this.deferredReset = $.Deferred();
            this.constModels = cardata.zevs.models; // immutable
            this.constFacets = cardata.zevs.facets; // immutable
            this.models = cardata.zevs.models; // mutable
            this.facets = cardata.zevs.facets; // mutable
            this.paramsArray = [];
            this.params = [];
            this.routeFragment = "";
            this.bindEvents();
            router.init();
            this.render();
		},
		bindEvents: function () {
            $('#filterForm').on('change', '.toggle', this.changeView.bind(this));
            $('#resetFilters').on('click', this.reset.bind(this));

            this.deferredReset.progress(function () {
                console.log("deferredReset");
            }.bind(this));
		},
        setParams: function(settings) {
            //this.paramsArray = utils.createParamArray(settings);
            //this.params = utils.createParamString(this.paramsArray);
            //this.params = utils.createParamObj(settings);
            //this.routeFragment = utils.buildRouteFragment(this.paramsArray);
        },
        changeView: function(e) {
            console.log("changeView")
            var settings = {
                name: $(e.target).attr("name"),
                value: $(e.target).val(),
                params: this.params,
                paramsArray: this.paramsArray
            };
            var checkedObj = {};
            checkedObj[$(e.target).attr("name")] = $(e.target).val();
            this.params.push(checkedObj);
            //this.setParams(settings);
            //router.setRoute(this.routeFragment);
            this.filterData();
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
        render: function() {
            this.renderThumbs();
            this.renderFacets();
        },
        reset: function (event) {
            console.log("reset clicked");
            event.preventDefault();
            this.params = "";
            this.filterData();
            this.resetFacets();
            $(this.resetLink).addClass("hidden");
        },
        resetFacets: function() {
            $(".facet").removeClass("selected");
            $(".toggle").attr("checked", false);
            $(this.resetLink).addClass("hidden");
        },
        filterData: function() {
            console.log("filterData")
            // use this.params to filter data
                //  modify this.models and this.facets
                // this.models = response.models;
                // this.facets = response.facets

                // [{"name":"drive","value":"All Wheel Drive"}];
                var filteredModels = _.filter(this.models, function(o) {
                    var checkTrue = false;
                    this.params.some(function(el) {
                        checkTrue = _.isMatch(o, el);
                      }.bind(this));

                    if (checkTrue) {return true;}
                }.bind(this));

                var filteredConstModels = _.filter(this.constModels, function(o) {
                    var checkTrue = false;
                    this.params.some(function(el) {
                        checkTrue = _.isMatch(o, el);
                      }.bind(this));

                    if (checkTrue) {return true;}
                }.bind(this));
                // extend models array with new filtered models
                //this.models = filteredModels;
                // if both models and constModels are equal then assign filtred models to this models
                if (_.eq(this.models, this.constModels)) {
                    this.models = filteredModels;
                } else {
                    if (filteredModels.length > filteredConstModels.length) {
                        this.models.push.apply(this.models, filteredConstModels);
                    }
                    this.models.push.apply(this.models, filteredConstModels);
                    if (_.isMatch(this.models, filteredConstModels)) {
                        this.models = _.intersection(this.models, filteredConstModels);
                    }
                }
                this.render();
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
}(window.jQuery, Template, Utils, Router, Cardata));
