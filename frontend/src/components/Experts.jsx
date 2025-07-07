import React from 'react'
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
  Chip
} from '@mui/material'

const Experts = () => {
  const doctors = [
    {
      name: 'Dr. Sarah Johnson',
      specialty: 'Small Animal Medicine',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face',
      rating: 4.9,
      experience: '8 years'
    },
    {
      name: 'Dr. Michael Chen',
      specialty: 'Exotic Animal Care',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face',
      rating: 4.8,
      experience: '12 years'
    },
    {
      name: 'Dr. Emily Rodriguez',
      specialty: 'Surgery Specialist',
      image: 'https://images.unsplash.com/photo-1594824885309-78dcbf4d6eb8?w=300&h=300&fit=crop&crop=face',
      rating: 4.9,
      experience: '10 years'
    }
  ]

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

          <Grid container spacing={4}
                    sx={{ 
            justifyContent: 'center',
            alignItems: 'stretch' // Ensures all cards have equal height
          }}
          >
            {doctors.map((doctor, index) => (
              <Grid item xs={12} sm={6} lg={4} key={index}>
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ y: -10 }}
                >
                  <Card
                    sx={{
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
                        image={doctor.image}
                        alt={doctor.name}
                        sx={{
                          objectFit: 'cover'
                        }}
                      />
                    </motion.div>

                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          color: '#28283E',
                          mb: 1,
                          fontSize: { xs: '1.2rem', md: '1.5rem' }
                        }}
                      >
                        {doctor.name}
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
                        {doctor.specialty}
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
                          value={doctor.rating}
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
                          {doctor.rating}
                        </Typography>
                      </Box>

                      <Chip
                        label={`${doctor.experience} Experience`}
                        sx={{
                          backgroundColor: 'rgba(46, 204, 113, 0.1)',
                          color: '#2ECC71',
                          fontWeight: 500,
                          mb: 3,
                          fontSize: { xs: '0.7rem', md: '0.8rem' }
                        }}
                      />

                      <Button
                        variant="contained"
                        fullWidth
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
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Box>
    </Box>
  )
}

export default Experts