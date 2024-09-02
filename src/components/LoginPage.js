import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userLogin, saveUserEvent } from '../services/api';
import { Container, TextField, Button, Box, Typography, MenuItem, Select, FormControl, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const validateIsraeliId = (id) => {
  // הסרת תווים שאינם ספרות
  id = id.replace(/\D/g, '');

  // בדיקת אורך הת.ז.
  if (id.length > 9 || id.length < 5) {
    return false;
  }

  // השלמת הת.ז. ל-9 ספרות עם אפסים מובילים
  id = id.padStart(9, '0');

  // חשבון ספרת הביקורת לפי האלגוריתם
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

  // בדיקה אם הסכום מתחלק ב-10 ללא שארית
  return totalSum % 10 === 0;
};

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

  const handleLogout = () => {
    setIsLoggedIn(false);
    setName('');
    setIdCard('');
    setStation('');
    setLineNumber('');
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

  const handleNameChange = (e) => {
    const value = e.target.value;
    // ביטוי רגולרי שבודק האם יש סמלים שאינם תווים אלפבתיים בעברית או באנגלית
    const symbolPattern = /[^\u0590-\u05FFa-zA-Z\s]/;

    if (symbolPattern.test(value)) {
        alert("אין להשתמש בתווים @!><");
        return; // לא לעדכן את ה-state אם יש סמלים
    }

    if (/^[\u0590-\u05FFa-zA-Z\s]*$/.test(value)) {
        setName(value);
    }
  };

  const handleIdCardChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setIdCard(value);
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
                onChange={handleIdCardChange}
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
                onChange={(e) => setLineNumber(e.target.value)}
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
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}  // Changed from 'center' to 'top'
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
