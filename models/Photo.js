var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/kittyDB');

var schema = new mongoose.Schema({
	name: String,
	path: String,
	thumb_path: String
});

module.exports = mongoose.model('Photo', schema);