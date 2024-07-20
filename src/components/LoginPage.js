import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userLogin, saveUserEvent } from '../services/api';
import { Container, TextField, Button, Box, Typography, MenuItem, Select, FormControl, InputLabel, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const LoginPage = () => {
  const [name, setName] = useState('');
  const [idCard, setIdCard] = useState('');
  const [station, setStation] = useState('');
  const [lineNumber, setLineNumber] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isStationConfirmed, setIsStationConfirmed] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await userLogin(name, idCard);
      console.log(response.data);
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStationConfirm = async () => {
    if (station && lineNumber && idCard) {
      try {
        await saveUserEvent(idCard, lineNumber, station);
        setIsStationConfirmed(true);
        setOpen(true);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Box my={4} style={{ direction: 'rtl', textAlign: 'right' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          כניסת משתמש
        </Typography>
        {!isLoggedIn ? (
          <form onSubmit={handleSubmit}>
            <Typography variant="h6" component="label" htmlFor="name">
              שם
            </Typography>
            <TextField
              id="name"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              inputProps={{ style: { textAlign: 'right' } }}
            />
            <Typography variant="h6" component="label" htmlFor="idCard">
              תעודת זהות
            </Typography>
            <TextField
              id="idCard"
              fullWidth
              margin="normal"
              value={idCard}
              onChange={(e) => setIdCard(e.target.value)}
              inputProps={{ style: { textAlign: 'right' } }}
            />
            <Button variant="contained" color="primary" type="submit" fullWidth>
              כניסה
            </Button>
          </form>
        ) : (
          <Box>
            <Typography variant="h6" component="label" htmlFor="station">
              בחר תחנה
            </Typography>
            <FormControl fullWidth margin="normal">
              <Select
                id="station"
                value={station}
                onChange={(e) => setStation(e.target.value)}
                style={{ textAlign: 'right' }}
              >
                <MenuItem value="Station 1">תחנה 1</MenuItem>
                <MenuItem value="Station 2">תחנה 2</MenuItem>
                <MenuItem value="Station 3">תחנה 3</MenuItem>
                <MenuItem value="Station 4">תחנה 4</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="h6" component="label" htmlFor="lineNumber">
              מספר קו
            </Typography>
            <TextField
              id="lineNumber"
              fullWidth
              margin="normal"
              value={lineNumber}
              onChange={(e) => setLineNumber(e.target.value)}
              inputProps={{ style: { textAlign: 'right' } }}
            />
            <Button variant="contained" color="primary" onClick={handleStationConfirm} fullWidth>
              בחירת תחנה וקו
            </Button>
            <Snackbar
              open={open}
              autoHideDuration={6000}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
            >
              <Alert onClose={handleClose} severity="success" sx={{ width: '100%', fontSize: '1.5rem', backgroundColor: '#4caf50', fontWeight: 'bold' }}>
                הבחירה נקלטה בהצלחה!
              </Alert>
            </Snackbar>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default LoginPage;