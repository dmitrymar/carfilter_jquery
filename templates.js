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
        var template = `<div class="checkbox">
                          <label>
                            <input type="checkbox" name="body" data-id="" class="toggle" value="${car.body}" ${car.bodyChecked}>
                            ${car.body}
                          </label>
                        </div>`
        // hide from Body Types panel
        return template
    },
    displayDriveTypes: function(car) {
        var template = `<div class="checkbox">
                          <label>
                            <input type="checkbox" name="drive" data-id="" class="toggle" value="${car.drive}" ${car.driveChecked}>
                            ${car.drive}
                          </label>
                        </div>`
        //console.log(car.drive)
        if (car.driveDisplay) { return template }
    },
    displayName: function(car) {
        var template = `<div class="checkbox">
                          <label>
                            <input type="checkbox" name="${car.attribute}" data-id="" class="toggle" value="${car.value}" ${car.checked}>
                            ${car.value}
                          </label>
                        </div>`
        //console.log(car.drive)
        if (car.display) { return template }
    }
};
