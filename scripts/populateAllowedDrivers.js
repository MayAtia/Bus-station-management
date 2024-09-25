const mongoose = require('mongoose');
const AllowedDriver = require('../models/AllowedDriver');

mongoose.connect('mongodb+srv://MayAtia:852654@cluster0.tg3lc7x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

const allowedDrivers = [
  { employee_number: '1234' },
  { employee_number: '5678' }
];

AllowedDriver.insertMany(allowedDrivers)
  .then(() => {
    console.log('Allowed drivers added');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error adding allowed drivers:', err);
    mongoose.disconnect();
  });
