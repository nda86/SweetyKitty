var User = require('../models/User').User;

exports.signupForm = function(req,res){
	res.render('users/signup',{
		title: 'SignUp new User'
	});
};

exports.signupSend = function(req,res,next){
	var name = req.body.name.toLowerCase();
	var password = req.body.password;
	var user = new User({
		name: name,
		password: password
	});
	user.save(function(err,user){
		if (err) return res.render('users/signup',{
			title: 'This name is busy',
			err: 'This name is busy'
		});
		req.session.user = user.name;
		res.redirect('/');
	});
};

exports.loginForm = function(req,res){
	res.render('users/login',{
		title: 'Login'
	});
}

exports.loginSend = function(req,res,next){
	var name = req.body.name.toLowerCase();
	var password = req.body.password;
	User.findOne({name: name},function(err,user){
		if (err) return next(new Error('Something went wrong with DB'));
		if (!user) return res.render('users/login',{
										title: 'No User',
										hint:'No user with that name'
									});
		if(!user.validPassword(password)) return res.render('users/login',{
																title: 'Password is invalid',
																hint:'Password is invalid. Try it again'
															});
			req.session.user = user.name;

			res.redirect('/');
	});
};

exports.logOut = function(req,res){
	req.session.destroy(function(err){
		if(err) next(err);
		res.redirect('/');
	});
};