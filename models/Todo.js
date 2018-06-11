var mongoose = require('mongoose');

var task = new mongoose.Schema({
	idUser: mongoose.Schema.Types.ObjectId,
	text: String,
	note: String,
	done: Boolean
});

var todo = new mongoose.Schema({
	date: Number,
	tasks:[task]
},

	{
		collection: 'todos'
	}
	
);

module.exports = mongoose.model('Todo', todo);