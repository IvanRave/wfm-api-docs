(function (app) {
	app.cnst = {};

	// REQ
	app.cnst.API_URI = 'https://wfm-report.herokuapp.com';
  ////'http://localhost:3000';
  
  app.cnst.BASE_CONTAINER = 'swagger-ui-container';

	// AUTH

	app.cnst.auth = {};

	app.cnst.auth.ID_OF_AUTH_CLIENT = 'api-docs';
	app.cnst.auth.REDIRECT_URI = '//localhost:39393/handle-auth-code.html';

	// var authUrl = isProd ? '//petrohelp-auth.herokuapp.com' : 'http://localhost:1337';
	app.cnst.auth.AUTH_URI = 'http://localhost:1337/dialog/authorize';
})(window.wfm);
