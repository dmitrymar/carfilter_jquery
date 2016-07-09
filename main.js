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
            this.filterData();


            if (this.levels.indexOf(name) === -1) {
                this.levels.push(name)
            }
            console.log($(".toggle").is(":checked"))




            // set attribute checked value to true or false
            this.attributes[name].map(function(type) {
                if (type.value === selectedValue) {
                    type.checked = !type.checked;
                    //console.log(type)
                }
            })

            //set model display value to true or false
            this.models.map(function(car) {
                // display all if all checboxes are unchecked
                if (!$(".toggle").is(":checked")) {
                    car.display = true;
                } else {
                    var previouslyChecked = $(checkbox).filter("[value='" + car[name] + "']").is(":checked");

                    if (checked) {
                        if (car[name] !== selectedValue) {
                            // if display has previously been set to true then keep true
                            car.display = previouslyChecked ? true : false;
                        } else {
                            car.display = true;
                        }
                    } else {
                        //if checkbox is unchecked
                        if (car[name] !== selectedValue) {
                            car.display = previouslyChecked === false ? false : true;
                        } else {
                            car.display = false;
                        }
                    }
                }
            }.bind(this))
            //console.log(this.attributes[name])

            this.render();
		},
        filterData: function() {
            // either make new ajax request or filter current data (this.models)
            console.log("filteringing data");
        },
        renderPanels: function() {
            for (var prop in this.attributes) {
                var string = [];
                string = this.attributes[prop].map(function(car){
                    return Template.displayName(car)
                });
            //console.log(this.attributes[prop])
                $("#"+prop+"-container").html(string.join(''));
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
