const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true },
  hash: { type: Buffer, required: true }, // Password Hash
  displayName: { type: String, required: true },
  projects: [String],
  flags: {
    isAdmin: { type: Boolean, required: true, default: false },
    isDisabled: { type: Boolean, required: true, default: false },
  },
});

module.exports = mongoose.model('User', userSchema);
