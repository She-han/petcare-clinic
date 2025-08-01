import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    dateOfBirth: '',
    profileImageUrl: ''
  });

  const [userAppointments, setUserAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchUserAppointments();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const response = await apiService.auth.getProfile(user.id);
      const userData = response.data;
      setProfileData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
        state: userData.state || '',
        zipCode: userData.zipCode || '',
        country: userData.country || 'USA',
        dateOfBirth: userData.dateOfBirth || '',
        profileImageUrl: userData.profileImageUrl || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    }
  };

  const fetchUserAppointments = async () => {
    try {
      setAppointmentsLoading(true);
      const response = await apiService.appointments.getByUser(user.id);
      setUserAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await apiService.auth.updateProfile(user.id, profileData);
      const updatedUser = response.data;
      
      // Update the user in context
      updateUser({
        ...user,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName
      });
      
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    fetchUserProfile(); // Reset to original data
  };

  if (!user) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6">Please log in to view your profile</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4, mt: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Profile Information Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'rgba(46, 204, 113, 0.2)',
            background: 'linear-gradient(135deg, rgba(237, 252, 253, 0.8) 0%, rgba(255, 255, 255, 0.9) 100%)'
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 2,
                bgcolor: '#2ECC71',
                fontSize: '3rem'
              }}
              src={profileData.profileImageUrl}
            >
              <PersonIcon fontSize="large" />
            </Avatar>
            
            <Typography variant="h4" fontWeight="bold" color="#28283E" mb={1}>
              {user.firstName} {user.lastName}
            </Typography>
            
            <Typography variant="body1" color="#144E8C" mb={2}>
              @{user.username} • {user.email}
            </Typography>
            
            {!editing ? (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => setEditing(true)}
                sx={{
                  backgroundColor: '#2ECC71',
                  '&:hover': { backgroundColor: '#27AE60' },
                  borderRadius: 3,
                  px: 3
                }}
              >
                Edit Profile
              </Button>
            ) : (
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
                  onClick={handleSave}
                  disabled={loading}
                  sx={{
                    backgroundColor: '#2ECC71',
                    '&:hover': { backgroundColor: '#27AE60' },
                    borderRadius: 3
                  }}
                >
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  sx={{
                    borderColor: '#2ECC71',
                    color: '#2ECC71',
                    '&:hover': {
                      borderColor: '#27AE60',
                      backgroundColor: 'rgba(46, 204, 113, 0.04)'
                    },
                    borderRadius: 3
                  }}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Profile Form */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={profileData.firstName}
                onChange={handleInputChange}
                disabled={!editing}
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={profileData.lastName}
                onChange={handleInputChange}
                disabled={!editing}
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                disabled={!editing}
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={profileData.dateOfBirth}
                onChange={handleInputChange}
                disabled={!editing}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
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
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={profileData.address}
                onChange={handleInputChange}
                disabled={!editing}
                variant="outlined"
                multiline
                rows={2}
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
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={profileData.city}
                onChange={handleInputChange}
                disabled={!editing}
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
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={profileData.state}
                onChange={handleInputChange}
                disabled={!editing}
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
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="ZIP Code"
                name="zipCode"
                value={profileData.zipCode}
                onChange={handleInputChange}
                disabled={!editing}
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
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={profileData.country}
                onChange={handleInputChange}
                disabled={!editing}
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
            </Grid>
          </Grid>
        </Paper>

        {/* User Appointments Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mt: 4,
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'rgba(46, 204, 113, 0.2)',
            background: 'linear-gradient(135deg, rgba(237, 252, 253, 0.8) 0%, rgba(255, 255, 255, 0.9) 100%)'
          }}
        >
          <Typography variant="h5" fontWeight="bold" color="#28283E" mb={3}>
            My Appointments
          </Typography>
          
          {appointmentsLoading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#2ECC71' }} />
            </Box>
          ) : userAppointments.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="#144E8C">
                No appointments found
              </Typography>
              <Typography variant="body1" color="#666">
                Book your first appointment with our expert veterinarians!
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {userAppointments.map((appointment) => (
                <Grid item xs={12} md={6} key={appointment.id}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      border: '1px solid rgba(46, 204, 113, 0.1)',
                      '&:hover': {
                        boxShadow: '0 8px 25px rgba(46, 204, 113, 0.15)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" fontWeight="600" color="#28283E">
                          {appointment.petName}
                        </Typography>
                        <Chip
                          label={appointment.status}
                          size="small"
                          sx={{
                            backgroundColor: appointment.status === 'SCHEDULED' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                            color: appointment.status === 'SCHEDULED' ? '#2ECC71' : '#FFC107',
                            fontWeight: 600
                          }}
                        />
                      </Box>
                      
                      <Typography variant="body2" color="#144E8C" mb={1}>
                        <strong>Pet Type:</strong> {appointment.petType}
                      </Typography>
                      
                      <Typography variant="body2" color="#144E8C" mb={1}>
                        <strong>Reason:</strong> {appointment.reasonForVisit}
                      </Typography>
                      
                      <Typography variant="body2" color="#144E8C" mb={1}>
                        <strong>Date & Time:</strong> {appointment.appointmentDate} at {appointment.appointmentTime}
                      </Typography>
                      
                      {appointment.additionalNotes && (
                        <Typography variant="body2" color="#666" mt={2}>
                          <strong>Notes:</strong> {appointment.additionalNotes}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
};

export default UserProfile;