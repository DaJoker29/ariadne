var mongoose = require('mongoose');

var schema = {
    name:       String,
    createdOn:  Date,
    category:   String,
    current:    Boolean,
    complete:   Boolean
}

module.exports = mongoose.model('Task', schema);