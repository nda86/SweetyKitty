var db = require('../ext/db');

var schemaPhoto = new db.Schema({
	name: String,
	path: String,
	thumb_path: String
});

module.exports = db.model('Photo', schemaPhoto);