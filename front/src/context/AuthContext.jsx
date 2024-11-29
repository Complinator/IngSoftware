import React, { createContext, useContext, useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState(null); // In-memory access token
    const [loading, setLoading] = useState(true); // Loading state
    const [userEmail, setUserEmail] = useState(null);

    const extractEmailFromToken = (token) => {
        try {
            const decodedToken = jwtDecode(token);
            return decodedToken.sub || null; // Adjust the key if your JWT uses a different email field
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

    const getRefreshToken = async () => {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
            console.warn('No refresh token found');
            setIsAuthenticated(false);
            setUserEmail(null);
            setLoading(false); // Stop loading if no refresh token
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/auth/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${refreshToken}`,
                },
            });

            if (!response.ok) {
                console.error('Failed to refresh token:', response.statusText);
                throw new Error('Failed to refresh token');
            }

            const data = await response.json();
            const { access_token } = data;

            // Store the new access token in memory
            setAccessToken(access_token); 
            const email = extractEmailFromToken(access_token);
            setUserEmail(email);
            console.log("New access token:", access_token);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Refresh token error:', error);
            setIsAuthenticated(false);
            setUserEmail(null);
        } finally {
            setLoading(false); // Stop loading after trying to refresh
        }
    };

    const login = async (credentials) => {
        setLoading(true); // Start loading before logging in
        try {
            const response = await fetch('http://localhost:8000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            const { access_token, refresh_token } = data;

            // Store the access token in memory
            setAccessToken(access_token);
            const email = extractEmailFromToken(access_token);
            setUserEmail(email);
            // Store refresh token in localStorage
            localStorage.setItem('refreshToken', refresh_token); 

            setIsAuthenticated(true);
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setLoading(false); // Stop loading after login attempt
        }
    };

    const logout = () => {
        setAccessToken(null); // Clear in-memory access token
        localStorage.removeItem('refreshToken'); // Remove refresh token
        setIsAuthenticated(false);
        setUserEmail(null);
    };

    // Refresh access token periodically
    useEffect(() => {
        if (isAuthenticated) {
            const interval = setInterval(() => {
                getRefreshToken();
            }, 15 * 60 * 1000); // Refresh every 15 minutes
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    // Check for existing refresh token on mount
    useEffect(() => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            getRefreshToken(); // Try to refresh token on app mount
        } else {
            setLoading(false); // Stop loading if no refresh token
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, accessToken, login, logout, loading, userEmail }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
