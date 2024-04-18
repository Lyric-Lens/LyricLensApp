import axios from 'axios';

export const api = axios.create({
  // baseURL: "http://localhost:3000/v1"
  baseURL: "https://4615-103-46-11-230.ngrok-free.app/v1",
  headers: {
    "ngrok-skip-browser-warning": true
  }
});
