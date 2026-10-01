import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const handleUnauthorized = () => {
      logout(false);
      addToast('Session expired. Please log in again.', 'warning');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [addToast]);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await authApi.getMe();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        } catch (err) {
          // Token is likely invalid
          logout(false);
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.data) {
        const { token: jwtToken, ...userData } = res.data;
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(userData));
        addToast(`Welcome back, ${userData.name}!`, 'success');
        return { success: true, user: userData };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      const errorMsg = err.message || 'Invalid email or password';
      addToast(errorMsg, 'error');
      return { success: false, message: errorMsg };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await authApi.register({ name, email, password });
      if (res.success && res.data) {
        const { token: jwtToken, ...userData } = res.data;
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(userData));
        addToast('Account created successfully!', 'success');
        return { success: true, user: userData };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err) {
      const errorMsg = err.message || 'Registration failed';
      addToast(errorMsg, 'error');
      return { success: false, message: errorMsg };
    }
  };

  const logout = (notify = true) => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (notify) {
      addToast('Logged out successfully', 'info');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await authApi.updateProfile(profileData);
      if (res.success && res.data) {
        setUser((prev) => ({ ...prev, ...res.data }));
        localStorage.setItem('user', JSON.stringify({ ...user, ...res.data }));
        addToast('Profile updated successfully!', 'success');
        return { success: true };
      }
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
      return { success: false };
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
