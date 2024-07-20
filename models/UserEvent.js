const mongoose = require('mongoose');

const userEventSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  lineNumber: String,
  station: String,
  isHere: { type: Boolean, default: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserEvent', userEventSchema);
