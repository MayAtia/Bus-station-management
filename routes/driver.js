const express = require('express');
const router = express.Router();
const Driver = require('../../smart-bus-stop/models/Driver');
const UserEvent = require('../../smart-bus-stop/models/UserEvent');

router.post('/login', async (req, res) => {
  const { employeeNumber } = req.body;
  try {
    let driver = await Driver.findOne({ employee_number: employeeNumber });
    if (!driver) {
      driver = new Driver({ employee_number: employeeNumber, stations: [] });
      await driver.save();
    }
    res.status(200).send(driver);
  } catch (error) {
    res.status(500).send(error);
  }
});

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
