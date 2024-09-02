import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const NavigationBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here, such as clearing auth tokens or user info
    navigate('/login'); // Redirect to the login page
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#298ed1' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {/* Add your application name or logo here */}
        </Typography>
        <Box>
          <Button color="inherit" onClick={handleLogout}>
            יציאה
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
