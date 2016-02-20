var mongoose = require('mongoose');

var feedbackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, default: Date.now() },
    message: { type: String, required: true }
});

module.exports = mongoose.model('Feedback', feedbackSchema);