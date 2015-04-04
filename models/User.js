var db = require('../ext/db');

var crypto = require('crypto');

var userSchema = new db.Schema({

	name: {
		type: String,
		require: true,
		unique: true
	},

	hash: {
		type: String,
		require: true
	},

	salt: {
		type: String,
		require: true
	},

	iteration: {
		type: Number,
		require: true
	},

	createdAt: {
		type: Date,
		default: Date.now()
	}

});

userSchema.virtual('password')
	.set(function(password){
		this.salt = String(Math.random());
		this.iteration = parseInt(Math.random()*10+1);
		this.hash = this.getHash(password);
	})
	.get(function(){
		return this.hash;
	})

userSchema.methods.getHash = function(password){
	
	var c = crypto.createHmac('sha1',this.salt);

	for(var i=0;i<this.iteration;i++){
		c = c.update(password);
	}

	return c.digest('hex');
}

userSchema.methods.validPassword = function(password){
	return this.getHash(password) === this.hash;
};

exports.User = db.model('Users',userSchema);
