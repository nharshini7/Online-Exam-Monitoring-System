// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminRegister from './components/AdminRegister';
import AdminSignIn from './components/AdminSignIn';
import AdminDashboard from './components/AdminDashboard';
import AdminContactUs from './components/AdminContactUS';
import ExamForm from './components/ExamForm';
import AdminProfile from './components/AdminProfile';
import QuestionsLog from './components/QuestionsLog';
import ViewScores from './components/ViewScores';
import Layout from './components/Layout';
import CheatLog from './components/CheatLog';
import { AuthProvider } from './context/AuthContext';
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Wrap all main routes within the Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/register" />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/create-exam" element={<ExamForm />} />
            <Route path="/profile" element={<AdminProfile />} />
            <Route path="/contact-us" element={<AdminContactUs />} />
            <Route path="/questions-log" element={<QuestionsLog />} />
            <Route path="/view-scores" element={<ViewScores />} />
            <Route path="/cheat-log" element={<CheatLog />} />
          </Route>

          {/* Routes without NavigationBar */}
          <Route path="/register" element={<AdminRegister />} />
          <Route path="/signin" element={<AdminSignIn />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
