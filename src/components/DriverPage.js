import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { driverLogin, getUserEvents, confirmStationArrival } from '../services/api';
import { Container, TextField, Button, Box, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const DriverPage = () => {
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [busLine, setBusLine] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEvents, setUserEvents] = useState([]);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await driverLogin(employeeNumber);
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
    }
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

  return (
    <Container maxWidth="sm">
      <Box my={4} style={{ direction: 'rtl', textAlign: 'right' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          כניסת נהג
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
              inputProps={{ style: { textAlign: 'right', fontSize: '1.2rem' } }} // Increased font size
              InputLabelProps={{ style: { fontSize: '1.2rem' } }} // Increased label font size
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