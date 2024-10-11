import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Log in function (save token)
  const login = (token) => {
    setUser(token);
    localStorage.setItem('access_token', token); // Store token in localStorage
  };

  // Log out function (clear token)
  const logout = () => {
    setUser(null);
    localStorage.removeItem('access_token'); // Remove token from localStorage
  };

  // On mount, check if token exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    console.log("Checking for token in localStorage:", token);
    if (token) {
      setUser(token); // If token is found, set user state to the token
    }
    setIsAuthenticated(!!token);
    console.log("isAuthenticated:", !!token);
  }, []);


  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
