// convert to classes
(function (window) {
    "use strict";

    // constructor
    function Template() {
	}

    Template.prototype.displayThumb = function (car) {
        var template = `<div class="col-sm-6 col-md-4">
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
                      </div>`;
        return template;
    };

    Template.prototype.displayName = function (car) {
        var checked = car.checked ? "checked" : "";
        var disabled = car.disabled ? "disabled" : "";
        var template = `<div class="checkbox ${disabled}">
                          <label>
                            <input type="checkbox" name="${car.name}" data-id="" class="toggle" value="${car.value}" ${checked} ${disabled}>
                            ${car.value}
                          </label>
                      </div>`;

        return template;
    };

    // Export to window
	window.app = window.app || {};
	window.app.Template = Template;
}(window));
