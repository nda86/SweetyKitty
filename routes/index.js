exports.index = function(req,res){
	res.render('index',{
		title: 'Sweety Kitty|Home',
		user: req.session.user
	});
}