import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Rating,
  Chip,
  CircularProgress
} from '@mui/material'
import toast from 'react-hot-toast'
import apiService from '../services/api'
import AppointmentModal from './AppointmentModal'

const Experts = () => {
  const [veterinarians, setVeterinarians] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedVet, setSelectedVet] = useState(null)
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false)

  useEffect(() => {
    fetchVeterinarians()
  }, [])

  const fetchVeterinarians = async () => {
    try {
      setLoading(true)
      const response = await apiService.veterinarians.getAvailable()
      setVeterinarians(response.data)
    } catch (error) {
      console.error('Error fetching veterinarians:', error)
      toast.error('Failed to load veterinarians')
    } finally {
      setLoading(false)
    }
  }

  const handleBookAppointment = (veterinarian) => {
    setSelectedVet(veterinarian)
    setAppointmentModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedVet(null)
    setAppointmentModalOpen(false)
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  const stagger = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  if (loading) {
    return (
      <Box sx={{ backgroundColor: 'white', py: { xs: 8, md: 12 } }}>
        <Box sx={{ width: '80%', mx: 'auto', textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ color: '#2ECC71' }} />
          <Typography variant="h6" sx={{ mt: 2, color: '#144E8C' }}>
            Loading our expert veterinarians...
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ backgroundColor: 'white', py: { xs: 8, md: 12 } }}>
      <Box sx={{ width: '80%', mx: 'auto' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.div variants={fadeInUp}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.8rem', md: '2.5rem', lg: '3rem' },
                  fontWeight: 700,
                  color: '#28283E',
                  mb: 2
                }}
              >
                Meet Our <span className="text-gradient">Expert Doctors</span>
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#144E8C',
                  maxWidth: 600,
                  mx: 'auto',
                  fontSize: { xs: '1rem', md: '1.1rem' }
                }}
              >
                Our team of experienced veterinarians is dedicated to providing the best care for your pets
              </Typography>
            </Box>
          </motion.div>

          {veterinarians.length === 0 ? (
            <motion.div variants={fadeInUp}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="#144E8C">
                  No veterinarians available at the moment.
                </Typography>
                <Typography variant="body1" color="#666" sx={{ mt: 1 }}>
                  Please check back later or contact us for more information.
                </Typography>
              </Box>
            </motion.div>
          ) : (
            <Grid 
              container 
              spacing={4}
              sx={{ 
                justifyContent: 'center',
                alignItems: 'stretch'
              }}
            >
              {veterinarians.map((veterinarian, index) => (
                <Grid item xs={12} sm={6} lg={4} key={veterinarian.id}>
                  <motion.div
                    variants={fadeInUp}
                    whileHover={{ y: -10 }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 4,
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(46, 204, 113, 0.1)',
                        '&:hover': {
                          boxShadow: '0 20px 40px rgba(46, 204, 113, 0.2)'
                        },
                        transition: 'all 0.3s ease',
                        backgroundColor: 'white'
                      }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardMedia
                          component="img"
                          height={300}
                          image={veterinarian.imageUrl || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face'}
                          alt={veterinarian.fullName}
                          sx={{
                            objectFit: 'cover'
                          }}
                        />
                      </motion.div>

                      <CardContent sx={{ p: 3, textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 600,
                            color: '#28283E',
                            mb: 1,
                            fontSize: { xs: '1.2rem', md: '1.5rem' }
                          }}
                        >
                          {veterinarian.fullName}
                        </Typography>

                        <Typography
                          variant="body1"
                          sx={{
                            color: '#2ECC71',
                            fontWeight: 500,
                            mb: 2,
                            fontSize: { xs: '0.9rem', md: '1rem' }
                          }}
                        >
                          {veterinarian.specialization || 'General Practice'}
                        </Typography>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            mb: 2
                          }}
                        >
                          <Rating
                            value={parseFloat(veterinarian.rating) || 0}
                            precision={0.1}
                            readOnly
                            size="small"
                            sx={{
                              '& .MuiRating-iconFilled': {
                                color: '#2ECC71'
                              }
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ color: '#144E8C', fontWeight: 500 }}
                          >
                            {parseFloat(veterinarian.rating || 0).toFixed(1)} ({veterinarian.totalReviews || 0})
                          </Typography>
                        </Box>

                        <Chip
                          label={`${veterinarian.yearsOfExperience || 0} Years Experience`}
                          sx={{
                            backgroundColor: 'rgba(46, 204, 113, 0.1)',
                            color: '#2ECC71',
                            fontWeight: 500,
                            mb: 2,
                            fontSize: { xs: '0.7rem', md: '0.8rem' }
                          }}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: '#28283E',
                              fontWeight: 700,
                              fontSize: { xs: '1rem', md: '1.2rem' }
                            }}
                          >
                            ${parseFloat(veterinarian.consultationFee || 0).toFixed(0)} / Visit
                          </Typography>
                        </Box>

                        <Box sx={{ mt: 'auto' }}>
                          <Button
                            variant="contained"
                            fullWidth
                            onClick={() => handleBookAppointment(veterinarian)}
                            sx={{
                              backgroundColor: '#2ECC71',
                              color: 'white',
                              borderRadius: 3,
                              py: 1.5,
                              fontWeight: 600,
                              fontSize: { xs: '0.8rem', md: '0.9rem' },
                              '&:hover': {
                                backgroundColor: '#144E8C',
                                transform: 'translateY(-2px)'
                              },
                              transition: 'all 0.3s ease'
                            }}
                          >
                            Book Appointment
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
        </motion.div>
      </Box>

      {/* Appointment Modal */}
      <AppointmentModal
        open={appointmentModalOpen}
        onClose={handleCloseModal}
        veterinarian={selectedVet}
      />
    </Box>
  )
}

export default Experts