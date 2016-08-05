/* // do a reset function if all checkboxes are unchecked or entire one facet is checked */
// replace serizalize with native FormData https://www.sitepoint.com/easier-ajax-html5-formdata-interface/
// http://smalljs.org/client-side-routing/page/


(function ($) {
    "use strict";
    var template = new app.Template();
    var controller = new app.Controller();

    var App = {
		init: function () {
            controller.init(template);
		}
	};

	App.init();
}(window.jQuery));
