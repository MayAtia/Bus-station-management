const mongoose = require('mongoose');

const userEventSchema = new mongoose.Schema({
  userId: String,
  lineNumber: String,
  station: String,
  isHere: Boolean,
  count: Number, 
  timestamp: { type: Date, default: Date.now }
});

const UserEvent = mongoose.model('UserEvent', userEventSchema);

module.exports = UserEvent;
