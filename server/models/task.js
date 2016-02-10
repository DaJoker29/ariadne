var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name:       String,
    createdOn:  { type: Date, default: Date.now},
    category:   String,
    current:    { type: Boolean, default: false },
    complete:   { type: Boolean, default: false }
});

module.exports = mongoose.model('Task', schema);