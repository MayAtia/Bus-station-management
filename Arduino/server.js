// Arduino/server.js

const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Database connection
mongoose.connect('mongodb://localhost:27017/busstop', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define a schema for storing station data
const stationDataSchema = new mongoose.Schema({
    count: Number,
    timestamp: { type: Date, default: Date.now }
});

const StationData = mongoose.model('StationData', stationDataSchema);

// Endpoint to receive data from ESP8266
app.post('/station/data', (req, res) => {
    const peopleCount = req.body.count;
    console.log(`Received people count: ${peopleCount}`);

    const newStationData = new StationData({ count: peopleCount });
    newStationData.save()
        .then(() => res.status(200).send('Data saved successfully'))
        .catch(err => res.status(500).send('Failed to save data'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
