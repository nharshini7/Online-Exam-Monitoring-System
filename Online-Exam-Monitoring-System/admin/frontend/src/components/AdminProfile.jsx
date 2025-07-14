import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../config/axios';
import '../styles/AdminProfile.css';

const AdminProfile = () => {
  const { firstname, lastname, username, subject } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
  
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match.');
      return;
    }
  
    try {
      const response = await api.post(
        '/api/auth/change-password',
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      if (response.status === 200) {
        alert("Password Changed Successfully")
        // setMessage('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage(response.data.error || 'Failed to change password.');
      }
    } catch (error) {
      setMessage(
        error.response?.data?.error || 'An error occurred while changing the password.'
      );
    }
  };
  

  return (
    <div className="Admin_container">
      <div className="Admin_main">
        <main className="Admin_main-content">
          <div className="Admin_profile">Admin Profile</div>
           {/* Personal Information Section */}
           <section className="Admin_card">
             <div className="Admin_info-section">
              <p>
               <strong>Name:</strong> {firstname} {lastname}
              </p>
              <p>
               <strong>Username:</strong> {username}
              </p>
              <p>
               <strong>Subject:</strong> {subject}
              </p>
             </div>
           </section>

          {/* Change Password Section */}
          <section className="change-password-container">
            <div className="form-wrapper">
              <div className="form-box">
                <h3>Change Password</h3>
                <form onSubmit={handlePasswordChange} className="form">
                  <div className="form-group">
                  <label htmlFor="current-password">Current Password:</label>
                    <input
                     type="password"
                     id="current-password"
                     placeholder="••••••••"
                     value={currentPassword}
                     onChange={(e) => setCurrentPassword(e.target.value)}
                     required
                   />
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="new-Password"
                      placeholder="••••••••"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      placeholder="••••••••"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="submit-btn">
                   Change Password
                  </button>
               </form>
               {message && <p className="message">{message}</p>}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminProfile;
