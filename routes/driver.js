const express = require('express');
const router = express.Router();
const AllowedDriver = require('../models/AllowedDriver');
const Driver = require('../models/Driver');
const UserEvent = require('../models/UserEvent'); // Ensure UserEvent model is imported

// Check if driver is allowed
router.get('/allowed', async (req, res) => {
  const { employeeNumber } = req.query;
  try {
    const allowedDriver = await AllowedDriver.findOne({ employee_number: employeeNumber });
    if (allowedDriver) {
      res.json({ allowed: true });
    } else {
      res.json({ allowed: false });
    }
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Handle driver login
router.post('/login', async (req, res) => {
  const { employeeNumber } = req.body;
  try {
    const driver = await Driver.findOne({ employee_number: employeeNumber });
    if (!driver) {
      return res.status(404).send('Driver not found');
    }
    res.json(driver);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Get user events for a specific bus line
router.get('/userEvents', async (req, res) => {
  const { busLine } = req.query;
  try {
    const userEvents = await UserEvent.aggregate([
      { $match: { lineNumber: busLine, isHere: true } },
      { $group: { _id: '$station', count: { $sum: 1 } } }
    ]);
    res.status(200).send(userEvents);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get station clicks (example route, ensure it's needed and properly implemented)
router.get('/stationClicks', async (req, res) => {
  try {
    const stationClicks = await UserEvent.find({ userId: '00000000', name: 'Stations' });
    res.status(200).json(stationClicks);
  } catch (error) {
    console.error(`Error retrieving station clicks: ${error}`);
    res.status(500).send('Server error');
  }
});

router.post('/station/confirm', async (req, res) => {
  const { station } = req.body;
  try {
    const result = await UserEvent.updateMany({ station, isHere: true }, { $set: { isHere: false } });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
