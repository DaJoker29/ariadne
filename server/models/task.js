var mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({
    name        : { type: String, required: true },
    owner       : { type: String, required: true },
    createdOn   : { type: Date, default: Date.now, required: true },
    label       : { type: String },
    flags       : {
        isActive    : { type: Boolean, default: false },
        isComplete  : { type: Boolean, default: false },
        isImportant : { type: Boolean, default: false },
        isUrgent    : { type: Boolean, default: false },
        isArchived  : { type: Boolean, default: false }
    }
});

module.exports = mongoose.model('Task', taskSchema);