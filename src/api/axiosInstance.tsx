
import axios from 'axios';

// Base instance for countries
const axiosCountryInstance = axios.create({
  baseURL: 'http://localhost:5114/country',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Base instance for cities
const axiosCityInstance = axios.create({
  baseURL: 'http://localhost:5114/city',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Base instance for states
const axiosStateInstance = axios.create({
  baseURL: 'http://localhost:5114/state',
  headers: {
    'Content-Type': 'application/json',
  },
});

export { axiosCountryInstance, axiosCityInstance, axiosStateInstance };