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
		uuid: function () {
			/*jshint bitwise:false */
			var i, random;
			var uuid = '';

			for (i = 0; i < 32; i++) {
				random = Math.random() * 16 | 0;
				if (i === 8 || i === 12 || i === 16 || i === 20) {
					uuid += '-';
				}
				uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
			}

			return uuid;
		},
		pluralize: function (count, word) {
			return count === 1 ? word : word + 's';
		},
		store: function (data) {
            var GARAGE = [];
			if (arguments.length) {
                // push in new data
				GARAGE.push(data);
			} else {

                $.getJSON( "/data.json", function( data ) {
                    console.log(data)
                //   $.each( data, function( key, val ) {
                //
                //     // items.push( "<li id='" + key + "'>" + val + "</li>" );
                //   });

                });
                // $.ajax({
                //   method: "GET",
                //   url: "/data.js",
                //   dataType: "json",
                //   contentType: "application/json"
                // });



				// use default data from data.js
                // var request = new XMLHttpRequest();
                // var resp;
                // request.open('GET', '/data.js', true);
                //
                // request.onload = function() {
                //   if (this.status >= 200 && this.status < 400) {
                //     // Success!
                //     resp = this.responseText;
                //
                //     // GARAGE = JSON.parse(resp) ;
                //     // console.log(GARAGE.models)
                //   }
                // };
                //
                // request.send();
                //GARAGE = JSON.parse(JSON.stringify(CARS));
			}
            return GARAGE;
		}
	};

    var App = {
		init: function () {
            this.todos = util.store();
			this.bindEvents();
            this.render();
		},
		bindEvents: function () {
            $('#body-types-container')
				.on('change', '.toggle', this.toggle.bind(this))
		},
        render: function() {
            this.renderThumbs();
            this.renderTypes("body");
            this.renderTypes("drive");
            util.store(this.todos);
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
