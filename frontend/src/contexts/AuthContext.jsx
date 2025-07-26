import React, { createContext, useState, useContext, useEffect } from 'react';
import apiService from '../services/api';
import toast from 'react-hot-toast';

// Create the context
export const AuthContext = createContext();

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        console.log('User restored from localStorage:', parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Login function that makes API call
  const loginWithCredentials = async (credentials) => {
    try {
      console.log('AuthContext: Making API call with credentials:', credentials);
      const response = await apiService.auth.login(credentials);
      console.log('AuthContext: API response:', response);
      
      // Handle different response structures
      let token, userData, success;
      
      if (response.data.success !== undefined) {
        // Backend returns { success: true/false, user: {...}, token: "..." }
        success = response.data.success;
        userData = response.data.user;
        token = response.data.token;
      } else if (response.data.token && response.data.user) {
        // Backend returns { token: "...", user: {...} }
        success = true;
        token = response.data.token;
        userData = response.data.user;
      } else {
        // Handle other formats
        success = true;
        token = response.data.token || response.data.accessToken || 'temp-token';
        userData = response.data.user || response.data;
      }
      
      if (!success) {
        throw new Error(response.data.message || 'Login failed');
      }
      
      if (!userData) {
        throw new Error('No user data received');
      }
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      
      console.log('AuthContext: Login successful, user set:', userData);
      return { success: true, user: userData };
      
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = 'Invalid credentials format.';
            break;
          case 401:
            errorMessage = 'Invalid email/username or password.';
            break;
          case 403:
            errorMessage = 'Account is disabled.';
            break;
          case 404:
            errorMessage = 'User not found.';
            break;
          default:
            errorMessage = error.response.data?.message || 'Login failed.';
        }
      }
      
      return { success: false, error: errorMessage };
    }
  };

  // Login function that accepts user data directly (for when API call is made elsewhere)
  const loginWithUserData = (userData) => {
    console.log('AuthContext: Login with user data:', userData);
    
    setUser(userData);
    setIsAuthenticated(true);
    
    // Store user data (token should already be stored)
    localStorage.setItem('user', JSON.stringify(userData));
    
    return { success: true, user: userData };
  };

  // Main login function that can handle both cases
  const login = (credentialsOrUserData) => {
    // If it has email/usernameOrEmail and password, it's credentials
    if (credentialsOrUserData.password && (credentialsOrUserData.email || credentialsOrUserData.usernameOrEmail)) {
      return loginWithCredentials(credentialsOrUserData);
    } else {
      // It's user data
      return loginWithUserData(credentialsOrUserData);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      console.log('AuthContext: Registering user:', userData);
      const response = await apiService.auth.register(userData);
      console.log('AuthContext: Registration response:', response);
      
      if (response.data.success === false) {
        throw new Error(response.data.message || 'Registration failed');
      }
      
      return { success: true };
    } catch (error) {
      console.error('AuthContext: Registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = 'Invalid registration data.';
            break;
          case 409:
            errorMessage = 'Email already exists.';
            break;
          case 422:
            errorMessage = 'Validation error.';
            break;
          default:
            errorMessage = error.response.data?.message || 'Registration failed.';
        }
      }
      
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully!');
  };

  // Update user function
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    loginWithCredentials, // Expose both methods
    loginWithUserData,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Default export
export default AuthProvider;