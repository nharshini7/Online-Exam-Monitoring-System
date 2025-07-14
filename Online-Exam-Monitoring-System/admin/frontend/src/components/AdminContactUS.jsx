import React, { useState } from 'react';
import { FaHome, FaUser, FaEnvelope, FaSignOutAlt, FaPaperPlane } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminContactUS.css';

function AdminContactUs() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent successfully!');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleLogout = () => {
    localStorage.clear();
    console.log('Logged out');
    navigate('/signin');
  };

  return (
    <div className="Contact_US_container">
      {/* <header className="Contact_US_header">
        <div className="Contact_US_header-content">
          <div className="Contact_US_app-title">
            <h2>Online Monitoring System</h2>
          </div>
          <div className="Contact_US_welcome-section">
            <h2 id="Contact_US_welcome-message">
              Welcome, User!
            </h2>
          </div>
        </div>
      </header> */}

      <div className="Contact_US_main">
        {/* <aside className="Contact_US_sidebar">
          <ul>
            <button className="home-button" onClick={() => navigate('/dashboard')}>
              <FaHome size={20} style={{ marginRight: '8px' }} />
              Home
            </button>
            <button className="myProfile-button" onClick={() => navigate('/profile')}>
              <FaUser style={{ marginRight: '8px' }} />
              My Profile
            </button>
            <button className="contact-button" onClick={() => navigate('/contact')}>
              <FaEnvelope style={{ marginRight: '8px' }} />
              Contact Us
            </button>
            <button className="logout-button" onClick={handleLogout}>
              <FaSignOutAlt style={{ marginRight: '8px' }} />
              Logout
            </button>
          </ul>
        </aside> */}

        <main className="Contact_US_main-content">
        <div className="contact_us_background">
      <div className="contact_us_container">
        <div className="contact_us_screen">
          <div className="contact_us_screen-header">
            <div className="contact_us_screen-header-left">
              <div className="contact_us_screen-header-button close"></div>
              <div className="contact_us_screen-header-button maximize"></div>
              <div className="contact_us_screen-header-button minimize"></div>
            </div>
            <div className="contact_us_screen-header-right">
              <div className="contact_us_screen-header-ellipsis"></div>
              <div className="contact_us_screen-header-ellipsis"></div>
              <div className="contact_us_screen-header-ellipsis"></div>
            </div>
          </div>
          <div className="contact_us_screen-body">
            <div className="contact_us_screen-body-item left">
              <div className="contact_us_app-title">
                <span>CONTACT</span>
                <span>US</span>
              </div>
              {/* <div className="contact_us_app-contact">CONTACT INFO : +62 81 314 928 595</div> */}
            </div>
            <div className="contact_us_screen-body-item">
              <div className="contact_us_app-form">
                <div className="contact_us_app-form-group">
                  <input className="contact_us_app-form-control" placeholder="NAME" />
                </div>
                <div className="contact_us_app-form-group">
                  <input className="contact_us_app-form-control" placeholder="EMAIL" />
                </div>
                <div className="contact_us_app-form-group">
                  <input className="contact_us_app-form-control" placeholder="CONTACT NO" />
                </div>
                <div className="contact_us_app-form-group message">
                  <input className="contact_us_app-form-control" placeholder="MESSAGE" />
                </div>
                <div className="contact_us_app-form-group buttons">
                  <button className="contact_us_app-form-button">CANCEL</button>
                  <button className="contact_us_app-form-button">SEND</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
        </main>
      </div>
    </div>
  );
}

export default AdminContactUs;
