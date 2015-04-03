var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/kittyDB');
module.exports = db;