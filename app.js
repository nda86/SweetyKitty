var express = require('express');
var app = express();


// require middlewares
var session = require('express-session');
var morgan = require('morgan');
var servefavicon = require('serve-favicon');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var errorhandler = require('errorhandler');
var methodOverride = require('method-override');

// modules
var path = require('path');
var ejs = require('ejs');
var engine = require('ejs-locals');
var http = require('http');
var multer = require('multer');
var serveIndex = require('serve-index');


// config variable
var confSession = require('./ext/configs').optionsSession;
var root = __dirname;


// ext
var thumb = require('./ext/thumbnails');



// configure express
app.engine('ejs',engine);
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
app.set('photos','/photos');



// controllers
var mainCtrl = require('./controllers/main');
var photosCtrl = require('./controllers/photos');
var usersCtrl = require('./controllers/users');



// logger
app.use(morgan('tiny'));
// session storage
app.use(session(confSession));
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
// serve index dir
app.use("/photos",serveIndex('public/photos/'));

var	extImg = ['jpg','jpeg','gif','png'];
var	sizeImg = 3000000;

var optionsMulter = {
		dest: './public/photos/',
		onFileUploadStart: function(file,req,res){
			if((extImg.indexOf(file.extension)<0) || (file.size > sizeImg)){
				return false;
			}
		},
		rename: function(fieldname,filename,req,req){
			console.log('dielname: ' + filename);
			return 'SK_' + Date.now();	
		},
		onFileUploadComplete: function(file,req,res){
			var newName = thumb.makeThumbnail(root,file);
			file['newName'] = newName;
		}
	};

// app.use(errorhandler());

// app.use(function(err,req,res,next){
// 	var status = err.status || 404;
// 	var msg = err.message || 'Ooops! Nothing find(';
// 	res.setStatus = status;
// 	res.render('error',{
// 		msg: msg
// 	});
// });




app.get('/',mainCtrl.home);

app.route('/signup')
	.get(usersCtrl.signupForm)
	.post(usersCtrl.signupSend);

app.route('/login')
	.get(usersCtrl.loginForm)
	.post(usersCtrl.loginSend);

app.get('/logout',usersCtrl.logOut);


app.get('/show', photosCtrl.list);

app.route('/upload')
	.get(photosCtrl.form)
	.post(multer(optionsMulter), 
			photosCtrl.submit(app.get('photos')));

app.get('/photo/:id/open',photosCtrl.open(root));

app.get('/photo/:id/download',photosCtrl.download(root));

app.post('/photo/:id/updateSign',photosCtrl.updateSign);

app.get('/photo/:id/delete',photosCtrl.delete(__dirname + '/public'));

app.use(function(req,res){
	res.status(400);
	res.render('404',{
		title: 'Oops! Nothing found-('
	});
});

var env = process.env.NODE_ENV || 'development';

if (env == 'development'){
	app.use(errorhandler());
}else{
	app.use(function(err,req,res,next){
		res.status(500);
		res.render('500',{
			title: 'Internal Server Error'
		});
	});
}



http.createServer(app).listen(app.get('port'),function(){
	console.log('Express server listening on port: ' + app.get('port'));
});