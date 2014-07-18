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
			contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
			// TODO: #41! generate this string using one command
			data : 'code=' + reqBody.code + '&client_id=' + reqBody.client_id + '&redirect_uri=' + reqBody.redirect_uri,
			xhrFields : {
				// For CORS request to send and receive cookies
				withCredentials : true
			}
		};

		// No response, just set cookies
		$.ajax(app.cnst.API_URI + '/api/account/session', options).done(scsNext).fail(failNext);
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
				'&redirect_uri=' + redirectUri,
				'_blank',
				'location=yes,height=570,width=520,scrollbars=yes,status=yes');
	};

	var handleScs = function (jqrTarget, accountInfoData) {
		jqrTarget.hide();
    $('#uname-container').text(accountInfoData.uname);
		console.log('response from wfm-node');
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

	app.authHelper.clickOpenAuthBtn = function (clickEvent) {
		var jqrTarget = $(clickEvent.currentTarget);
		jqrTarget.attr({
			disabled : true
		});

		// Entire process
		openAuth(handleAuthResult.bind(null,
				handleScs.bind(null, jqrTarget), handleFail));
	};
})(window.wfm);
