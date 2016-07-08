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
            this.hierarchy = [];
            this.store();
			this.bindEvents();
		},
		bindEvents: function () {
            $('.types-container')
				.on('change', '.toggle', this.toggle.bind(this))
		},
        render: function() {
            this.renderThumbs();
            this.renderPanels();
            this.renderTypes("body");
            this.renderTypes("drive");
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
            var name = $(e.target).attr("name"); // e.g. body or drive
            var selectedValue = $(e.target).val(); // e.g. Hatchback

            if (this.hierarchy.indexOf(name) === -1) {
                this.hierarchy.push(name)
            }
            
            console.log(this.hierarchy)

            // for(var i = this.models.length; i--;){
            //     console.log(this.models[i].drive)
            //
            //     if (this.models[i][name] === selectedValue) {
            //         console.log(this.models[i][name])
            //         this.models[i]["driveDisplay"] = true;
            //     } else {
            //         this.models[i]["driveDisplay"] = false;
            //     }
            // }
            for (var i = this.models.length -1; i >= 0; i--) {
                //console.log(this.models[i][name] === selectedValue)
                if (this.models[i][name] === selectedValue) {
                    //console.log(this.models[i]["drive"])
                    this.models[i]["driveDisplay"] = true;
                } else {
                    this.models[i]["driveDisplay"] = false;
                }
            }

            // for(var i = this.models.length; i--;){
            //
            //     // if value selected doesn't equal to object value
            //     if (this.models[i][name] !== $(e.target).val()) {
            //         // remove that object
            //         this.models.splice(i, 1);
            //         this.selected.splice(i, 1);
            //         console.log("case 1")
            //     } else {
            //         console.log("case 2")
            //
            //         this.selected.push({[name]: selectedValue});
            //         this.models[i][name + "Checked"] = this.models[i][name + "Checked"] === "checked" ? "" : "checked";
            //     }
            // }
            //console.log(this.models)
            this.render();
		},
        renderTypes: function(prop) {
            var types = [];
            var string = this.models.map(function(car){
                // if (types.indexOf(car[prop]) === -1) {
                //     console.log('%cDisplay:','background: #FF6600;',car);
                //     types.push(car[prop]);
                //     return prop === "drive" ? Template.displayDriveTypes(car) : Template.displayBodyTypes(car);
                // }
                if (car.driveDisplay) {
                    if (types.indexOf(car[prop]) === -1) {
                        //console.log('%cDisplay:','background: #FF6600;',car);
                        types.push(car[prop]);
                        return prop === "drive" ? Template.displayDriveTypes(car) : Template.displayBodyTypes(car);
                    }
                }
            });

            $("#"+prop+"-types-container").html(string.join(''));
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
