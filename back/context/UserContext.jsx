// AuthContext.js
import React, { createContext, useContext, useState } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user data

  const login = (userData) => {
    setUser(userData); // Set the logged-in user
  };

  const logout = () => {
    setUser(null); // Clear the user data on logout
  };

  const isAuthenticated = !!user; // Determine if the user is logged in

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
