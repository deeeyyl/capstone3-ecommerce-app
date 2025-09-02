import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function Logout() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
   
    localStorage.clear();

  
    setUser(null);

    navigate("/login");
  }, [setUser, navigate]);

  return null; 
}