import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import DriverPage from './components/DriverPage';
import SelectBusLine from './components/SelectBusLine';
import StationsTable from './components/StationsTable';
import ManagerLoginPage from './components/ManagerLoginPage';
import ManagerIndicatorsPage from './components/ManagerIndicatorsPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/driver" element={<DriverPage />} />
        <Route path="/driver/busline" element={<SelectBusLine />} />
        <Route path="/driver/stations" element={<StationsTable />} />
        <Route path="/manager" element={<ManagerLoginPage />} />
        <Route path="/manager/indicators" element={<ManagerIndicatorsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
