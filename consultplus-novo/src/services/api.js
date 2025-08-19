import axios from 'axios';

// Troque pelo IP da sua máquina (não use localhost se for acessar pelo celular)
const api = axios.create({
  baseURL: 'http://192.168.15.185:3000',
});

export default api;
