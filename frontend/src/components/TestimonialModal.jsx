import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Rating,
  Paper
} from '@mui/material';
import {
  Close,
  Star,
  RateReview,
  CheckCircle
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import apiService from '../services/api';

const TestimonialModal = ({ open, onClose, appointment, onSuccess }) => {
  const [formData, setFormData] = useState({
    appointmentRating: 0,
    doctorRating: 0,
    reviewComment: ''
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleRatingChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCommentChange = (e) => {
    setFormData(prev => ({
      ...prev,
      reviewComment: e.target.value
    }));
    if (errors.reviewComment) {
      setErrors(prev => ({ ...prev, reviewComment: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.appointmentRating === 0) {
      newErrors.appointmentRating = 'Please rate your appointment experience';
    }
    if (formData.doctorRating === 0) {
      newErrors.doctorRating = 'Please rate the doctor';
    }
    if (!formData.reviewComment.trim()) {
      newErrors.reviewComment = 'Please share your experience';
    } else if (formData.reviewComment.trim().length < 10) {
      newErrors.reviewComment = 'Review must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please complete all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      await apiService.appointments.addTestimonial(appointment.id, {
        appointmentRating: formData.appointmentRating,
        doctorRating: formData.doctorRating,
        reviewComment: formData.reviewComment.trim()
      });
      
      setShowSuccess(true);
      
      toast.success('Thank you for your feedback!', {
        duration: 3000,
        icon: '⭐',
        style: {
          background: '#2ECC71',
          color: 'white',
          fontWeight: '600',
          borderRadius: '12px',
        },
      });
      
      setTimeout(() => {
        setShowSuccess(false);
        onSuccess?.();
        handleClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      appointmentRating: 0,
      doctorRating: 0,
      reviewComment: ''
    });
    setErrors({});
    setShowSuccess(false);
    onClose();
  };

  if (!appointment) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden'
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
              >
                Thank You!
              </Typography>
              <Typography 
                variant="h6" 
                color="#144E8C" 
                textAlign="center"
              >
                Your feedback helps us improve
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
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
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <RateReview sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Rate Your Experience
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Help others make informed decisions
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Appointment Info */}
        <Box sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
          <Typography variant="body1" color="#144E8C" mb={0.5}>
            <strong>Pet:</strong> {appointment.petName} ({appointment.petType})
          </Typography>
          <Typography variant="body1" color="#144E8C">
            <strong>Date:</strong> {appointment.appointmentDate} at {appointment.appointmentTime}
          </Typography>
        </Box>

        {/* Rating Form */}
        <Box sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            {/* Appointment Rating */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                border: `2px solid ${errors.appointmentRating ? '#FF6B6B' : 'rgba(46, 204, 113, 0.2)'}`,
                borderRadius: 3,
                backgroundColor: errors.appointmentRating ? 'rgba(255, 107, 107, 0.05)' : 'white'
              }}
            >
              <Typography variant="h6" fontWeight="600" color="#28283E" mb={1}>
                Rate Your Appointment Experience
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <Rating
                  name="appointment-rating"
                  value={formData.appointmentRating}
                  onChange={(event, newValue) => handleRatingChange('appointmentRating', newValue)}
                  size="large"
                  sx={{
                    fontSize: '3rem',
                    '& .MuiRating-iconFilled': {
                      color: '#2ECC71'
                    }
                  }}
                />
              </Box>
              {errors.appointmentRating && (
                <Typography variant="caption" color="error" display="block" textAlign="center">
                  {errors.appointmentRating}
                </Typography>
              )}
            </Paper>

            {/* Doctor Rating */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                border: `2px solid ${errors.doctorRating ? '#FF6B6B' : 'rgba(46, 204, 113, 0.2)'}`,
                borderRadius: 3,
                backgroundColor: errors.doctorRating ? 'rgba(255, 107, 107, 0.05)' : 'white'
              }}
            >
              <Typography variant="h6" fontWeight="600" color="#28283E" mb={1}>
                Rate the Veterinarian
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <Rating
                  name="doctor-rating"
                  value={formData.doctorRating}
                  onChange={(event, newValue) => handleRatingChange('doctorRating', newValue)}
                  size="large"
                  sx={{
                    fontSize: '3rem',
                    '& .MuiRating-iconFilled': {
                      color: '#2ECC71'
                    }
                  }}
                />
              </Box>
              {errors.doctorRating && (
                <Typography variant="caption" color="error" display="block" textAlign="center">
                  {errors.doctorRating}
                </Typography>
              )}
            </Paper>

            {/* Review Comment */}
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Share Your Experience *"
              value={formData.reviewComment}
              onChange={handleCommentChange}
              error={!!errors.reviewComment}
              helperText={errors.reviewComment || 'Tell us about your experience with our service'}
              placeholder="What did you like about the service? How was your experience with the doctor?"
              sx={{
                mb: 3,
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

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={handleClose}
                disabled={loading}
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
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Star />}
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
                {loading ? 'Submitting...' : 'Submit Review'}
              </Button>
            </Box>
          </form>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TestimonialModal;
