// src/components/NavigationBar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHome, FaUser, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';
import '../styles/NavigationBar.css';

const NavigationBar = () => {
    const { username, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div className="navigation-bar">
      {/* <header className="navbar-header">
        <h1>Online Exam Monitoring System Admin</h1>
        {console.log(username)}
        <span className="navbar-username">Welcome, {username}</span>
      </header> */}
      <nav className="navbar-sidebar">
        <ul>
          <Link className="adminhome-button" to="/dashboard">
          <FaHome size={20} style={{ marginRight: '8px' }} />Home</Link>
          <Link className="adminmyProfile-button"to="/profile">
          <FaUser style={{ marginRight: '8px' }} />My Profile</Link>
          <Link className = "admincontact-button" to="/contact-us">
          <FaEnvelope style={{ marginRight: '8px' }} to= "/contactUs" />Contact Us</Link>
          <button className="adminlogout-button" onClick={handleLogout}>
          <FaSignOutAlt style={{ marginRight: '8px' }} />Logout</button>
        </ul>
      </nav>
    </div>
  );
};

export default NavigationBar;
