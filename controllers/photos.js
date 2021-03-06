var Photo = require('../models/Photo');
var pathUtil = require('path');
var fs = require('fs');

// запрашиваем в базе фоточки и отправляем их в рендер 
exports.list = function(req,res,next){
	Photo.find(function(err,photos){
		if(err) next(err);
		res.render('photos/show',{
			title: 'Photo Gallery',
			photos: photos,
			user: req.session.user
		});
		
	});
};

// при запроси с страницы загрузки рендерим страницу с формой
exports.form = function(req,res){
	res.render('photos/upload',{
		title: 'Upload Photo',
		user: req.session.user
	});
};


// при submite формы
// dir это там где у нас лежат фоточки относительно public
exports.submit = function(dir){
	return function(req,res,next){
		// name подпись фоточки получаемое с формы
				var nameImg = req.body.nameImg;
		//newName - путь для thumbnail'a для загружаемой фотки
		//это значение определяется в моём модуле thumbnails в функции makeThumbnail 
		//после того как мин сделана..путь миньки пишется в объект file который доступен по 
		// req.files.photo
			// абсолютнй путь миньки
				var x = req.files.photo.newName;
			//делаем его относительным(относительно /public)
				var thumb_path = x.substring(x.lastIndexOf(dir));
		// путь куда сохраняется фотка public/photos/file
				var oldPath = req.files.photo.path;
		// change public/photos/file to /photos/file
				var path = pathUtil.resolve(oldPath,
						pathUtil.join(dir,req.files.photo.name));
		// make a new object in our collection(mongoDB)
				var kitty = new Photo({
					name: nameImg,//sign fotki from form
					path: path,//path fotki from req.files.photo
					thumb_path: thumb_path//patn of thumbnail from req.files.photo
				});
		// save object to db
				kitty.save(function(err){
					if (err) return console.log(err);
					console.log('save done');
					res.redirect('./upload');
				});
	}
};


exports.open = function(dir){
	return function(req,res,next){
		var id = req.params.id;
		var img = Photo.findById(id,function(err,photo){
			if (err) return next(err);
			var file = photo.path;
			var options = {
				root: dir + '/public/',
				headers: {
					'x-timestamp': Date.now(),
					'x-sent': true
				}
			};
			res.sendfile(file,options,function(err){
				if(err) next(err);
			});
		})
	}
}


exports.download = function(dir){
	return function(req,res,next){
		var id = req.params.id;
		Photo.findById(id,function(err,photo){
			if (err) return next(err);
			var ext = pathUtil.extname(photo.path);
			var path = dir + '/public/' + photo.path;
			var filename = photo.name + ext;
			res.download(path,filename,function(err){
				if(err) next(err);
			});
		})
	}
}


exports.updateSign = function(req,res,next){
	var id = req.params.id;
	var newName = req.body.newName;
	Photo.findByIdAndUpdate(id,{$set: {name: newName}},{upset: true},
		function(err){
			if(err) next(err);
			res.redirect('/show#' + id);
		});
};

exports.delete = function(dir){
	return function(req,res,next){
				var id = req.params.id;
				Photo.findByIdAndRemove(id,function(err,file){
					var original = pathUtil.join(dir,file.path);
					var min = pathUtil.join(dir, file.thumb_path);
					if(err) next(err);
						fs.unlink(original,function(err){
							if(err) next(err);
							fs.unlink(min,function(err){
								if(err) next(err);
									res.redirect('/show');
							})
						});
				});
	}
}