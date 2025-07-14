const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const mongoose = require('mongoose');
const Admin = require('../models/Admin'); // Import the Admin model from auth.js

const SECRET_KEY = process.env.SECRET_KEY;

// const Admin2 = mongoose.model('Admin', adminSchema, 'admindata');


// Create Exam
router.post('/createExam', async (req, res) => {
  const { title, date, subject, questions, id } = req.body;
  const token = req.headers.authorization.split(' ')[1]; // Extract token from header

  try {
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);
    const { subject: adminSubject } = decoded;

    // Find the admin by subject
    const admin = await Admin.findOne({ subject: adminSubject });
    console.log(admin)
    if (!admin) return res.status(404).json({ error: 'Admin not found' });

    // Create a new exam
    const newExam = { id, title, date, subject, questions };
    console.log("newexamm:",newExam)
    console.log(admin.exams)
    admin.exams.push(newExam);

   
    await admin.save();

    res.status(201).json({ message: 'Exam created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating exam' });
  }
});

// Get Exams created by the current logged-in admin
router.get('/getExams', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]; // Extract token from header

  try {
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);
    const { subject: adminSubject } = decoded;

    // Find the admin by subject
    const admin = await Admin.findOne({ subject: adminSubject });
    if (!admin) return res.status(404).json({ error: 'Admin not found' });

    // Return the exams of the found admin
    if (admin.exams.length === 0) {
      return res.json({ message: 'You have not created any exams.' });
    } else {
      return res.json(admin.exams);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching exams' });
  }
});

// Get first exam from the first admin
router.get('/get_first_exam', async (req, res) => {
  try {
    // Get the first admin in the database
    const firstAdmin = await Admin.findOne().sort({ _id: 1 }); // Sort by _id to get the first admin created
    if (firstAdmin && firstAdmin.exams.length > 0) {
      return res.json(firstAdmin.exams[0]); // Send the first exam of the first admin
    } else {
      return res.status(404).json({ message: 'No exam found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching first exam' });
  }
});

// Get all exams created by all admins
router.get('/get_all_exams', async (req, res) => {
  try {
    // Get all admins and their exams
    const admins = await Admin.find({});
    const allExams = admins.flatMap(admin => admin.exams);

    if (allExams.length === 0) {
      return res.json({ message: 'No exams found.' });
    } else {
      return res.json(allExams);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching exams from all admins' });
  }
});

module.exports = router;
