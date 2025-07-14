const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const router = express.Router();
require('dotenv').config();

const Admin = require('../models/Admin'); // Import the Admin model from auth.js




const SECRET_KEY = process.env.SECRET_KEY;
const MONGO_URI = "mongodb+srv://admin:admin@cluster0.fv8uf.mongodb.net/studentdata?retryWrites=true&w=majority&appName=Cluster0";  // MongoDB connection URI

// Connect to MongoDB
mongoose.connect(MONGO_URI,)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err));

console.log(SECRET_KEY);


  const examSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    subject: { type: String, required: true },
    questions: { type: [String], required: true }, // You can adjust the question type as needed
    id: { type: String, required: true },
  });

// Define the Admin Schema
// const adminSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   subject: { type: String, required: true, unique: true },
//   firstname: { type: String, required: true },
//   lastname: { type: String, required: true },
//   token: { type: String, required: true },
//   exams: { type: [Object], default: [] },  // Adjust based on your data structure
// });



// const Admin = mongoose.model('Admin', adminSchema, 'admindata');

// Register Route
router.post('/register', async (req, res) => {
  const { username, password,firstname,lastname, subject, exams } = req.body;

  // Check if the subject already has an admin
  const existingAdmin = await Admin.findOne({ subject });
  if (existingAdmin) {
    return res.status(400).json({ error: `An admin for ${subject} already exists` });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const token = jwt.sign({ subject }, SECRET_KEY); // Permanent token

  const newAdmin = new Admin({
    username,
    password: hashedPassword,
    subject,
    firstname,
    lastname,
    token,
    exams
  });

  try {
    await newAdmin.save();
    return res.status(201).json({ message: 'Admin registered successfully', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error registering admin' });
  }
});

// Sign-In Route
router.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  // Find the admin with matching username
  const admin = await Admin.findOne({ username });
  if (!admin) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  // Check the password
  const passwordMatch = await bcrypt.compare(password, admin.password);
  if (!passwordMatch) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  // Return the stored token and additional admin details
  res.json({
    message: 'Sign-in successful',
    token: admin.token,
    firstname: admin.firstname,
    lastname: admin.lastname,
    subject: admin.subject,
    username: admin.username
  });
});

// Change Password Route
router.post('/change-password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Missing token.' });
  }

  const token = authHeader.split(' ')[1];
  console.log(token);

  try {
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);
    const { subject } = decoded;

    // Find the admin by subject
    const admin = await Admin.findOne({ subject });
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found.' });
    }

    // Verify the current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }
    console.log(newPassword)

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    console.log(hashedNewPassword)


    // Update the password in the database
    console.log(admin.password)
    admin.password = hashedNewPassword;
    await admin.save();

    res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Error in change-password route:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});


module.exports= {router, Admin};