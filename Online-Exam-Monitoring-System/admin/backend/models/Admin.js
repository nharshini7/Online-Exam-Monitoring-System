const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subject: { type: String, required: true, unique: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  token: { type: String, required: true },
  exams: { type: [Object], default: [] },  // Adjust based on your data structure
});



const Admin = mongoose.model('Admin', adminSchema, 'admindata');

module.exports = Admin;
