(function (app) {
	app.cnst = {};

	// REQ
	app.cnst.API_URI = 'https://wfm-report.herokuapp.com';
  
  app.cnst.SESSION_ENDPOINT = app.cnst.API_URI + '/api/account/session';
  
  app.cnst.BASE_CONTAINER = 'swagger-ui-container';

	// AUTH

	app.cnst.auth = {};

	app.cnst.auth.ID_OF_AUTH_CLIENT = 'api-docs';
	app.cnst.auth.REDIRECT_URI = '//ivanrave.github.io/wfm-api-docs' + '/handle-auth-code.html';

	app.cnst.auth.AUTH_URI = '//petrohelp-auth.herokuapp.com' + '/dialog/authorize';
})(window.wfm);
