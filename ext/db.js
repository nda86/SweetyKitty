var mongoose = require('mongoose');
var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost/kittyDB'
var db = mongoose.connect(mongoUri);
module.exports = db;