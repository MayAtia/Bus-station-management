import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getManagerIndicators, getPassengersPerDay, getPassengersPerHour } from '../services/api';
import { Container, Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto'; //יבוא רכיבים לגרפים

const ManagerIndicatorsPage = () => {
  const [indicators, setIndicators] = useState(null);
  const [passengersPerDay, setPassengersPerDay] = useState([]);
  const [passengersPerHour, setPassengersPerHour] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const busLine = params.get('busLine');
  const navigate = useNavigate();

  //מיבא את הנתונים האינדיקטורים לפי קו האוטובוס
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

  //בחירת תאריך והצגת הנתונים בגרף
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
//מחזיר את המנהל לעמוד התחברות 
  const handleLogout = () => {
    navigate('/manager');
  };

  //הכנת הנתונים לתצוגה בגרפים
  const passengersPerDayData = {
    labels: passengersPerDay.map(item => item._id),
    datasets: [
      {
        label: 'נוסעים',
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
        label: 'נוסעים',
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

  // סידור התחנות לפי סדר עולה
  const sortedStations = indicators.groupedByStation.sort((a, b) => {
    const stationA = parseInt(a._id.replace('Station ', ''), 10);
    const stationB = parseInt(b._id.replace('Station ', ''), 10); 
    return stationA - stationB; 
  });

  return (
    <Container maxWidth="lg" sx={{ direction: 'rtl', padding: 2 }}>
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
        <Typography variant="h4" component="h1" gutterBottom align="right">
          ניהול מנהל
        </Typography>
        <Typography variant="h6" align="right">קו אוטובוס: {busLine}</Typography>
        <Typography variant="h6" align="right">סה"כ ממתינים לקו: {indicators.totalWaiting}</Typography>
        <Typography variant="h6" align="right">סה"כ נוסעים: {indicators.totalArrived}</Typography>
        
        <Box my={4}>
          <Typography variant="h6" align="right">ספירת נוסעים לפי תחנה</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="right" sx={{ fontSize: '18px' }}>תחנה</TableCell>
                <TableCell align="right" sx={{ fontSize: '18px' }}>מספר נוסעים</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedStations.map((station) => (
                <TableRow key={station._id}>
                  <TableCell align="right" sx={{ fontSize: '16px' }}>{`תחנה ${station._id.replace('Station ', '')}`}</TableCell> {/* הצגת התחנה בסדר מספרי */}
                  <TableCell align="right" sx={{ fontSize: '16px' }}>{station.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        
        <Box my={4}>
          <Typography variant="h6" align="right">כמות נוסעים לפי יום:</Typography>
          <Line data={passengersPerDayData} />
        </Box>
        
        <Box my={4}>
          <Typography variant="h6" align="right">כמות נוסעים לפי שעה:</Typography>
          <FormControl fullWidth margin="normal" sx={{ backgroundColor: '#FFFFFF', borderRadius: '8px', direction: 'rtl' }}>
            <InputLabel align="right">בחר תאריך</InputLabel>
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
            <Typography variant="h6" align="right"> {selectedDate}</Typography>
            <Bar data={passengersPerHourData} options={passengersPerHourOptions} />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ManagerIndicatorsPage;
