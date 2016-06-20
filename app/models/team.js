const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  createdOn: { type: Date, default: Date.now, required: true },
  founder: { type: String, required: true },
  admins: [String],
  members: [String],
  projects: [String],
  settings: {
    teamName: 'The Justice League',
  },
});

teamSchema.set('toObject', { virtuals: true });
teamSchema.set('toJSON', { virtuals: true });

teamSchema.virtual('teamID').get(function () {
  return this._id;
});

teamSchema.virtual('teamName').get(function () {
  return this.settings.teamName;
}).set(function (name) {
  this.settings.teamName = name;
});


module.exports = mongoose.model('Team', teamSchema);
