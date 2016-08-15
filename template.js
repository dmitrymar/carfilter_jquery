class Template {
    renderFacetTitle(facet) {
        let title = facet === "body" ? "Body Type": "Drivetrain";
        return `<h5>${title}</h5>`;
    }
    renderCheckboxes(name, value, checked) {
        checked = checked ? "checked" : "";
        return `<div class="checkbox">
                    <label>
                        <input type="checkbox" name="${name}" data-id="" class="toggle" value="${value}" ${checked}>
                        ${value}
                    </label>
                </div>`;
    }
    displayThumb (car) {
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
                      </div>`;
    }
}
