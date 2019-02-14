const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tradableSchema = new Schema({
  name: String,
  locationIds: [String],
  found: Number
});

module.exports = mongoose.model('Tradable', tradableSchema);