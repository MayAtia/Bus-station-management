// services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

export const userLogin = (name, idCard) => {
  return axios.post(`${API_URL}/user/login`, { name, idCard });
};

export const saveUserEvent = (idCard, lineNumber, station) => {
  return axios.post(`${API_URL}/user/userEvent`, { idCard, lineNumber, station });
};

export const updateUserEvent = (eventId, isHere) => {
  return axios.post(`${API_URL}/user/updateUserEvent`, { eventId, isHere });
};

// Updated driverLogin to include the allowedDrivers check
export const driverLogin = async (employeeNumber) => {
  try {
    const allowedResponse = await axios.get(`${API_URL}/driver/allowed`, { params: { employeeNumber } });
    if (!allowedResponse.data.allowed) {
      throw new Error('Driver not allowed');
    }
    
    // Proceed with the login logic if the driver is allowed
    return axios.post(`${API_URL}/driver/login`, { employeeNumber });
  } catch (error) {
    console.error('Login failed', error);
    throw error;
  }
};

export const getUserEvents = (busLine) => {
  return axios.get(`${API_URL}/driver/userEvents`, { params: { busLine } });
};

export const confirmStationArrival = (station) => {
  return axios.post(`${API_URL}/driver/station/confirm`, { station });
};

export const getDriverStations = () => {
  return axios.get(`${API_URL}/driver/stations`);
};

export const managerLogin = (employeeNumber, password) => {
  return axios.post(`${API_URL}/manager/login`, { employeeNumber, password });
};

export const getManagerIndicators = (busLine) => {
  return axios.get(`${API_URL}/manager/indicators`, { params: { busLine } });
};

export const getPassengersPerDay = (busLine) => {
  return axios.get(`${API_URL}/manager/passengersPerDay`, { params: { busLine } });
};

export const getPassengersPerHour = (busLine, date) => {
  return axios.get(`${API_URL}/manager/passengersPerHour`, { params: { busLine, date } });
};

export const getManagerData = (filters) => {
  return axios.get(`${API_URL}/manager/data`, { params: filters });
};
