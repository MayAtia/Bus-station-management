import React, { useState, useEffect } from 'react';
import { getDriverStations } from '../services/api';
import { Container, Table, TableBody, TableCell, TableHead, TableRow, Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useLocation } from 'react-router-dom';

const StationsTable = () => {
  const [stations, setStations] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await getDriverStations();
        setStations(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStations();
  }, []);

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Stations
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Station</TableCell>
              <TableCell>Bus Line</TableCell>
              <TableCell>Waiting Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stations.map((station) => (
              <TableRow key={station.station_id}>
                <TableCell>
                  <FormControl fullWidth>
                    <InputLabel>Station</InputLabel>
                    <Select value={station.station_id}>
                      <MenuItem value="Station 1">Station 1</MenuItem>
                      <MenuItem value="Station 2">Station 2</MenuItem>
                      <MenuItem value="Station 3">Station 3</MenuItem>
                      <MenuItem value="Station 4">Station 4</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>{station.bus_line}</TableCell>
                <TableCell>{station.waiting_count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
};

export default StationsTable;
