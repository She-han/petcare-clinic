import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  TextField,
  Typography,
  Box,
  Tab,
  Tabs,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const AuthModal = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const [loginData, setLoginData] = useState({
    usernameOrEmail: '',
    password: ''
  });

  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateSignup = () => {
    if (!signupData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (!signupData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!signupData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!signupData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!signupData.password) {
      setError('Password is required');
      return false;
    }
    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!loginData.usernameOrEmail.trim() || !loginData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiService.auth.login(loginData);
      
      if (response.data.success) {
        login(response.data.user);
        toast.success('Login successful!');
        
        // Check if user is admin
        if (response.data.user.role === 'ADMIN') {
          // Redirect to admin dashboard
          window.location.href = '/admin/dashboard';
        } else {
          // Close modal for regular users
          onClose();
        }
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateSignup()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { confirmPassword, ...dataToSend } = signupData;
      const response = await apiService.auth.register(dataToSend);
      
      if (response.data.success) {
        toast.success('Account created successfully! Please login.');
        setActiveTab(0); // Switch to login tab
        setSignupData({
          username: '',
          email: '',
          firstName: '',
          lastName: '',
          password: '',
          confirmPassword: ''
        });
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden'
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ position: 'relative' }}>
          {/* Header */}
          <Box sx={{ 
            background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)',
            color: 'white',
            p: 3,
            position: 'relative'
          }}>
            <IconButton
              onClick={onClose}
              sx={{ 
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'white'
              }}
            >
              <CloseIcon />
            </IconButton>
            
            <Typography variant="h4" fontWeight="bold" textAlign="center" mb={1}>
              Welcome to PetCarePro
            </Typography>
            <Typography variant="body1" textAlign="center" sx={{ opacity: 0.9 }}>
              {activeTab === 0 ? 'Sign in to your account' : 'Create your account'}
            </Typography>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              centered
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none'
                },
                '& .Mui-selected': {
                  color: '#2ECC71'
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#2ECC71'
                }
              }}
            >
              <Tab label="Login" />
              <Tab label="Sign Up" />
            </Tabs>
          </Box>

          {/* Content */}
          <Box sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <AnimatePresence mode="wait">
              {activeTab === 0 ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleLogin}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <TextField
                        fullWidth
                        label="Username or Email"
                        name="usernameOrEmail"
                        value={loginData.usernameOrEmail}
                        onChange={handleLoginChange}
                        variant="outlined"
                        InputProps={{
                          startAdornment: <PersonIcon sx={{ color: '#2ECC71', mr: 1 }} />
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                              borderColor: '#2ECC71'
                            }
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#2ECC71'
                          }
                        }}
                      />
                      
                      <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        variant="outlined"
                        InputProps={{
                          startAdornment: <LockIcon sx={{ color: '#2ECC71', mr: 1 }} />
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                              borderColor: '#2ECC71'
                            }
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#2ECC71'
                          }
                        }}
                      />

                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{
                          backgroundColor: '#2ECC71',
                          py: 1.5,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: '#27AE60'
                          }
                        }}
                      >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                      </Button>
                    </Box>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleSignup}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={signupData.username}
                        onChange={handleSignupChange}
                        variant="outlined"
                        InputProps={{
                          startAdornment: <PersonIcon sx={{ color: '#2ECC71', mr: 1 }} />
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                              borderColor: '#2ECC71'
                            }
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#2ECC71'
                          }
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={signupData.email}
                        onChange={handleSignupChange}
                        variant="outlined"
                        InputProps={{
                          startAdornment: <EmailIcon sx={{ color: '#2ECC71', mr: 1 }} />
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                              borderColor: '#2ECC71'
                            }
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#2ECC71'
                          }
                        }}
                      />

                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                          fullWidth
                          label="First Name"
                          name="firstName"
                          value={signupData.firstName}
                          onChange={handleSignupChange}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&.Mui-focused fieldset': {
                                borderColor: '#2ECC71'
                              }
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: '#2ECC71'
                            }
                          }}
                        />
                        
                        <TextField
                          fullWidth
                          label="Last Name"
                          name="lastName"
                          value={signupData.lastName}
                          onChange={handleSignupChange}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&.Mui-focused fieldset': {
                                borderColor: '#2ECC71'
                              }
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: '#2ECC71'
                            }
                          }}
                        />
                      </Box>
                      
                      <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={signupData.password}
                        onChange={handleSignupChange}
                        variant="outlined"
                        InputProps={{
                          startAdornment: <LockIcon sx={{ color: '#2ECC71', mr: 1 }} />
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                              borderColor: '#2ECC71'
                            }
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#2ECC71'
                          }
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={signupData.confirmPassword}
                        onChange={handleSignupChange}
                        variant="outlined"
                        InputProps={{
                          startAdornment: <LockIcon sx={{ color: '#2ECC71', mr: 1 }} />
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': {
                              borderColor: '#2ECC71'
                            }
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#2ECC71'
                          }
                        }}
                      />

                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{
                          backgroundColor: '#2ECC71',
                          py: 1.5,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: '#27AE60'
                          }
                        }}
                      >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                      </Button>
                    </Box>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;