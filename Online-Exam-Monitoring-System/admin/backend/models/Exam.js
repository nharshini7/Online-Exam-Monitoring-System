const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  token: { type: String, required: true },
  questions: [
    {
      question: String,
      options: [String],
      answer: String
    }
  ]
});

module.exports = mongoose.model('Exam', ExamSchema);
