import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { managerLogin } from '../services/api';
import { Container, TextField, Button, Box, Typography } from '@mui/material';

const ManagerLoginPage = () => {
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [busLine, setBusLine] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await managerLogin(employeeNumber, password);
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBusLineSubmit = () => {
    navigate(`/manager/indicators?busLine=${busLine}`);
  };

  return (
    <Container maxWidth="sm">
      <Box my={4} style={{ direction: 'rtl', textAlign: 'right' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          כניסת מנהל
        </Typography>
        {!isLoggedIn ? (
          <>
            <Typography variant="h6" component="label" htmlFor="employeeNumber">
              מספר עובד
            </Typography>
            <TextField
              id="employeeNumber"
              fullWidth
              margin="normal"
              value={employeeNumber}
              onChange={(e) => setEmployeeNumber(e.target.value)}
              inputProps={{ style: { textAlign: 'right', fontSize: '1.2rem' } }} 
              InputLabelProps={{ style: { fontSize: '1.2rem' } }} 
            />
            <Typography variant="h6" component="label" htmlFor="password">
              סיסמה
            </Typography>
            <TextField
              id="password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              inputProps={{ style: { textAlign: 'right', fontSize: '1.2rem' } }} 
              InputLabelProps={{ style: { fontSize: '1.2rem' } }} 
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogin}
              fullWidth
              disabled={employeeNumber.length !== 4 || password.length === 0}
              style={{ fontSize: '1.2rem', padding: '12px' }} 
            >
              כניסה
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h6" component="label" htmlFor="busLine">
              קו אוטובוס
            </Typography>
            <TextField
              id="busLine"
              fullWidth
              margin="normal"
              value={busLine}
              onChange={(e) => setBusLine(e.target.value)}
              inputProps={{ style: { textAlign: 'right', fontSize: '1.2rem' } }} 
              InputLabelProps={{ style: { fontSize: '1.2rem' } }} 
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleBusLineSubmit}
              fullWidth
              disabled={!busLine}
              style={{ fontSize: '1.2rem', padding: '12px' }} // Increased button size
            >
              הצג
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default ManagerLoginPage;
