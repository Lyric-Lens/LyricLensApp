import { useEffect, useState, useRef } from "react";
import { api } from "./API";

export default function Guard() {
  const [auth, setAuth] = useState(null);
  const guardActed = useRef(false);

  useEffect(() => {
    if (guardActed.current) return;

    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');
    const isAuthenticated = email !== null && token !== null;

    if (isAuthenticated) {
      api.get(`/users/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(() => {
        setAuth(true);
      })
      .catch(() => {
        setAuth(false);
        localStorage.removeItem('email');
        localStorage.removeItem('token');
      });
    } else {
      setAuth(false);
      localStorage.removeItem('email');
      localStorage.removeItem('token');
    }

    guardActed.current = true;
  }, []);

  useEffect(() => {
    if (auth === null) return;

    const publicRoutes = ['/', '/authentication'];
    const path = window.location.pathname;
    if (auth === false && !publicRoutes.includes(path)) {
      window.location.pathname = ('/authentication');
    } else if (auth === true && publicRoutes.includes(path)) {
      window.location.pathname = ('/dashboard');
    }
  }, [auth]);

  return null;
}