var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username : { type: String, required: true, unique: true },
    password : { type: Buffer, required: true },
    flags    : {
        isAdmin: { type: Boolean, required: true, default: false }
    }
});

module.exports = mongoose.model('User', userSchema);