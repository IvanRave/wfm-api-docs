(function (app) {
	if (!app.cnst || !app.cnst.auth) {
		throw new Error('required cnst-helper');
	}

	if (!app.urlHelper) {
		throw new Error('required url-helper');
	}

	app.authHelper = {};

	var cbkAuthInterval = function (redirectUri, authScope, next) {
		var authLocation = authScope.authWindow.location;

		var authLocationHref;
		// Uncaught SecurityError: Blocked a frame with origin "http://localhost:12345" from accessing
		// a frame with origin "http://localhost:1337". Protocols, domains, and ports must match.
		try {
			authLocationHref = authLocation.href;
		} catch (errSecurity) {}

		console.log(authLocationHref, redirectUri);

		if (authLocationHref) {
			var hrefParts = authLocationHref.split('?');

			// if https://some.ru -> //some.ru
			if (hrefParts[0].indexOf(redirectUri) >= 0) {
				// Get code or error
				var authResponse = hrefParts[1];

				clearInterval(authScope.authInterval);
				// Close popup
				authScope.authWindow.close();

				next(authResponse);
			}
		}
	};

	var reqLogout = function () {
		var authHeader = window.authorizations.authz['oauth2'].value;

		var reqUri = app.cnst.SESSION_ENDPOINT;
		var options = {
			cache : false,
			type : 'DELETE',
			headers : {
				'Authorization' : authHeader
			}
		};

		$.ajax(reqUri, options).done(function () {
			window.authorizations.remove('oauth2');
		}).fail(function (err) {
			console.log(err);
			alert('Error to logout');
		});
	};

	var handleAuthResult = function (scsNext, failNext, authResult) {
		var resultObj = app.urlHelper.calcObjFromUrl(authResult);

		console.log(resultObj);

		if (!resultObj.code) {
			alert('Wrong authorization: no code');
			return;
		}

		var reqBody = {
			code : resultObj.code,
			client_id : app.cnst.auth.ID_OF_AUTH_CLIENT,
			redirect_uri : app.cnst.auth.REDIRECT_URI
		};

		var options = {
			cache : false,
			type : 'POST',
			// need for CORS requests without preflight request
			// contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
			// No need cookies - Safari doesn't set 3-rd side cookies (with default settings)
			// xhrFields : {
			// // For CORS request to send and receive cookies
			// withCredentials : true
			// }
		};

		var reqUri = app.cnst.SESSION_ENDPOINT;
		reqUri += '?' + 'code=' + reqBody.code + '&client_id=' + reqBody.client_id + '&redirect_uri=' + encodeURIComponent(reqBody.redirect_uri);

		$.ajax(reqUri, options).done(scsNext).fail(failNext);
	};

	var openAuth = function (next) {
		// open auth
		var idOfAuthClient = app.cnst.auth.ID_OF_AUTH_CLIENT;
		var redirectUri = app.cnst.auth.REDIRECT_URI;
		var authUri = app.cnst.auth.AUTH_URI;

		// Object to catch changes in bind method
		var authScope = {
			authWindow : null,
			authInterval : null
		};

		authScope.authInterval = setInterval(cbkAuthInterval.bind(null, redirectUri, authScope, next),
				1000);

		authScope.authWindow = window.open(authUri +
				'?response_type=code' +
				'&client_id=' + idOfAuthClient +
				'&redirect_uri=' + encodeURIComponent(redirectUri),
				'_blank',
				'location=yes,height=570,width=520,scrollbars=yes,status=yes');
	};

	/**
	 * Handle a success response from a server
	 * @param {Object} jqrTarget - A button, fired this event
	 * @param {Object} sessionOfUser - { uname, accessToken, expiredIn (in seconds)}
	 */
	var handleScs = function (jqrTarget, sessionOfUser) {
		$('#uname-container').text(sessionOfUser.uname);
		$('#login-false-block').hide();
		jqrTarget.removeAttr('disabled');
		$('#login-true-block').show();

		// save accessToken to cookies (or store in code?)
		// in cookies - every request (simple image or js code - with cookie)
		// in code - when update a page - lost a session (but - one click authorization)
		app.sessionOfUser = sessionOfUser;

		// window.authorizations.add("key", new window.ApiKeyAuthorization("access_token",
		// sessionOfUser.accessToken,
		// "query"));

		window.authorizations.add("oauth2", new window.ApiKeyAuthorization("Authorization",
				"Bearer " + sessionOfUser.accessToken,
				"header"));

		console.log('response from wfm-node', app.sessionOfUser);
	};

	var handleFail = function (jqXhr) {
		if (jqXhr.status === 422) {
			alert(jqXhr.responseJSON.errId);
			return;
		} else {
			alert('Error: status: ' + jqXhr.status + '; message: ' + jqXhr.responseText);
			return;
		}

		console.log('error from wfm-node', jqXhr);
	};

	app.authHelper.clickLoginBtn = function (clickEvent) {
		var jqrTarget = $(clickEvent.currentTarget);
		jqrTarget.attr({
			disabled : true
		});

		// Entire process
		openAuth(handleAuthResult.bind(null,
				handleScs.bind(null, jqrTarget), handleFail));
	};

	app.authHelper.clickLogoutBtn = function () {
		$('#login-true-block').hide();
		$('#uname-container').text('');
		$('#login-false-block').show();

		reqLogout();
	};
})(window.wfm);
