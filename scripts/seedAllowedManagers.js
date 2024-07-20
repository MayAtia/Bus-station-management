require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AllowedManager = require('../models/AllowedManager');

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('MONGO_URI is not defined in the environment variables');
  process.exit(1); 
}

const seedManagers = async () => {
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

  const managers = [
    { employee_number: '0001', password: 'password1' },
    { employee_number: '0002', password: 'password2' },
  ];

  for (let manager of managers) {
    const hashedPassword = await bcrypt.hash(manager.password, 10);
    manager.password = hashedPassword;
    await AllowedManager.create(manager);
  }

  console.log('Managers seeded');
  mongoose.disconnect();
};

seedManagers();
