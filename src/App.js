
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import DriverPage from './components/DriverPage';
import ManagerLoginPage from './components/ManagerLoginPage';
import ManagerIndicatorsPage from './components/ManagerIndicatorsPage';
import Header from './components/Header';

const App = () => {
  return (
    <Router>
      <Header /> 
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/driver" element={<DriverPage />} />
        <Route path="/manager" element={<ManagerLoginPage />} />
        <Route path="/manager/indicators" element={<ManagerIndicatorsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
