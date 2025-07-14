// src/config/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/', // Update this URL as needed
});

export default api;
