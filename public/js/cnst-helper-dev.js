(function (app) {
	app.cnst = {};

	// REQ
	app.cnst.API_URI = 'http://localhost:3000';

	app.cnst.BASE_CONTAINER = 'swagger-ui-container';

	// AUTH

	app.cnst.auth = {};

	app.cnst.auth.ID_OF_AUTH_CLIENT = 'api-docs';
	app.cnst.auth.REDIRECT_URI = '//localhost:39393' + '/handle-auth-code.html';

	app.cnst.auth.AUTH_URI = '//localhost:1337' + '/dialog/authorize';
})(window.wfm);
