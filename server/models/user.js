var mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({
    name: String,
    createdOn: { type: Date, default: Date.now},
    category: String,
    current: { type: Boolean, default: false },
    completed: { type: Boolean, default: false },
    rel: { type: String, default: 'child' }
});

var userSchema = new mongoose.Schema({
    user: String,
    tasks: [taskSchema]
});

module.exports = mongoose.model('User', userSchema);