const mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
	name: {
		type: String,
		unique: false,
		allowNull: false,
		index: true
	},

	email: {
		type: String,
		unique: true,
		allowNull: false,
		index: true
	},

	password: {
		type: String,
		unique: true,
		allowNull: false,
		index: true
	},

	age: {
		type: Number,
		unique: false,
		allowNull: false,
		index: true
	},

	gender: {
		type: String,
		unique: false,
		allowNull: false,
		index: true
	},

	isAuthenticated: {
		type: String, 
		default: false
	}
});

var User = module.exports = mongoose.model('User', UserSchema);
module.exports = User;

