import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { API } from '../utils/constants';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API}/api/Authentication/Login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      
      const data = await response.json();
      console.log(data)
      
      if (data.user) {
        setUser(data)
        return { success: true };
      } else {
        return { success: false, errors: data.errors };
      }
    } catch (error) {
      return { success: false, errors: [error.message] };
    }
  };


  const logout = () => {
    setUser(null);
    toast.success('Has cerrado sesión. ¡Te esperamos pronto!');
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
