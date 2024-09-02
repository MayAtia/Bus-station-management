const express = require('express');
const router = express.Router();
const AllowedManager = require('../models/AllowedManager');
const bcrypt = require('bcryptjs');  

const UserEvent = require('../models/UserEvent');

router.post('/login', async (req, res) => {
  const { employeeNumber, password } = req.body;
  try {
    const manager = await AllowedManager.findOne({ employee_number: employeeNumber });
    if (!manager) {
      return res.status(401).send('Unauthorized: Manager not found');
    }
    const isMatch = await bcrypt.compare(password, manager.password);
    if (!isMatch) {
      return res.status(401).send('Unauthorized: Incorrect password');
    }
    res.status(200).send(manager);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/indicators', async (req, res) => {
  const { busLine } = req.query;
  try {
    const totalWaiting = await UserEvent.countDocuments({ lineNumber: busLine, isHere: true });
    const totalArrived = await UserEvent.countDocuments({ lineNumber: busLine, isHere: false });
    const groupedByStation = await UserEvent.aggregate([
      { $match: { lineNumber: busLine } },
      { $group: { _id: '$station', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).send({ totalWaiting, totalArrived, groupedByStation });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/passengersPerDay', async (req, res) => {
  const { busLine } = req.query;
  try {
    const passengersPerDay = await UserEvent.aggregate([
      { $match: { lineNumber: busLine } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.status(200).send(passengersPerDay);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/passengersPerHour', async (req, res) => {
  const { busLine, date } = req.query;
  try {
    const passengersPerHour = await UserEvent.aggregate([
      { $match: { lineNumber: busLine, timestamp: { $gte: new Date(date), $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000) } } },
      {
        $group: {
          _id: { $hour: "$timestamp" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.status(200).send(passengersPerHour);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/stationClicks', async (req, res) => {
  try {
      const stationClicks = await UserEvent.find({ userId: '00000000', name: 'Stations' });
      res.status(200).json(stationClicks);
  } catch (error) {
      console.error(`Error retrieving station clicks: ${error}`);
      res.status(500).send('Server error');
  }
});

module.exports = router;
