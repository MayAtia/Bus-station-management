const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id_card: { type: String, required: true },
  // Add other fields as needed
});

const User = mongoose.model('User', userSchema);

module.exports = User;
