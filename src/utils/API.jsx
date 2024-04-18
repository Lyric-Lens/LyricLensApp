import axios from 'axios';

export const api = axios.create({
  // baseURL: "http://localhost:3000/v1"
  baseURL: "https://5559-2400-9800-9b0-7635-e0d8-d2a2-a103-cde2.ngrok-free.app/v1",
  headers: {
    "ngrok-skip-browser-warning": true
  }
});