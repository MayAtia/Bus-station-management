import React, { useState, useEffect, useCallback } from 'react';
import { driverLogin, getUserEvents, confirmStationArrival } from '../services/api';
import { Container, TextField, Button, Box, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { handleInputChange } from '../components/ValueChecker';

const DriverPage = () => {
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [busLine, setBusLine] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEvents, setUserEvents] = useState([]);
  const [currentBusLine, setCurrentBusLine] = useState('');
  const [error, setError] = useState('');
  const [isFetching, setIsFetching] = useState(false);


  // בדיקה אם הנהג התחבר למערכת
  const handleLogin = async () => {
    try {
      await driverLogin(employeeNumber);
      setIsLoggedIn(true);
      setError('');
    } catch {
      setError('מספר נהג לא תקין');
      alert('מספר נהג לא תקין');
    }
  };

  // איפוס נתונים ביציאה מהמערכת
  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmployeeNumber('');
    setBusLine('');
    setUserEvents([]);
    setIsFetching(false);
    setCurrentBusLine('');
  };

  // מידע של המשתמשים: הבאת נתוני תחנות לפי קו האוטובוס הנבחר 
  const fetchUserEvents = useCallback(async () => {
    if (currentBusLine) {
      try {
        const response = await getUserEvents(currentBusLine);
        const sortedEvents = response.data.sort((a, b) => a._id.localeCompare(b._id));
        setUserEvents(sortedEvents);
      } catch {
        console.error('Failed to fetch user events');
      }
    }
  }, [currentBusLine]);

  // הבאת נתונים ע"י הכפתור
  const handleFetchUserEvents = () => {
    if (busLine) {
      setCurrentBusLine(busLine);
      setIsFetching(true);
    } else {
      alert('יש להזין מספר קו אוטובוס.');
    }
  };

  // חזרה לבחירת קו חדש - מאפס את הנתונים
  const handleReturnToBusLineSelection = () => {
    setUserEvents([]);
    setBusLine('');
    setCurrentBusLine('');
    setIsFetching(false);
  };

  // רענון נתונים כאשר מתבצע שינויים
  useEffect(() => {
    let interval;
    if (isFetching) {
      fetchUserEvents();
      interval = setInterval(fetchUserEvents, 2000);
    }
    return () => clearInterval(interval);
  }, [isFetching, fetchUserEvents]);

  // עדכון אישור הגעה של הנהג לתחנה
  const handleConfirmArrival = async (station) => {
    try {
      await confirmStationArrival(station);
      fetchUserEvents();
    } catch {
      console.error('Failed to confirm station arrival');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box my={4} sx={{ direction: 'rtl', textAlign: 'right' }}>
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
              onChange={handleInputChange(setEmployeeNumber)}
              inputProps={{ style: { textAlign: 'right', fontSize: '1.2rem' } }}
              InputLabelProps={{ style: { fontSize: '1.2rem' } }}
              sx={{ backgroundColor: '#FFFFFF' }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogin}
              fullWidth
              disabled={employeeNumber.length !== 4}
              style={{ fontSize: '1.2rem', padding: '12px' }}
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

            {currentBusLine ? (
              <>
                <Typography variant="h5" component="h2" style={{ textAlign: 'center', marginBottom: '16px', fontWeight: 'bold' }}>
                  קו אוטובוס: {currentBusLine}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleReturnToBusLineSelection}
                  fullWidth
                  style={{ fontSize: '1.2rem', padding: '12px', marginTop: '16px' }}
                >
                  חזרה לבחירת קו
                </Button>

                {userEvents.length === 0 ? (
                  <Typography align="center" style={{ fontSize: '1.2rem', marginTop: '16px' }}>
                    מחכה לנתונים
                  </Typography>
                ) : (
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
                          <TableCell style={{ fontSize: '1.2rem', padding: '12px' }}>{`תחנה ${event._id.replace('Station ', '')}`}</TableCell>
                          <TableCell style={{ fontSize: '1.2rem', padding: '12px' }}>{event.count}</TableCell>
                          <TableCell style={{ fontSize: '1.2rem', padding: '12px' }}>
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => handleConfirmArrival(event._id)}
                              style={{ fontSize: '1.2rem', padding: '8px' }}
                            >
                              אישור הגעה
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
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
                  onChange={handleInputChange(setBusLine)}
                  inputProps={{ style: { textAlign: 'right', fontSize: '1.2rem' } }}
                  InputLabelProps={{ style: { fontSize: '1.2rem' } }}
                  sx={{ backgroundColor: '#FFFFFF' }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleFetchUserEvents}
                  fullWidth
                  style={{ fontSize: '1.2rem', padding: '12px' }}
                >
                  טען נתונים
                </Button>
              </>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default DriverPage;
