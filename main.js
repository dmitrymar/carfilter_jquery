/* // do a reset function if all checkboxes are unchecked or entire one facet is checked */
(function ($, Template) {
    "use strict";

    var App = {
		init: function () {
            this.attributes =
{
    body: [
        {attribute: "body", value: "Hatchback", checked: false, display: true},
        {attribute: "body", value: "Sedan", checked: false, display: true},
        {attribute: "body", value: "SUV", checked: false, display: true}
    ],
    drive: [
        {attribute: "drive", value: "Front Wheel Drive", checked: false, display: true},
        {attribute: "drive", value: "All Wheel Drive", checked: false, display: true},
        {attribute: "drive", value: "Rear Wheel Drive", checked: false, display: true}
    ]
};
            // Used to keep track of which filter is a proiority. Beginning elements in the array become a priority
            // E.g. ["drive", "body"]
            this.levels = [];
            this.store();
			this.bindEvents();
		},
		bindEvents: function () {
            $('.facet')
				.on('change', '.toggle', this.toggle.bind(this))
		},
        render: function() {
            this.renderThumbs();
            this.renderPanels();
        },
        store: function (data) {
			if (arguments.length) {
                return [].push(data);
			} else {
                // load initial data
                var $xhr = $.getJSON("data.json");
                $.when($xhr)
                .done( function(data) {
                    // store all car model objects in immutable array. (The values here never change)
                    this.allModels = JSON.parse(JSON.stringify(data.models));
                    // store car models in mutable array. The values change depending on user selection
                    this.models = JSON.parse(JSON.stringify(data.models));
                    this.render();
                }.bind(this));
			}
		},
        toggle: function(e) {
            var checkbox = $(e.target).closest(".facet").find(".toggle");
            var name = $(e.target).attr("name"); // e.g. body or drive
            var selectedValue = $(e.target).val(); // e.g. Hatchback
            var checked = $(e.target).is(":checked"); // true or false
            this.filterData({checkbox: checkbox, name: name, selectedValue: selectedValue, checked: checked});
            this.render();
		},
        filterData: function(settings) {
            // either make new ajax request or filter current data (this.models)

            if (this.levels.indexOf(settings.name) === -1) {
                this.levels.push(settings.name)
            }

            // set attribute checked value to true or false
            this.attributes[settings.name].map(function(type) {
                if (type.value === settings.selectedValue) {
                    type.checked = !type.checked;
                }
            })
            var shownCars = [];


            //set model display value to true or false
            this.models.map(function(car) {

                // display all if all checboxes are unchecked
                if (!$(".toggle").is(":checked")) {
                    car.display = true;
                } else {
                    var previouslyChecked = $(settings.checkbox).filter("[value='" + car[settings.name] + "']").is(":checked");

                    if (settings.checked) {
                        if (car[settings.name] !== settings.selectedValue) {
                            // if display has previously been set to true then keep true
                            car.display = previouslyChecked ? true : false;
                        } else {
                            car.display = true;
                        }
                    } else {
                        //if checkbox is unchecked
                        if (car[settings.name] !== settings.selectedValue) {
                            car.display = previouslyChecked === false ? false : true;
                        } else {
                            car.display = false;
                        }
                    }
                }
                car.display ? shownCars.push(car.drive) : shownCars.push();
            }.bind(this))
            console.log(shownCars)

            //filter facets
            var attr = settings.name === "body" ? "drive" : "body";

            this.attributes[attr].map(function(type) {
                //console.log(settings.selectedValue)
                // loop over and set display false
                console.log(type.value + ' ' + (shownCars.indexOf(type.value) > -1))
                if (shownCars.indexOf(type.value) === -1) {
                    type.display = false;
                }
            })

        },
        renderPanels: function() {
            for (var prop in this.attributes) {
                var string = [];
                string = this.attributes[prop].map(function(car){
                    return Template.displayName(car)
                });
                $("#"+prop+"-container").html(string.join(''));
            }
        },
		renderThumbs: function () {
            console.log(this.models);
            var carsString = this.models.map(function(car){
                return Template.displayThumb(car)
            });

            $("#thumb-container").html(carsString.join(''));
		}
	};

	App.init();
}(window.jQuery, Template));
