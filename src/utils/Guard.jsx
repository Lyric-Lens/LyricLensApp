import { useEffect, useState, useRef } from "react";
import { api } from "./API";

export default function Guard() {
  const [auth, setAuth] = useState(null);
  const guardActed = useRef(false);

  useEffect(() => {
    if (guardActed.current) return;

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const isAuthenticated = userId !== null && token !== null;

    if (isAuthenticated) {
      api.get(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(() => {
        setAuth(true);
      })
      .catch((err) => {
        console.log(err);
        setAuth(false);
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
      });
    } else {
      setAuth(false);
      localStorage.removeItem('userId');
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
      window.location.pathname = ('/main');
    }
  }, [auth]);

  return null;
}