var path = require('path');
var lwip = require('lwip');




exports.makeThumbnail = function(root,file){
	var img = path.join(root,file.path);
	console.log(img);
	var newName = img.substring(0,img.lastIndexOf('.')) + '__min.' + file.extension;
	console.log(newName);
	lwip.open(img,function(err,image){
		if(err) console.log(err);
		image.batch()
			.resize(250,250)
			.writeFile(newName,function(err){
				if(err) return console.log(err);
			});

	})
		return newName;
};