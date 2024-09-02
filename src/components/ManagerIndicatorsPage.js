import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getManagerIndicators, getPassengersPerDay, getPassengersPerHour } from '../services/api';
import { Container, Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const ManagerIndicatorsPage = () => {
  const [indicators, setIndicators] = useState(null);
  const [passengersPerDay, setPassengersPerDay] = useState([]);
  const [passengersPerHour, setPassengersPerHour] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const busLine = params.get('busLine');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const indicatorsResponse = await getManagerIndicators(busLine);
        setIndicators(indicatorsResponse.data);

        const passengersPerDayResponse = await getPassengersPerDay(busLine);
        setPassengersPerDay(passengersPerDayResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [busLine]);

  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    try {
      const response = await getPassengersPerHour(busLine, date);
      const fullHours = Array.from({ length: 24 }, (_, i) => ({ _id: i, count: 0 }));
      response.data.forEach(item => {
        fullHours[item._id] = item;
      });
      setPassengersPerHour(fullHours);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    navigate('/manager');
  };

  const passengersPerDayData = {
    labels: passengersPerDay.map(item => item._id),
    datasets: [
      {
        label: 'Passengers Per Day',
        data: passengersPerDay.map(item => item.count),
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1
      }
    ]
  };

  const passengersPerHourData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Passengers Per Hour',
        data: passengersPerHour.map(item => item.count),
        backgroundColor: 'rgba(75,192,192,0.6)'
      }
    ]
  };

  const passengersPerHourOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: function(value) {
            return Number.isInteger(value) ? value : null;
          }
        }
      }
    }
  };

  if (!indicators) return <div>Loading...</div>;

  return (
    <Container maxWidth="md">
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
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Manager Indicators
        </Typography>
        <Typography variant="h6">Bus Line: {busLine}</Typography>
        <Typography variant="body1">Total Waiting: {indicators.totalWaiting}</Typography>
        <Typography variant="body1">Total Arrived: {indicators.totalArrived}</Typography>
        <Box my={4}>
          <Typography variant="h6">Waiting Count by Station</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Station</TableCell>
                <TableCell>Waiting Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {indicators.groupedByStation.map((station) => (
                <TableRow key={station._id}>
                  <TableCell>{station._id}</TableCell>
                  <TableCell>{station.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <Box my={4}>
          <Typography variant="h6">Passengers Per Day</Typography>
          <Line data={passengersPerDayData} />
          <FormControl fullWidth margin="normal" sx={{ backgroundColor: '#FFFFFF', borderRadius: '8px' }}>
            <InputLabel>Select Date</InputLabel>
            <Select
              value={selectedDate}
              onChange={(e) => handleDateSelect(e.target.value)}
              sx={{ backgroundColor: '#FFFFFF', borderRadius: '8px' }}
            >
              {passengersPerDay.map((item) => (
                <MenuItem key={item._id} value={item._id}>{item._id}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {selectedDate && (
          <Box my={4}>
            <Typography variant="h6">Passengers Per Hour on {selectedDate}</Typography>
            <Bar data={passengersPerHourData} options={passengersPerHourOptions} />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ManagerIndicatorsPage;
