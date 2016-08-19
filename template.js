class Template {
    renderFacetTitle(facet) {
        let title;
        if (facet === "range") {
            title = "Range";
        } else if (facet === "drive") {
            title = "Drivetrain";
        } else {
            title = "Body Type";
        }
        return `<h5>${title}</h5>`;
    }
    renderCheckboxes(name, value, checked) {
        checked = checked ? "checked" : "";
        let string;
        if (name === "range") {
            let label;
            switch (value) {
              case "0-100":
                label = `Up to 100 miles`;
                break;
              case "200-400":
                label = `Over 200 miles`;
                break;
              default:
                label = `100 - 200 miles`;
            }

            string = `<div class="checkbox">
                            <label>
                                <input type="checkbox" name="range" class="toggle" value="${value}" ${checked}>
                                ${label}
                            </label>
                        </div>`;
        } else {
            string = `<div class="checkbox">
                            <label>
                                <input type="checkbox" name="${name}" class="toggle" value="${value}" ${checked}>
                                ${value}
                            </label>
                        </div>`;
        }

        return string;
    }
    displayThumb (car) {
        return `<div class="col-sm-6 col-md-4">
                          <a href="${car.link}" target="_blank">
                            <div class="thumbnail">
                              <img class="thumbnail-pic" src="${car.imageURL}">
                              <div class="caption">
                                <p class="thumbnail-yearmake">${car.year} ${car.make}</p>
                                <p class="thumbnail-model">${car.model}</p>
                                <p>Up to ${car.maxRange} miles of range</p>
                                <p>
                                  <span class="thumbnail-msrp">Starting at</span> $${car.price}
                                  <span class="thumbnail-msrp">MSRP</span>
                                </p>
                              </div>
                            </div>
                          </a>
                      </div>`;
    }
}
