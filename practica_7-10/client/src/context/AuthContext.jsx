import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (accessToken) {
        try {
          const res = await axios.get('http://localhost:5000/authentication/me', {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          setUser(res.data);
        } catch (err) {
          await refreshAccessToken();
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const refreshAccessToken = async () => {
    if (!refreshToken) {
      logout();
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/authentication/refresh', {}, {
        headers: { Authorization: `Bearer ${refreshToken}` }
      });

      const { accessToken: newAccess, refreshToken: newRefresh } = res.data;

      localStorage.setItem('accessToken', newAccess);
      localStorage.setItem('refreshToken', newRefresh);

      setAccessToken(newAccess);
      setRefreshToken(newRefresh);

      const userRes = await axios.get('http://localhost:5000/authentication/me', {
        headers: { Authorization: `Bearer ${newAccess}` }
      });
      setUser(userRes.data);
    } catch (err) {
      console.error('Refresh failed:', err);
      logout();
    }
  };

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          await refreshAccessToken();

          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return axios(originalRequest);
        }

        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [accessToken, refreshToken]);

  const login = (access, refresh, userData) => {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    setAccessToken(access);
    setRefreshToken(refresh);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);