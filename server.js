require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

// MongoDB חיבור 
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('MONGO_URI is not defined in the environment variables');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

//יבוא 
const UserEvent = require('./models/UserEvent');

const userRoutes = require('./routes/user');
const driverRoutes = require('./routes/driver');
const managerRoutes = require('./routes/manager');

//ניתוב
app.use('/api/user', userRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/manager', managerRoutes);

//מניעת cache לעדכון תמידישל נתונים
app.use('/api/driver/userEvents', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// הגדרת מסלול לשמירת אירוע של המשתמש
app.get('/saveUserEvent', async (req, res) => {
  const { userId, lineNumber, station } = req.query;
  const isHere = true;

  const newUserEvent = new UserEvent({
    userId,
    lineNumber,
    station,
    isHere,
    count: 1, 
  });

  try {
    await newUserEvent.save();
    console.log('Received data:', { userId, lineNumber, station, isHere });
    res.send('Data saved successfully!');
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send('Error saving data');
  }
});

// שליפת כל האירועים
app.get('/', async (req, res) => {
  try {
    const events = await UserEvent.find().sort({ timestamp: -1 }).exec();
    res.json(events);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

// עדכון אישור הגעה לפי התחנה
app.get('/confirmStation', async (req, res) => {
  const { station } = req.query;

  //משתנים קבועים לנהג
  const stationStr = `Station ${station}`;
  const lineNumber = "123"; 

  
  console.log(`Querying for lineNumber: ${lineNumber}, station: ${stationStr}`);

  try {
    const matchingDocuments = await UserEvent.find({ lineNumber, station: stationStr });

    matchingDocuments.forEach(doc => {
      console.log(`Found document: Station ${doc.station}, isHere: ${doc.isHere}`);
    });

    
    if (matchingDocuments.length === 0) {
      console.log(`No matching stations found for ${stationStr}, skipping.`);
      return res.status(404).send(`No matching stations found for ${stationStr}, skipping.`);
    }

    
    const result = await UserEvent.updateMany(
      { lineNumber, station: stationStr, isHere: true }, 
      { $set: { isHere: false } }
    );

    
    if (result.nMatched > 0) {
      console.log(`Matched ${result.nMatched} entries.`);
      
  
      if (result.nModified > 0) {
        console.log(`Updated ${result.nModified} entries.`);
        res.status(200).send(`Station confirmation updated successfully for ${result.nModified} entries!`);
      } else {
        console.log(`No stations were updated for ${stationStr} because they were already set.`);
        res.status(200).send(`Matched ${result.nMatched} stations, but no updates were needed.`);
      }
    } else {
      console.log(`No matching stations found for ${stationStr}.`);
      res.status(404).send(`No matching stations found for ${stationStr}.`);
    }
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).send('Error updating station confirmation');
  }
});

// הפעלת השרת
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
