const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true },
  hash: { type: Buffer, required: true }, // Password Hash
  projects: [String],
  teams: [String],
  settings: {
    displayName: { type: String, required: true, default: 'New User' },
  },
  flags: {
    isAdmin: { type: Boolean, required: true, default: false },
    isDisabled: { type: Boolean, required: true, default: false },
  },
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

userSchema.virtual('email').get(function () {
  return this.username;
});

userSchema.virtual('userID').get(function () {
  return this._id;
});

userSchema.virtual('displayName')
  .get(function () {
    return this.settings.displayName;
  })
  .set(function (name) {
    this.settings.displayName = name;
  });

module.exports = mongoose.model('User', userSchema);
