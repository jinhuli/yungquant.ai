var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: String,
	googleId: String,
},{
	collection: 'users'
});

var userData = mongoose.model('users', userSchema);

module.exports = userData;