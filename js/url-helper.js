(function (app) {
	app.urlHelper = {};

	app.urlHelper.calcObjFromUrl = function (search) {
		return search ? JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
			function (key, value) {
			return key === "" ? value : decodeURIComponent(value);
		}) : {};
	};

})(window.wfm);
