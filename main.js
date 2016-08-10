// Finish setting up this.deferredReset
// Maybe find a library that will alternate between ajax request and localStorage
// localStorage.getItem("todos-jquery").includes("ea7dbc7c-e236-4159-a5df-ce41e18e1d8a")
// var sessionArray = JSON.stringify([{params: this.params || ""}]);
// sessionStorage.setItem("carfilter", sessionArray);

// Convert syntax to ES6 Follow this https://github.com/tastejs/todomvc/tree/530d9b435ccf1f94e470cfdcbc304c0f949b49a0/examples/vanilla-es6

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
            this.deferredData = $.Deferred();
            this.deferredReset = $.Deferred();
            this.utils = new app.Utils();
            this.paramsArray = [];
            this.models;
            this.params;
            this.bindEvents();
            this.route();
		},
		bindEvents: function () {
            $('.facet').on('change', '.toggle', this.changeView.bind(this));
            $('#resetFilters').on('click', this.reset.bind(this));

            this.deferredData.progress(function () {
                console.log("model changed");
                console.log(this.models);
                this.render();
            }.bind(this));

            this.deferredReset.progress(function () {
                console.log("deferredReset");
            }.bind(this));
		},
        changeView: function(e) {
            console.log("changeView")
            var name = $(e.target).attr("name");
            var value = $(e.target).val();
            this.selectedFacet = name;
            this.paramsArray = this.utils.createParamArray(name, value, this.paramsArray)
            this.params = this.utils.createParamString(name, value, this.params, this.paramsArray);
            this.selectPanel(e);
            this.requestData(e)
            // render() is fired
            this.displayResetLink();
        },
        displayResetLink: function() {
            if ($(".toggle").filter(":checked").length) {
                $(this.resetLink).removeClass("hidden")
            } else {
                $(this.resetLink).addClass("hidden")
            }
        },
        selectPanel: function(e) {
            var facet = $(e.target).closest(".facet");

            if ($(facet).find(".toggle").filter(":checked").length) {
                $(facet).addClass("selected");
            } else {
                $(facet).removeClass("selected");
            }
        },
        route: function() {
            // if hash hasn't changed do this
            this.requestData();

            // if hash has changed change use director library for routing
            console.log("route")
            var author = function () { console.log("author"); };
            var books = function () { console.log("books"); };
            var viewBook = function (bookId) {
              console.log("viewBook: bookId is populated: " + bookId);
            };

            var routes = {
              '/author': author,
              '/books': [books, function() {
                console.log("An inline route handler.");
              }],
              '/books/view/:bookId': viewBook
            };

            var router = Router(routes);

            router.init();
        },
        render: function() {
            this.renderThumbs();
            this.renderFacets();
        },
        reset: function (event) {
            console.log("reset clicked");
            event.preventDefault();
            console.log(this.params)
            this.params = ""
            this.requestData();
            this.resetFacets();
            $(this.resetLink).addClass("hidden");
        },
        resetFacets: function() {
            $(".facet").removeClass("selected");
            $(".toggle").attr("checked", false);
            $(this.resetLink).addClass("hidden");
        },
        requestData: function(e) {
            console.log("requestData")
            var endpoint = "/api/models";
            var $xhr = $.getJSON(endpoint, this.params);
            $.when($xhr)
            .done( function(data) {
                // store car models in mutable array. The values change depending on user selection
                this.models = JSON.parse(JSON.stringify(data.models));
                this.deferredData.notify();
            }.bind(this));
        },
        renderFacets: function () {
            console.log("renderFacets");
                this.renderCheckboxes();
        },
        renderCheckboxes: function() {
            // To Do: Create a facet array and create a template from it
            // if a facet gets selected - it bacomes a parent so filter only children facets
            // E.g. If checkbox in the "Body" facet is clicked - it becomes a parent and
            // "Drive" facet becomes child
            var allFacets = []
            var string = [];
            var facetsToFilter; // E.g. ["body", "drive"] or ["drive"] or ["body"]

            // if nothing is clicked
            if (!this.selectedFacet) {
                facetsToFilter = this.facets
            } else {

                var item = this.selectedFacet === "drive" ? "body" : "drive";
                facetsToFilter = [item];
                console.log("facetsToFilter")
                console.log(facetsToFilter);
            }

            if ($('.facet.selected').length <= 2) {
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
                    var disabled = facetArray.length === 1 ? true : false;
                    var checked = disabled ? true : false;
                    var string = facetArray.map(function(car){
                        car.name = facet;
                        car.value = car[facet];
                        car.disabled = disabled;
                        //car.checked = checked;

                        return Template.displayName(car);
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
