const express = require('express');
const router = express.Router();
const User = require('../../smart-bus-stop/models/User');
const UserEvent = require('../../smart-bus-stop/models/UserEvent');

router.post('/login', async (req, res) => {
  const { name, idCard } = req.body;
  console.log(`Received login request with name: ${name} and ID card: ${idCard}`); 
  try {
    let user = await User.findOne({ name, id_card: idCard });
    if (!user) {
      user = new User({ name, id_card: idCard });
      await user.save();
      console.log(`New user created: ${name} with ID card: ${idCard}`);  
    } else {
      console.log(`User found: ${name} with ID card: ${idCard}`);  
    }
    res.status(200).send(user);
  } catch (error) {
    console.error(`Error during login: ${error}`);  
    res.status(500).send(error);
  }
});

router.post('/userEvent', async (req, res) => {
  const { idCard, lineNumber, station } = req.body;
  console.log(`Received user event with idCard: ${idCard}, lineNumber: ${lineNumber}, station: ${station}`);  
  try {
    const userEvent = new UserEvent({ userId: idCard, lineNumber, station, isHere: true });
    await userEvent.save();
    console.log(`User event saved for userId: ${idCard}, lineNumber: ${lineNumber}, station: ${station}, isHere: true`); 
    res.status(200).send(userEvent);
  } catch (error) {
    console.error(`Error saving user event: ${error}`);  
    res.status(500).send(error);
  }
});

router.post('/updateUserEvent', async (req, res) => {
  const { eventId, isHere } = req.body;
  console.log(`Updating user event with eventId: ${eventId}, isHere: ${isHere}`);  
  try {
    const userEvent = await UserEvent.findById(eventId);
    if (userEvent) {
      userEvent.isHere = isHere;
      await userEvent.save();
      console.log(`User event updated with eventId: ${eventId}, isHere: ${isHere}`);  
      res.status(200).send(userEvent);
    } else {
      res.status(404).send('User event not found');
    }
  } catch (error) {
    console.error(`Error updating user event: ${error}`);  
    res.status(500).send(error);
  }
});

module.exports = router;
