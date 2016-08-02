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
            this.stateChanged = false;
            this.models;
            this.params;
            this.parentFilter; // mutable
            this.firstLoad = true; // mutable
            this.bindEvents();
            this.route();
		},
		bindEvents: function () {
            $('.facet').on('change', '.toggle', this.changeView.bind(this));
            $('#resetFilters').on('click', this.reset.bind(this));

            // if state changes then change view depending on location.search value
            window.onpopstate = function(event) {
              console.log("state changed");
              this.stateChanged = true;
              this.models = history.state.data
              console.log(this.models)
              // make sure renderFacets uses history.state.params
              this.setParentFilter();
              this.render();
              this.displayResetLink();
              //this.resetFacets()
              //this.tickCheckboxes();
              this.stateChanged = false;
            }.bind(this);

            this.deferred.progress(function () {
                console.log("model changed");
                console.log(this.models);
                this.render();
                this.setHistory();
            }.bind(this));

		},
        changeView: function(e) {
            console.log("changeView")
            this.firstLoad = false;
            this.createParam(e);
            this.selectFacet(e);
            this.setParentFilter(e);
            this.requestData(this.params)
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
        selectFacet: function(e) {
            var facet = $(e.target).closest(".facet");

            if ($(facet).find(".toggle").filter(":checked").length) {
                $(facet).addClass("selected");
            } else {
                $(facet).removeClass("selected");
            }
        },
        setParentFilter: function(e) {
            console.log("setParentFilter")
            if (e) {
                var name = $(e.target).attr("name"); // e.g. body or drive
                var facet = $(e.target).closest(".facet");

                this.parentFilter = !this.parentFilter ? name : this.parentFilter;

                if (!this.parentFilter) {
                    this.parentFilter = name;
                } else if (this.parentFilter === name && !$(facet).hasClass("selected")) {
                    // if the parent filter has been removed set parent to another selected facet
                    this.parentFilter = $(".facet").filter(".selected").data("facet");
                }
            } else {
                // when state changes by clicking back button
                var params = history.state.params;
                if (!params) {
                    this.parentFilter = undefined;
                } else {
                    console.log(params)
                    this.parentFilter = "?drive=All%20Wheel%20Drive".indexOf("drive") === 1 ? "drive" : "body";
                }

            }

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
        },
        reset: function (event) {
            console.log("reset clicked");
            event.preventDefault();
            this.firstLoad = false;
            console.log(this.params)
            this.params = ""
            this.requestData();
            this.resetFacets();
            $(this.resetLink).addClass("hidden");
            this.setHistory();
        },
        resetFacets: function() {
            this.parentFilter = "";
            $(".facet").removeClass("selected");
            $(".toggle").attr("checked", false);
            $(this.resetLink).addClass("hidden");
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
        createParam: function(e) {
            var name = $(e.target).attr("name"); // e.g. body or drive
            var value = $(e.target).val();
            var string = name + "=" + value;
            string = string.replace(/\s/g,'%20');
            if (this.params) {
                if (this.params.includes(string)) {
                    console.log("replace string")
                    var prefix = this.params.includes("&") ? "&" : "?";
                    this.params = this.params.replace(prefix + string,'');
                    console.log(this.params);
                } else {
                    this.params = this.params + "&" + string;
                }
            } else {
                this.params = "?" + string;
            }

            //console.log($(e.target).is(":checked"));
		},
        setHistory: function () {
            console.log("setHistory")
            var params;
            var facetArray = [];
            $(".toggle").each(function(key, value) {
                facetArray.push({
                    name: $(value).attr("name"),
                    value: $(value).val(),
                    checked: $(value).is(":checked")
                })
            })
            console.log(facetArray);
            if (this.params === undefined) {
                params = null;
                history.replaceState({params:params, facets:facetArray, data:this.models}, null, params);
            } else if (this.params === "") {
                params = "/"
                history.pushState({params:params, facets:facetArray, data:this.models}, null, params);
            } else {
                params = this.params;
                history.pushState({params:params, facets:facetArray, data:this.models}, null, params);
            }
        },
        renderFacets: function () {
            console.log("renderFacets");
            if (this.stateChanged) {
                this.renderCheckboxesState();
            } else {
                this.renderCheckboxes();
            }
        },
        renderCheckboxesState: function() {
            console.log("renderCheckboxesState")
            var facetArray = history.state.facets;
            $(".facet").html("");
            facetArray.map(function(car){
                var string = Template.displayName(car)
                $("#" +car.name + "-container").append(string);
            });
        },
        renderCheckboxes: function() {
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
                        car.name = facet
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
