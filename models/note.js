const mongoose = require('mongoose');

var NoteSchema = mongoose.Schema({
	subjetct: {
		type: String,
		unique: false,
		allowNull: false,
		index: true
	},

	content: {
		type: String,
		unique: true,
		allowNull: false,
		index: true
	},

	tag: {
		type: String,
		unique: true,
		allowNull: false,
		index: true
	}
});

var Note = module.exports = mongoose.model('Note', NoteSchema);
module.exports = Note;

