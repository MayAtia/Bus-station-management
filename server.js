require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('MONGO_URI is not defined in the environment variables');
  process.exit(1); 
}

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

const userRoutes = require('./routes/user');
const driverRoutes = require('./routes/driver');
const managerRoutes = require('./routes/manager');

app.use('/api/user', userRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/manager', managerRoutes);

const port = process.env.PORT || 4000;  
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
