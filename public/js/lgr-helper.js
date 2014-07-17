(function (app) {
	app.lgr = {};

	app.lgr.info = function (msg) {
		console.log(JSON.stringify(msg));
	};

	app.lgr.error = function (err, addt) {
		console.log(err.message);
		console.log(err.stack);

		if (addt) {
			console.log(JSON.stringify(addt));
		}
	};
})(window.wfm);
