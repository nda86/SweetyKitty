var mongoose = require('mongoose');
var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost/kittyDB'
// var mongoUri = "mongodb://nda86:password171086@ds031108.mongolab.com:31108/kittydb";
var db = mongoose.connect(mongoUri);
module.exports = db;