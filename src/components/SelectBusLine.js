import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Box, Typography } from '@mui/material';

const SelectBusLine = () => {
  const [busLine, setBusLine] = useState('');
  const navigate = useNavigate();

  const handleSelectBusLine = () => {
    navigate(`/driver/stations?busLine=${busLine}`);
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Select Bus Line
        </Typography>
        <TextField
          label="Bus Line Number"
          fullWidth
          margin="normal"
          value={busLine}
          onChange={(e) => setBusLine(e.target.value)}
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

export default SelectBusLine;
