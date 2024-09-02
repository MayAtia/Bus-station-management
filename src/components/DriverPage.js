import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { driverLogin, getUserEvents, confirmStationArrival } from '../services/api';
import { Container, TextField, Button, Box, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const DriverPage = () => {
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [busLine, setBusLine] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEvents, setUserEvents] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await driverLogin(employeeNumber);
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmployeeNumber('');
    setBusLine('');
  };

  const fetchUserEvents = async () => {
    try {
      const response = await getUserEvents(busLine);
      const sortedEvents = response.data.sort((a, b) => a._id.localeCompare(b._id)); // Sort by station ID or another attribute
      setUserEvents(sortedEvents);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (busLine) {
      fetchUserEvents();
      const interval = setInterval(fetchUserEvents, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval); // Clear interval on component unmount
    }
  }, [busLine]);

  const handleConfirmArrival = async (station) => {
    try {
      await confirmStationArrival(station);
      fetchUserEvents();
    } catch (error) {
      console.error(error);
    }
  };
  const handleEmployeeNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setEmployeeNumber(value);
    } else {
      alert('יש להכניס רק מספרים');
    }
  };
  

  return (
    <Container maxWidth="sm">
      <Box my={4} style={{ direction: 'rtl', textAlign: 'right' }}>
        {!isLoggedIn ? (
          <>
            <Typography variant="h4" component="h1" gutterBottom>
              כניסת נהג
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            <Typography variant="h6" component="label" htmlFor="employeeNumber">
              מספר עובד
            </Typography>
            <TextField
              id="employeeNumber"
              fullWidth
              margin="normal"
              value={employeeNumber}
              onChange={handleEmployeeNumberChange}
              inputProps={{ style: { textAlign: 'right', fontSize: '1.2rem' } }} // Increased font size
              InputLabelProps={{ style: { fontSize: '1.2rem' } }} // Increased label font size
              sx={{ backgroundColor: '#FFFFFF' }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogin}
              fullWidth
              disabled={employeeNumber.length !== 4}
              style={{ fontSize: '1.2rem', padding: '12px' }} // Increased button size
            >
              כניסה
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={handleLogout}
              sx={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: '#ff0000',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#cc0000',
                },
              }}
            >
              יציאה
            </Button>
            <Typography variant="h6" component="label" htmlFor="busLine">
              קו אוטובוס
            </Typography>
            <TextField
              id="busLine"
              fullWidth
              margin="normal"
              value={busLine}
              onChange={(e) => setBusLine(e.target.value)}
              inputProps={{ style: { textAlign: 'right', fontSize: '1.2rem' } }} // Increased font size
              InputLabelProps={{ style: { fontSize: '1.2rem' } }} // Increased label font size
              sx={{ backgroundColor: '#FFFFFF' }}
            />
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontSize: '1.2rem', padding: '12px' }}>תחנה</TableCell>
                  <TableCell style={{ fontSize: '1.2rem', padding: '12px' }}>מספר ממתינים</TableCell>
                  <TableCell style={{ fontSize: '1.2rem', padding: '12px' }}>פעולה</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userEvents.map((event) => (
                  <TableRow key={event._id}>
                    <TableCell style={{ fontSize: '1.2rem', padding: '12px' }}>{event._id}</TableCell>
                    <TableCell style={{ fontSize: '1.2rem', padding: '12px' }}>{event.count}</TableCell>
                    <TableCell style={{ fontSize: '1.2rem', padding: '12px' }}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleConfirmArrival(event._id)}
                        style={{ fontSize: '1.2rem', padding: '8px' }} // Increased button size
                      >
                        אישור הגעה
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </Box>
    </Container>
  );
};

export default DriverPage;
