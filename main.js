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
                    <input type="checkbox" name="body" data-id="1000" class="toggle" value="${car.body}">
                    ${car.body}
                  </label>
                </div>`
    },
    displayDriveTypes: function(car) {
        return `<div class="checkbox">
                  <label>
                    <input type="checkbox" name="drive" data-id="1008" class="toggle" value="${car.drive}">
                    ${car.drive}
                  </label>
                </div>`
    }
};

(function ($) {
    "use strict";

    var util = {

	};

    var App = {
		init: function () {
            this.store();
			this.bindEvents();
		},
		bindEvents: function () {
            $('.types-container')
				.on('change', '.toggle', this.toggle.bind(this))
		},
        render: function() {
            this.renderThumbs();
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
                    this.todos = JSON.parse(JSON.stringify(data.models));
                    this.initialToDos = JSON.parse(JSON.stringify(data.models));
                    this.render();
                }.bind(this));
			}
		},
        toggle: function(e) {
            var name = $(e.target).attr("name")

            for(var i = this.todos.length; i--;){
                if (this.todos[i][name] !== $(e.target).val()) {
                    this.todos.splice(i, 1);
                }
            }
            this.render();
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
