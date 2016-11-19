const mongoose = require('mongoose');
const randtoken = require('rand-token');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const appSchema = new Schema({
  appName: { type: String, required: true, index: true, unique: true, trim: true },
  token: { type: String, default: () => randtoken.generate(64) },
});

appSchema.plugin(uniqueValidator);

module.exports.App = mongoose.model('App', appSchema);