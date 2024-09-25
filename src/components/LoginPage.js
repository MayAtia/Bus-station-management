import React, { useState } from 'react';
import { userLogin, saveUserEvent } from '../services/api';
import { Container, TextField, Button, Box, Typography, MenuItem, Select, FormControl, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { handleInputChange } from '../components/ValueChecker';



const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

//בדיקת ת.ז תקינה
const validateIsraeliId = (id) => {
  id = id.replace(/\D/g, '');

  if (id.length > 9 || id.length < 5) {
    return false;
  }

  id = id.padStart(9, '0');
  let totalSum = 0;
  for (let i = 0; i < 9; i++) {
    let num = parseInt(id[i], 10);
    if (i % 2 !== 0) {
      num *= 2;
      if (num > 9) {
        num = num - 9;
      }
    }
    totalSum += num;
  }

  return totalSum % 10 === 0;
};

const LoginPage = () => {
  const [name, setName] = useState('');
  const [idCard, setIdCard] = useState('');
  const [station, setStation] = useState('');
  const [lineNumber, setLineNumber] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);


  //מאמת ת.ז וכניסה למערכת 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateIsraeliId(idCard)) {
      alert('תעודת הזהות שהזנת אינה תקינה');
      return;
    }

    try {
      const response = await userLogin(name, idCard);
      console.log(response.data);
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
    }
  };

  //איפוס נתונים ביציאה מהמערכת
  const handleLogout = () => {
    setIsLoggedIn(false);
    setName('');
    setIdCard('');
    setStation('');
    setLineNumber('');
  };

  //אם כל הנתונים זמינים, שומרת את אירוע התחנה
  const handleStationConfirm = async () => {
    if (station && lineNumber && idCard) {
      try {
        await saveUserEvent(idCard, lineNumber, station);
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

  //מאמת שהשם מכיל רק אותיות ולא תווים
  const handleNameChange = (e) => {
    const value = e.target.value;
       const symbolPattern = /[^\u0590-\u05FFa-zA-Z\s]/;

    if (symbolPattern.test(value)) {
        alert("אין להשתמש בתווים @!><");
        return; 
    }

    if (/^[\u0590-\u05FFa-zA-Z\s]*$/.test(value)) {
        setName(value);
    }
  };


  return (
    <Container maxWidth="sm">
      <Box my={4} style={{ direction: 'rtl', textAlign: 'right' }}>
        {!isLoggedIn ? (
          <>
            <Typography variant="h4" component="h1" gutterBottom>
              כניסת משתמש
            </Typography>
            <form onSubmit={handleSubmit}>
              <Typography variant="h6" component="label" htmlFor="name">
                שם
              </Typography>
              <TextField
                id="name"
                fullWidth
                margin="normal"
                value={name}
                onChange={handleNameChange}
                inputProps={{ style: { textAlign: 'right' } }}
                sx={{ backgroundColor: '#FFFFFF' }}
              />
              <Typography variant="h6" component="label" htmlFor="idCard">
                תעודת זהות
              </Typography>
              <TextField
                id="idCard"
                fullWidth
                margin="normal"
                value={idCard}
                onChange={handleInputChange(setIdCard)}
                inputProps={{ style: { textAlign: 'right' } }}
                sx={{ backgroundColor: '#FFFFFF' }}
              />
              <Button variant="contained" color="primary" type="submit" fullWidth>
                כניסה
              </Button>
            </form>
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
                  sx={{ backgroundColor: '#FFFFFF' }}
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
                onChange={handleInputChange(setLineNumber)}
                inputProps={{ style: { textAlign: 'right' } }}
                sx={{ backgroundColor: '#FFFFFF' }}
              />
              <Button variant="contained" color="primary" onClick={handleStationConfirm} fullWidth>
                בחירת תחנה וקו
              </Button>
              <Snackbar
  open={open}
  autoHideDuration={6000}
  onClose={handleClose}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}  
>
  <Alert onClose={handleClose} severity="success" sx={{ width: '100%', fontSize: '1.5rem', backgroundColor: '#4caf50', fontWeight: 'bold' }}>
    הבחירה נקלטה בהצלחה!
  </Alert>
</Snackbar>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default LoginPage;
