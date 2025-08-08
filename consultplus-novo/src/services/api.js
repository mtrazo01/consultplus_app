import axios from 'axios';

const api = axios.create({
  baseURL: 'https://consultplus-backend.onrender.com',
});
 
export default api;
