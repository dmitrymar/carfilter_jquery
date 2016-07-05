var Template = {
    displayThumb: function(car) {
        return `<div class="col-sm-6 col-md-4">
                      <a href="${car.link}">
                        <div class="thumbnail">
                          <img class="thumbnail-pic" src="${car.imageURL}">
                          <div class="caption">
                            <p class="thumbnail-yearmake">${car.year} ${car.make}</p>
                            <p class="thumbnail-model">${car.model} ${car.trim}</p>
                            <p>${car.range} miles of range</p>
                            <p>
                              <span class="thumbnail-msrp">Starting at</span> $${car.price}
                              <span class="thumbnail-msrp">MSRP</span>
                            </p>
                          </div>
                        </div>
                      </a>
                    </div>`
    },
    displayBodyTypes: function(car) {
        return `<div class="checkbox">
                  <label>
                    <input type="checkbox" name="bodyType" data-id="1000" class="toggle" value="${car.body}">
                    ${car.body}
                  </label>
                </div>`
    },
    displayDriveTypes: function(car) {
        return `<div class="checkbox">
                  <label>
                    <input type="checkbox" name="driveTrain" data-id="1008" class="toggle" value="${car.drive}">
                    ${car.drive}
                  </label>
                </div>`
    }
};

(function ($) {
    "use strict";

    var util = {
		store: function (data) {
            var GARAGE = [];
			if (arguments.length) {
                // push in new data
				GARAGE.push(data);
                return GARAGE;
			} else {

                var $xhr = $.getJSON("data.json");
                $.when($xhr)
                .done( function(data) {
                    GARAGE = JSON.parse(JSON.stringify(data.models));
                    //return GARAGE;
                    console.log(GARAGE)
                    return GARAGE
                });

			}
		}
	};

    var App = {
		init: function () {
            this.todos = this.store();
			this.bindEvents();
		},
		bindEvents: function () {
            $('#body-types-container')
				.on('change', '.toggle', this.toggle.bind(this))
		},
        render: function() {
            this.renderThumbs();
            this.renderTypes("body");
            this.renderTypes("drive");
            this.store(this.todos);
            console.log("fired")
        },
        store: function (data) {
			if (arguments.length) {
                return [].push(data);
			} else {
                var $xhr = $.getJSON("data.json");
                $.when($xhr)
                .done( function(data) {
                    this.todos = JSON.parse(JSON.stringify(data.models));
                    this.renderThumbs();
                    this.renderTypes("body");
                    this.renderTypes("drive");
                }.bind(this));
			}
		},
        toggle: function(e) {
            console.log("toggled")
            console.log(this)
            this.todos.pop()
            this.render();
			// var i = this.indexFromEl(e.target);
			// this.todos[i].completed = !this.todos[i].completed;
			// this.render();
		},
        renderTypes: function(prop) {
            var types = [];
            var string = this.todos.map(function(car){
                if (types.indexOf(car[prop]) === -1) {
                    types.push(car[prop]);
                    return prop === "drive" ? Template.displayDriveTypes(car) : Template.displayBodyTypes(car);
                }
            });

            $("#"+prop+"-types-container").html(string.join(''));
        },
		renderThumbs: function () {

            var carsString = this.todos.map(function(car){
                return Template.displayThumb(car)
            });

            $("#thumb-container").html(carsString.join(''));
		}
	};

	App.init();
}(window.jQuery));
