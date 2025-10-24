import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.30.57.234:3000',
});

export default api;
