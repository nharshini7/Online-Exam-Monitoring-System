import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/AdminRegister.css';

const subjects = ['Math', 'History', 'English', 'Software Engineering', 'Computer Networks'];

const AdminRegister = () => {
  const [formData, setFormData] = useState({ username: '', password: '', subject: '', firstname: '', lastname: '', exams: [] });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubjectChange = (e) => {
    setFormData({ ...formData, subject: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/auth/register', formData);
      setMessage(response.data.message);
      navigate('/signin');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="register-container container">
      <h2 className="register-title">Admin Registration</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          name="firstname"
          placeholder="First Name"
          value={formData.firstname}
          onChange={handleChange}
          className="register-input"
        />
        <input
          type="text"
          name="lastname"
          placeholder="Last Name"
          value={formData.lastname}
          onChange={handleChange}
          className="register-input"
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="register-input"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="register-input"
        />
        <select
          name="subject"
          value={formData.subject}
          onChange={handleSubjectChange}
          className="register-input"
          required
        >
          <option value="">Select Subject</option>
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
        <button type="submit" className="register-button">Register</button>
        {message && <p className="message">{message}</p>}
      </form>
      <p>
        Already have an account? <Link to="/signin">Sign in here</Link>
      </p>
    </div>
  );
};

export default AdminRegister;
