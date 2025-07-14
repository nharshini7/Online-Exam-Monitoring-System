// src/components/Layout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import NavigationBar from './NavigationBar';
import '../styles/Layout.css';

const Layout = () => {
  const location = useLocation();
  const showNavigationBar = !['/register', '/signin'].includes(location.pathname);

  return (
    <div className="layout-container">
      <div className='header'>
        {showNavigationBar && <Header />}
      </div>
      <div className='layout-side-plus-main'>
        {showNavigationBar && <NavigationBar />}
        <div className="main-content">
            <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
