const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  station_id: String,
  line_number: String,
  waiting_count: Number,
  timestamp: Date
});

const managerSchema = new mongoose.Schema({
  employee_number: String,
  filters: Object,
  data: [dataSchema]
});

module.exports = mongoose.model('Manager', managerSchema);
