import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  TextField,
  Typography,
  Box,
  Avatar,
  Chip,
  Rating,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Grid,
  Divider,
  IconButton,
  Paper,
  Backdrop
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  Phone,
  Email,
  Pets,
  Close,
  LocalHospital,
  AttachMoney,
  Schedule,
  Person,
  CheckCircle
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const AppointmentModal = ({ open, onClose, veterinarian }) => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    petName: '',
    petType: 'Rabbit', // Default to Rabbit
    petAge: '',
    appointmentDate: '',
    appointmentTime: '08:00',
    reasonForVisit: 'Regular Checkup',
    additionalNotes: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const petTypes = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Fish', 'Reptile', 'Other'];
  
  const reasonOptions = [
    'Regular Checkup',
    'Vaccination',
    'Surgery Consultation',
    'Emergency Care',
    'Dental Care',
    'Grooming',
    'Behavioral Issues',
    'Skin Problems',
    'Other'
  ];

  // Auto-fill user info if logged in
  React.useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        clientName: `${user.firstName} ${user.lastName}`,
        clientEmail: user.email
      }));
    }
  }, [isAuthenticated, user]);

  // Generate available time slots based on vet's working hours
  const generateTimeSlots = () => {
    if (!veterinarian?.availableFrom || !veterinarian?.availableTo) {
      return ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
    }
    
    const slots = [];
    const startTime = veterinarian.availableFrom.split(':');
    const endTime = veterinarian.availableTo.split(':');
    
    let currentHour = parseInt(startTime[0]);
    let currentMinute = parseInt(startTime[1]);
    const endHour = parseInt(endTime[0]);
    const endMinute = parseInt(endTime[1]);
    
    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      slots.push(timeString);
      
      currentMinute += 30; // 30-minute slots
      if (currentMinute >= 60) {
        currentMinute = 0;
        currentHour++;
      }
    }
    
    return slots;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.clientName.trim()) newErrors.clientName = 'Name is required';
    if (!formData.clientEmail.trim()) newErrors.clientEmail = 'Email is required';
    if (!formData.petName.trim()) newErrors.petName = 'Pet name is required';
    if (!formData.petType) newErrors.petType = 'Pet type is required';
    if (!formData.appointmentDate) newErrors.appointmentDate = 'Date is required';
    if (!formData.appointmentTime) newErrors.appointmentTime = 'Time is required';
    if (!formData.reasonForVisit) newErrors.reasonForVisit = 'Reason for visit is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.clientEmail && !emailRegex.test(formData.clientEmail)) {
      newErrors.clientEmail = 'Please enter a valid email address';
    }
    
    // Date validation (must be future date)
    if (formData.appointmentDate) {
      const selectedDate = new Date(formData.appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.appointmentDate = 'Please select a future date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }
    
    setLoading(true);
    
    try {
      // Check availability first
      const availabilityResponse = await apiService.appointments.checkAvailability(
        veterinarian.id,
        formData.appointmentDate,
        formData.appointmentTime
      );
      
      if (!availabilityResponse.data) {
        toast.error('This time slot is no longer available. Please choose another time.');
        setLoading(false);
        return;
      }
      
      // Create appointment
      const appointmentData = {
        veterinarianId: veterinarian.id,
        userId: isAuthenticated ? user.id : null, // Link to user if logged in
        clientName: formData.clientName.trim(),
        clientEmail: formData.clientEmail.trim(),
        clientPhone: formData.clientPhone?.trim() || null,
        petName: formData.petName.trim(),
        petType: formData.petType,
        petAge: formData.petAge?.trim() || null,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        reasonForVisit: formData.reasonForVisit,
        additionalNotes: formData.additionalNotes?.trim() || null,
        status: 'SCHEDULED'
      };
      
      await apiService.appointments.create(appointmentData);
      
      // Show success animation
      setShowSuccess(true);
      
      // Reset form after delay
      setTimeout(() => {
        setFormData({
          clientName: isAuthenticated ? `${user.firstName} ${user.lastName}` : '',
          clientEmail: isAuthenticated ? user.email : '',
          clientPhone: '',
          petName: '',
          petType: '',
          petAge: '',
          appointmentDate: '',
          appointmentTime: '',
          reasonForVisit: '',
          additionalNotes: ''
        });
        setShowSuccess(false);
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error creating appointment:', error);
      if (error.response?.status === 409) {
        toast.error('This time slot is no longer available. Please choose another time.');
      } else {
        toast.error('Failed to book appointment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      clientName: isAuthenticated ? `${user.firstName} ${user.lastName}` : '',
      clientEmail: isAuthenticated ? user.email : '',
      clientPhone: '',
      petName: '',
      petType: '',
      petAge: '',
      appointmentDate: '',
      appointmentTime: '',
      reasonForVisit: '',
      additionalNotes: ''
    });
    setErrors({});
    setShowSuccess(false);
    onClose();
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (!veterinarian) return null;

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: 'hidden',
            maxHeight: '90vh',
            position: 'relative'
          }
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)'
          }
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 10,
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 360]
                  }}
                  transition={{ 
                    duration: 1,
                    ease: "easeInOut"
                  }}
                >
                  <CheckCircle 
                    sx={{ 
                      fontSize: 80, 
                      color: '#2ECC71',
                      mb: 2
                    }} 
                  />
                </motion.div>
                <Typography 
                  variant="h4" 
                  fontWeight="bold" 
                  color="#2ECC71" 
                  textAlign="center"
                  sx={{ mb: 1 }}
                >
                  Appointment Booked!
                </Typography>
                <Typography 
                  variant="h6" 
                  color="#144E8C" 
                  textAlign="center"
                >
                  We'll contact you soon with confirmation details
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>

          <Box sx={{ position: 'relative' }}>
            {/* Header with Vet Info */}
            <Box sx={{ 
              background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)',
              color: 'white',
              p: 3,
              position: 'relative'
            }}>
              <IconButton
                onClick={handleClose}
                sx={{ 
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                  }
                }}
              >
                <Close />
              </IconButton>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar
                  src={veterinarian.imageUrl}
                  sx={{
                    width: 80,
                    height: 80,
                    border: '3px solid white'
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" fontWeight="bold" mb={1}>
                    {veterinarian.fullName}
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                    {veterinarian.specialization || 'General Practice'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Rating
                        value={parseFloat(veterinarian.rating) || 0}
                        precision={0.1}
                        readOnly
                        size="small"
                        sx={{ '& .MuiRating-iconFilled': { color: 'white' } }}
                      />
                      <Typography variant="body2">
                        {parseFloat(veterinarian.rating || 0).toFixed(1)} ({veterinarian.totalReviews || 0})
                      </Typography>
                    </Box>
                    <Chip
                      label={`${veterinarian.yearsOfExperience || 0} Years Experience`}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Vet Details */}
            <Box sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AttachMoney sx={{ color: '#2ECC71' }} />
                    <Box>
                      <Typography variant="body2" color="textSecondary">Consultation Fee</Typography>
                      <Typography variant="h6" fontWeight="bold" color="#28283E">
                        ${parseFloat(veterinarian.consultationFee || 0).toFixed(0)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Schedule sx={{ color: '#2ECC71' }} />
                    <Box>
                      <Typography variant="body2" color="textSecondary">Available Hours</Typography>
                      <Typography variant="body1" fontWeight="600" color="#28283E">
                        {veterinarian.availableFrom || '09:00'} - {veterinarian.availableTo || '17:00'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalHospital sx={{ color: '#2ECC71' }} />
                    <Box>
                      <Typography variant="body2" color="textSecondary">License</Typography>
                      <Typography variant="body1" fontWeight="600" color="#28283E">
                        {veterinarian.licenseNumber}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              {veterinarian.bio && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" color="#144E8C" sx={{ lineHeight: 1.6 }}>
                    {veterinarian.bio}
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider />

            {/* Appointment Form */}
            <Box sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight="bold" color="#28283E" mb={3} textAlign="center">
                Book Your Appointment
              </Typography>

              {!isAuthenticated && (
                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    <strong>Tip:</strong> Log in to auto-fill your information and track your appointments!
                  </Typography>
                </Alert>
              )}

              {Object.keys(errors).length > 0 && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  Please fix the errors below and try again.
                </Alert>
              )}

            <form onSubmit={handleSubmit}>
  <Grid container spacing={3}>
  
  {/* Your Information Section */}
  <Grid item xs={12}>
    <Typography variant="h6" fontWeight="600" color="#2ECC71" sx={{ mb: 2 }}>
      Your Information
    </Typography>
    
    {/* Nested Grid for Your Information Fields */}
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Your Name *"
          name="clientName"
          value={formData.clientName}
          onChange={handleInputChange}
          error={!!errors.clientName}
          helperText={errors.clientName}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': { borderColor: '#2ECC71' }
            },
            '& .MuiInputLabel-root.Mui-focused': { color: '#2ECC71' }
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Email Address *"
          name="clientEmail"  
          type="email"
          value={formData.clientEmail}
          onChange={handleInputChange}
          error={!!errors.clientEmail}
          helperText={errors.clientEmail}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': { borderColor: '#2ECC71' }
            },
            '& .MuiInputLabel-root.Mui-focused': { color: '#2ECC71' }
          }}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Phone Number"
          name="clientPhone"
          value={formData.clientPhone}
          onChange={handleInputChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': { borderColor: '#2ECC71' }
            },
            '& .MuiInputLabel-root.Mui-focused': { color: '#2ECC71' }
          }}
        />
      </Grid>
    </Grid>
  </Grid>

  {/* Pet Information Section */}
  <Grid item xs={12} sx={{ mt: 3 }}>
    <Typography variant="h6" fontWeight="600" color="#2ECC71" sx={{ mb: 2 }}>
      Pet Information
    </Typography>
    
    {/* Nested Grid for Pet Information Fields */}
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Pet Name *"
          name="petName"
          value={formData.petName}
          onChange={handleInputChange}
          error={!!errors.petName}
          helperText={errors.petName}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': { borderColor: '#2ECC71' }
            },
            '& .MuiInputLabel-root.Mui-focused': { color: '#2ECC71' }
          }}
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <FormControl 
          fullWidth 
          error={!!errors.petType}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': { borderColor: '#2ECC71' }
            },
            '& .MuiInputLabel-root.Mui-focused': { color: '#2ECC71' }
          }}
        >
          <InputLabel>Pet Type *</InputLabel>
          <Select
            name="petType"
            value={formData.petType}
            onChange={handleInputChange}
            defaultChecked={formData.petType === 'Dog'}
            label="Pet Type *"
          >
            {petTypes.map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Pet Age"
          name="petAge"
          value={formData.petAge}
          onChange={handleInputChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': { borderColor: '#2ECC71' }
            },
            '& .MuiInputLabel-root.Mui-focused': { color: '#2ECC71' }
          }}
        />
      </Grid>
    </Grid>
  </Grid>

  {/* Appointment Details Section */}
  <Grid item xs={12} sx={{ mt: 3 }}>
    <Typography variant="h6" fontWeight="600" color="#2ECC71" sx={{ mb: 2 }}>
      Appointment Details
    </Typography>
    
    {/* Nested Grid for Appointment Details Fields */}
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <TextField
          fullWidth
          label="Appointment Date *"
          name="appointmentDate"
          type="date"
          value={formData.appointmentDate}
          onChange={handleInputChange}
          error={!!errors.appointmentDate}
          helperText={errors.appointmentDate}
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: getMinDate() }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': { borderColor: '#2ECC71' }
            },
            '& .MuiInputLabel-root.Mui-focused': { color: '#2ECC71' }
          }}
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <FormControl 
          fullWidth 
          error={!!errors.appointmentTime}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': { borderColor: '#2ECC71' }
            },
            '& .MuiInputLabel-root.Mui-focused': { color: '#2ECC71' }
          }}
        >
          <InputLabel>Appointment Time *</InputLabel>
          <Select
            name="appointmentTime"
            value={formData.appointmentTime}
            onChange={handleInputChange}
            label="Appointment Time *"
          >
            {generateTimeSlots().map(time => (
              <MenuItem key={time} value={time}>{time}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={4}>
        <FormControl 
          fullWidth 
          error={!!errors.reasonForVisit}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': { borderColor: '#2ECC71' }
            },
            '& .MuiInputLabel-root.Mui-focused': { color: '#2ECC71' }
          }}
        >
          <InputLabel>Reason for Visit *</InputLabel>
          <Select
            name="reasonForVisit"
            value={formData.reasonForVisit}
            onChange={handleInputChange}
            label="Reason for Visit *"
          >
            {reasonOptions.map(reason => (
              <MenuItem key={reason} value={reason}>{reason}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  </Grid>

  {/* Additional Notes Section */}
  <Grid item xs={12} sx={{ mt: 3 }}>
    <Typography variant="h6" fontWeight="600" color="#2ECC71" sx={{ mb: 2 }}>
      Additional Information
    </Typography>
    
    <TextField
      fullWidth
      label="Additional Notes"
      name="additionalNotes"
      value={formData.additionalNotes}
      onChange={handleInputChange}
      multiline
      rows={3}
      sx={{
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused fieldset': { borderColor: '#2ECC71' }
        },
        '& .MuiInputLabel-root.Mui-focused': { color: '#2ECC71' }
      }}
    />
  </Grid>

  {/* Action Buttons */}
  <Grid item xs={12} sx={{ mt: 4 }}>
    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
      <Button
        variant="outlined"
        onClick={handleClose}
        sx={{
          borderColor: '#2ECC71',
          color: '#2ECC71',
          px: 4,
          py: 1.5,
          borderRadius: 3,
          '&:hover': {
            borderColor: '#27AE60',
            backgroundColor: 'rgba(46, 204, 113, 0.04)'
          }
        }}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        sx={{
          backgroundColor: '#2ECC71',
          px: 4,
          py: 1.5,
          borderRadius: 3,
          fontSize: '1rem',
          fontWeight: 600,
          minWidth: 160,
          '&:hover': {
            backgroundColor: '#27AE60'
          }
        }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Book Appointment'
        )}
      </Button>
    </Box>
  </Grid>

</Grid>
</form>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AppointmentModal;