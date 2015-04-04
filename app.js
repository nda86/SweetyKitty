var http = require('http');
var ejs = require('ejs');
var engine = require('ejs-locals');
var express = require('express');
var converter = require('byte-converter');
var session = require('express-session');
var app = express();

var root = __dirname;



/*========================================
=            validation image            =
========================================*/
var extImg = ['jpg','jpeg','gif','png'];
var sizeImg = 3000000;
/*-----  End of validation image  ------*/



// my utils
var thumb = require('./utils/thumbnails');
// plugin routes
// var routes = require('./routes');





// controllers
var mainCtrl = require('./controllers/main');
var photosCtrl = require('./controllers/photos');
var usersCtrl = require('./controllers/users');



// utilite for work with path,folder e.t.c
var path = require('path');

var morgan = require('morgan');
var servefavicon = require('serve-favicon');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var errorhandler = require('errorhandler');
var methodOverride = require('method-override');

// parsing multipart
var multer = require('multer');

// use ejs-locals for all ejs templates:
app.engine('ejs',engine);

// setup port
app.set('port', process.env.PORT || 3000);
// assign template engine
app.set('view engine', 'ejs');
// assign dir for views
app.set('views',path.join(__dirname,'views'));
// path to uor fotochek
app.set('photos','/photos');



// logger
app.use(morgan('tiny'));
// session storage
app.use(session({
	secret: 'keyboard cat',
	cookie: {
		path: '/',
		httpOnly: true,
		secure: false,
		maxAge: null
	}
}));
// serve static
app.use(serveStatic(path.join(__dirname,'public')));
// load favicon
app.use(servefavicon(path.join(__dirname,'public/favicon.ico')));
// parsing data from forms
app.use(bodyParser.urlencoded());
// parsing JSON
app.use(bodyParser.json());
// methodOverride
app.use(methodOverride());



app.get('/',mainCtrl.home);
app.get('/show', photosCtrl.list);
app.get('/upload',photosCtrl.form);
app.get('/signup',usersCtrl.signupForm);
app.get('/login',usersCtrl.loginForm);
app.get('/logout',usersCtrl.logOut);

var options = {
	dest: './public/photos/',
	onFileUploadStart: function(file,req,res){
		console.log(file);
		if((extImg.indexOf(file.extension)<0) || (file.size > sizeImg)){
			console.log('NO VALID');
			return false;
		}
	},
	rename: function(fieldname,filename,req,req){
		return 'www_' + filename;	
	},
	onFileUploadComplete: function(file,req,res){
		var newName = thumb.makeThumbnail(root,file);
		console.log('from onFileComplete: ' + newName);
		file['newName'] = newName;
	}
}
app.post('/upload', multer(options), 
	photosCtrl.submit(app.get('photos')));

app.get('/photo/:id/open',photosCtrl.open(root));
app.get('/photo/:id/download',photosCtrl.download(root));
app.post('/photo/:id/updateSign',photosCtrl.updateSign);
app.get('/photo/:id/delete',photosCtrl.delete);


app.post('/signup',usersCtrl.signupSend)
app.post('/login',usersCtrl.loginSend)
// error hanler
app.use(errorhandler());


http.createServer(app).listen(app.get('port'),function(){
	console.log('Express server listening on port: ' + app.get('port'));
});