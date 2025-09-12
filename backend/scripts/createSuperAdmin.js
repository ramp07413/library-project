const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const createSuperAdmin = async () => {
  try {
    // Check if MONGODB_URI is loaded
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not found in environment variables');
      process.exit(1);
    }

    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName : "librarytest2"
    });
    console.log('Connected to MongoDB');

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'super_admin' });
    // if (existingSuperAdmin) {
    //   console.log('Super admin already exists:', existingSuperAdmin.email);
    //   console.log(existingSuperAdmin)
    //   process.exit(0);
    // }

    // Create super admin
    const superAdmin = new User({
      email: 'ram1@library.com',
      password: 'ram1234567',
      role: 'super_admin'
    });

    await superAdmin.save();
    console.log('Super admin created successfully!');
    console.log('Email: admin@library.com');
    console.log('Password: admin123');
    console.log('Please change the password after first login.');
    console.log(superAdmin)
    process.exit(0);
  } catch (error) {
    console.error('Error creating super admin:', error);
    process.exit(1);
  }
};

createSuperAdmin();
