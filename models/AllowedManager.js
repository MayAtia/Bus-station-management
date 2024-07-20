const mongoose = require('mongoose');

const allowedManagerSchema = new mongoose.Schema({
  employee_number: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model('AllowedManager', allowedManagerSchema);
