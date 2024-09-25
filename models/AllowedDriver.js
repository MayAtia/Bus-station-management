
const mongoose = require('mongoose');

const allowedDriverSchema = new mongoose.Schema({
  employee_number: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('AllowedDriver', allowedDriverSchema);
