import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Box, Typography } from '@mui/material';

const ManagerBusLine = () => {
  const [busLine, setBusLine] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  const handleSelectBusLine = () => {
    navigate(`/manager/data?busLine=${busLine}&date=${date}`);
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Select Bus Line and Date
        </Typography>
        <TextField
          label="Bus Line Number"
          fullWidth
          margin="normal"
          value={busLine}
          onChange={(e) => setBusLine(e.target.value)}
        />
        <TextField
          label="Date"
          type="date"
          fullWidth
          margin="normal"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSelectBusLine}
          fullWidth
          disabled={!busLine}
        >
          OK
        </Button>
      </Box>
    </Container>
  );
};

export default ManagerBusLine;
