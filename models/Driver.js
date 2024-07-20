const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  station_id: String,
  waiting_count: Number,
  timestamp: Date
});

const driverSchema = new mongoose.Schema({
  employee_number: String,
  line_number: String,
  stations: [stationSchema]
});

module.exports = mongoose.model('Driver', driverSchema);
