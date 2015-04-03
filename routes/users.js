var User = require('../models/User').User;

exports.signupForm = function(req,res){
	res.render('users/signup',{
		title: 'SignUp new User'
	});
};

exports.signupSend = function(req,res,next){
	var name = req.body.name;
	var password = req.body.password;
	var user = new User({
		name: name,
		password: password
	});
	user.save(function(err){
		if (err) next(err);
		res.redirect('/');
	});
};