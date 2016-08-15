var Template = {
    displayThumb: function(car) {
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
                        </div>`
        return template
    },
    displayName: function(car) {
        var checked = car.checked ? "checked" : "";
        var disabled = car.disabled ? "disabled" : "";
        var template = `<h5>${car.title}</h5>
                        <div class="checkbox ${disabled}">
                          <label>
                            <input type="checkbox" name="${car.name}" data-id="" class="toggle" value="${car.value}" ${checked} ${disabled}>
                            ${car.value}
                          </label>
                        </div><br><br>`
        //console.log(car.drive)
        return template
    }
};
