var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/kittydb');
module.exports = db;