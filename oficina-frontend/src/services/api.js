import axios from 'axios';

export const api = axios.create({
  // Aqui apontamos para a porta onde o seu Node.js está rodando!
  baseURL: 'http://localhost:3333', 
});