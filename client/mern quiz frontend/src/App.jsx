import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import HomePage from './components/home/HomePage';
import ContactUsPage from './components/contact-us/ContactUsPage';
import AboutUsPage from './components/about-us/AboutUsPage';
import NavbarComponent from './components/navbar/Navbar';
import SignupForm from './components/signup/SignupForm';
import LoginForm from './components/login/LoginForm';

const App = () => {


  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    setIsAuthenticated(false); // Update state
  };

  return (
    <>
      {/* Navbar with logout functionality */}
      <NavbarComponent isAuthenticated={isAuthenticated} onLogout={handleLogout} />

      <Routes>
        {/* Protected routes for authenticated users */}
        <Route
          path="/home"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/contact-us"
          element={isAuthenticated ? <ContactUsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/about"
          element={isAuthenticated ? <AboutUsPage /> : <Navigate to="/login" />}
        />

        {/* Public routes for unauthenticated users */}
        <Route
          path="/signup"
          element={!isAuthenticated ? <SignupForm /> : <Navigate to="/home" />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginForm setAuth={setIsAuthenticated} /> : <HomePage />}
        />

        {/* Default redirect */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? '/home' : '/login'} />}
        />
      </Routes>
    </>
  );
};

export default App;


