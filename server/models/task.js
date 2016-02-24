var mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({
    owner        : { type: String, required: true },
    name         : { type: String, required: true },
    createdOn    : { type: Date, default: Date.now, required: true },
    notes        : { type: String },
    dependencies : { type: Array },
    dueDate      : { type: Date },
    label        : { type: String },
    location     : { type: String },
    subTasks     : { type: Array },
    flags        : {
        isActive     : { type: Boolean, default: false },
        isComplete   : { type: Boolean, default: false },
        isImportant  : { type: Boolean, default: false },
        isUrgent     : { type: Boolean, default: false },
        isArchived   : { type: Boolean, default: false },
        isStarred    : { type: Boolean, default: false },
        isSubTask    : { type: Boolean, default: false },
        isDependency : { type: Boolean, default: false }
    }
});

module.exports = mongoose.model('Task', taskSchema);