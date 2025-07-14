const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const MONGO_URI = "mongodb+srv://admin:admin@cluster0.fv8uf.mongodb.net/studentdata?retryWrites=true&w=majority&appName=Cluster0";  // MongoDB connection URI

// Connect to MongoDB
mongoose.connect(MONGO_URI,)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err));

// Define the schema for submissions
const submissionSchema = new mongoose.Schema({
    examID: String,
    subject: String,
    title: String,
    date: String,
    username: String,
    answers: [String],
    score: Number,
    timestamp: String,
}, { collection: 'submissions' });

// Create a Mongoose model
const Submission = mongoose.model('Submission', submissionSchema);

// Define the schema for cheating logs
const cheatingLogSchema = new mongoose.Schema({
    timestamp: String,
    username: String,
    action: String,
}, { collection: 'cheating_logs' });

// Create a Mongoose model for cheating logs
const CheatingLog = mongoose.model('CheatingLog', cheatingLogSchema);

// Route to fetch scores by subject
router.get('/subject/:subject', async (req, res) => {
    const { subject } = req.params;

    try {
        // Find submissions filtered by subject
        const scores = await Submission.find({ subject });

        // Send the filtered data
        // console.log(scores)
        res.status(200).json(scores);
    } catch (err) {
        console.error('Error fetching scores:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to fetch cheating logs
router.get('/cheating-logs', async (req, res) => {
    try {
        // Fetch all cheating logs
        const logs = await CheatingLog.find();
        res.status(200).json(logs);
    } catch (err) {
        console.error('Error fetching cheating logs:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

