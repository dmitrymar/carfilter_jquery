/* // do a reset function if all checkboxes are unchecked or entire one facet is checked */
// replace serizalize with native FormData https://www.sitepoint.com/easier-ajax-html5-formdata-interface/
// http://smalljs.org/client-side-routing/page/


(function ($, Template) {
    "use strict";

    var App = {
		init: function () {

            // Used to keep track of which filter is a proiority. Beginning elements in the array become a priority
            // E.g. ["drive", "body"]
            sessionStorage.clear();
            this.facets = ["body", "drive"]; // immutable
            this.resetLink = $("#resetFilters").closest('p');
            this.deferredData = $.Deferred();
            this.deferredReset = $.Deferred();
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

            this.deferredData.progress(function () {
                console.log("model changed");
                console.log(this.models);
                this.render();
                this.setHistory();
            }.bind(this));

            this.deferredReset.progress(function () {
                console.log("deferredReset");
            }.bind(this));
		},
        changeView: function(e) {
            console.log("changeView")
            this.firstLoad = false;
            this.selectedFacet = $(e.target).attr("name");
            this.createParam(e);
            this.selectPanel(e);
            this.setParentFilter(e);
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
            sessionStorage.clear();
        },
        resetFacets: function() {
            this.parentFilter = "";
            $(".facet").removeClass("selected");
            $(".toggle").attr("checked", false);
            $(this.resetLink).addClass("hidden");
        },
        requestData: function(e) {
            console.log("requestData")
            console.log(e)
            if (!sessionStorage.getItem(this.params)) {
                var endpoint = "/api/models";
                var $xhr = $.getJSON(endpoint, this.params);
                $.when($xhr)
                .done( function(data) {
                    // store car models in mutable array. The values change depending on user selection
                    this.models = JSON.parse(JSON.stringify(data.models));
                    this.deferredData.notify();
                }.bind(this));
            } else {
                console.log(this.params)
                var storageParam = !this.params ? null : this.params;
                var storageData = JSON.parse(sessionStorage.getItem(storageParam))
                this.models = storageData.models;
                this.deferredData.notify();
            }
        },
        createParam: function(e) {
            console.log("createParam")
            var name = $(e.target).attr("name"); // e.g. body or drive
            var value = $(e.target).val();
            var string = name + "=" + value;
            string = string.replace(/\s/g,'%20');
            if (this.params) {
                if (this.params.includes(string)) {
                    console.log("replace string")
                    var prefix = this.params.includes("&") ? "&" : "?";
                    this.params = this.params.replace(string,'');
                    this.params = this.params.replace("?&",'?');
                } else {
                    this.params = this.params + "&" + string;
                }
            } else {
                this.params = "?" + string;
            }
            this.params = this.params === "?" ? null : this.params;


            console.log(this.params);
		},
        setHistory: function () {
            console.log("setHistory")
            var params;
            var facetArray = [];
            var dataObj = {params:params, facets:facetArray, models:this.models};
            $(".toggle").each(function(key, value) {
                facetArray.push({
                    name: $(value).attr("name"),
                    value: $(value).val(),
                    checked: $(value).is(":checked")
                })
            })
            console.log(this.params);
            if (!this.params) {
                params = null;
                console.log("no param");
                console.log(params);
                dataObj.params = params;
                history.replaceState(dataObj, null, "/");
            } else {
                params = this.params;
                dataObj.params = params;
                history.pushState(dataObj, null, params);
            }
            sessionStorage.setItem(params, JSON.stringify(dataObj));
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
