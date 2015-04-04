/*===================================================
=            options for express-session            =
===================================================*/

var optionsSession = {
					secret: 'keyboard cat',
					cookie: {
								path: '/',
								httpOnly: true,
								secure: false,
								maxAge: null
							}
				};


/*-----  End of options for express-session  ------*/


exports.optionsSession = optionsSession;



