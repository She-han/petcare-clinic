import React from 'react'
import { motion } from 'framer-motion'
import {
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box
} from '@mui/material'
import {
  LocalHospital as HospitalIcon,
  Schedule as ScheduleIcon,
  ShoppingCart as ShoppingIcon,
  Pets as PetsIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material'

const Services = () => {
  const services = [
    {
      icon: <HospitalIcon sx={{ fontSize: 40, color: '#2ECC71' }} />,
      title: 'Emergency Care',
      description: '24/7 emergency veterinary services for your beloved pets',
      features: ['24/7 Availability', 'Expert Veterinarians', 'Advanced Equipment']
    },
    {
      icon: <ScheduleIcon sx={{ fontSize: 40, color: '#0074D9' }} />,
      title: 'Appointment Booking',
      description: 'Easy online appointment scheduling with your preferred doctor',
      features: ['Online Booking', 'Flexible Scheduling', 'Reminder Notifications']
    },
    {
      icon: <ShoppingIcon sx={{ fontSize: 40, color: '#144E8C' }} />,
      title: 'Pet Products',
      description: 'High-quality pet care products and medications',
      features: ['Quality Products', 'Fast Delivery', 'Expert Recommendations']
    },
    {
      icon: <PetsIcon sx={{ fontSize: 40, color: '#2ECC71' }} />,
      title: 'Grooming Services',
      description: 'Professional grooming services to keep your pet healthy',
      features: ['Professional Grooming', 'Health Checkups', 'Spa Treatments']
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
    <Box sx={{ width: '90%', mx: 'auto', alignItems:'center', justifyItems:'center', py: { xs: 8, md: 12 } }}>
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
              Our <span className="text-gradient">Services</span>
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
              Comprehensive pet care services designed to keep your furry friends healthy and happy
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={4}
                            sx={{ 
            justifyContent: 'center',
            alignItems: 'stretch' // Ensures all cards have equal height
          }}
        >
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <motion.div
                variants={fadeInUp}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
              >
                <Card
                  sx={{
                    width: '300px',
                    height: {xs:'100%',md:'500px'},
                    borderRadius: 4,
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(46, 204, 113, 0.1)',
                    '&:hover': {
                      boxShadow: '0 20px 40px rgba(46, 204, 113, 0.2)',
                      transform: 'translateY(-5px)'
                    },
                    transition: 'all 0.3s ease',
                    backgroundColor: 'white',
                    alignItems: 'stretch' ,
                    justifyItems: 'stretch'
                  }}
                >
                  <CardContent sx={{ p: { xs: 3, md: 4 }, textAlign: 'center', alignItems: 'stretch' ,
                    justifyContent: 'stretch' }}>
                    <motion.div
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 360,
                        transition: { duration: 0.6 }
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: 60, md: 80 },
                          height: { xs: 60, md: 80 },
                          borderRadius: '50%',
                          backgroundColor: 'rgba(46, 204, 113, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 3
                        }}
                      >
                        {service.icon}
                      </Box>
                    </motion.div>

                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        color: '#28283E',
                        mb: 2,
                        fontSize: { xs: '1.2rem', md: '1.5rem' }
                      }}
                    >
                      {service.title}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        color: '#144E8C',
                        mb: 3,
                        lineHeight: 1.6,
                        fontSize: { xs: '0.9rem', md: '1rem' }
                      }}
                    >
                      {service.description}
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                      {service.features.map((feature, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 1
                          }}
                        >
                          <CheckIcon
                            sx={{
                              color: '#2ECC71',
                              fontSize: { xs: 14, md: 16 },
                              mr: 1
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ 
                              color: '#144E8C', 
                              fontSize: { xs: '0.8rem', md: '0.9rem' }
                            }}
                          >
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    <Button
                      variant="outlined"
                      sx={{
                        color: '#2ECC71',
                        borderColor: '#2ECC71',
                        borderRadius: 3,
                        px: 3,
                        fontSize: { xs: '0.8rem', md: '0.9rem' },
                        '&:hover': {
                          backgroundColor: '#2ECC71',
                          color: 'white',
                          transform: 'scale(1.05)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Box>
  )
}

export default Services