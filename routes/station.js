const express = require('express');
const router = express.Router();
const UserEvent = require('../models/UserEvent');


router.post('/update', async (req, res) => {
    const { station, count } = req.body;

    try {
        const userEvent = new UserEvent({
            userId: '00000000',
            name: 'Stations',  
            lineNumber: station,
            station,
            isHere: true,  
            count 
        });
        await userEvent.save();
        res.status(200).send('Station click count saved successfully');
    } catch (error) {
        console.error(`Error saving station click count: ${error}`);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
