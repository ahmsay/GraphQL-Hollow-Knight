const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bossSchema = new Schema({
  name: String,
  health: Number,
  locationId: String,
  reward: String
});

module.exports = mongoose.model('Boss', bossSchema);