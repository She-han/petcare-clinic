import React from 'react'
import { motion } from 'framer-motion'
import { Box, Typography, IconButton, Link } from '@mui/material'
import {
  Pets as PetsIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon
} from '@mui/icons-material'

const MotionBox = motion(Box)

const Footer = () => {
  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Our Doctors', href: '#doctors' },
    { name: 'Contact', href: '#contact' },
    { name: 'Blog', href: '#blog' }
  ]

  const services = [
    { name: 'Emergency Care', href: '#emergency' },
    { name: 'Vaccinations', href: '#vaccinations' },
    { name: 'Surgery', href: '#surgery' },
    { name: 'Grooming', href: '#grooming' },
    { name: 'Dental Care', href: '#dental' },
    { name: 'Pet Boarding', href: '#boarding' }
  ]

  const socialLinks = [
    { icon: <FacebookIcon />, href: '#facebook', name: 'Facebook' },
    { icon: <TwitterIcon />, href: '#twitter', name: 'Twitter' },
    { icon: <InstagramIcon />, href: '#instagram', name: 'Instagram' },
    { icon: <LinkedInIcon />, href: '#linkedin', name: 'LinkedIn' }
  ]

  const contactInfo = [
    {
      icon: <PhoneIcon sx={{ color: '#2ECC71', fontSize: 20 }} />,
      text: '+1 (555) 123-4567',
      subtext: '24/7 Emergency Hotline'
    },
    {
      icon: <EmailIcon sx={{ color: '#2ECC71', fontSize: 20 }} />,
      text: 'hello@petcarepro.com',
      subtext: 'General Inquiries'
    },
    {
      icon: <LocationIcon sx={{ color: '#2ECC71', fontSize: 20 }} />,
      text: '123 Pet Care Street, Pet City, PC 12345',
      subtext: 'Main Branch Location'
    }
  ]

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  }

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  return (
    <Box sx={{ backgroundColor: '#28283E', py: 8 }}>
      <Box sx={{ maxWidth: '1400px', mx: 'auto', px: { xs: 2, md: 4 } }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <Box
            sx={{
              display: 'grid',
              gap: { xs: 4, md: 6 },
              gridTemplateColumns: {
                xs: 'repeat(1, minmax(0, 1fr))',
                sm: 'repeat(2, minmax(0, 1fr))',
                md: 'repeat(4, minmax(0, 1fr))',
                lg: 'repeat(4, minmax(0, 1fr))'
              }
            }}
          >
            <MotionBox variants={fadeInUp}
                 sx={{
                    gridColumn: { 
                      xs: '1', 
                      sm: '1 / -1',  // Full width on small screens
                      md: '1 / 3'    // Spans columns 1-2 on desktop
                    }
                  }} >
              <Box>
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <PetsIcon sx={{ fontSize: 40, color: '#2ECC71' }} />
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        color: 'white',
                        fontSize: { xs: '1.5rem', md: '2rem' }
                      }}
                    >
                      PetCare<span style={{ color: '#2ECC71' }}>Pro</span>
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      mb: 4,
                      lineHeight: 1.7,
                      fontSize: { xs: '0.9rem', md: '1rem' }
                    }}
                  >
                    Celebrating 8 years of excellence, PetCarePro is dedicated to providing unparalleled veterinary care by blending state-of-the-art technology with a deeply compassionate approach. Our commitment is to ensure the health and happiness of your beloved pets through comprehensive services and a team of passionate professionals.
                    
                  </Typography>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: '#2ECC71',
                        mb: 2,
                        fontSize: '1.1rem'
                      }}
                    >
                      Follow Us
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {socialLinks.map((social) => (
                        <motion.div key={social.name} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                          <IconButton
                            href={social.href}
                            sx={{
                              backgroundColor: 'rgba(46, 204, 113, 0.1)',
                              color: '#2ECC71',
                              '&:hover': {
                                backgroundColor: '#2ECC71',
                                color: 'white'
                              },
                              transition: 'all 0.3s ease'
                            }}
                          >
                            {social.icon}
                          </IconButton>
                        </motion.div>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </MotionBox>

            <MotionBox variants={fadeInUp}
                sx={{
                textAlign: { xs: 'left', md: 'right' },
                gridColumn: { 
                  xs: '1',
                  sm: '1',
                  md: '3'  // Column 3
                }
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#2ECC71',
                  mb: 3,
                  fontSize: '1.2rem'
                }}
              >
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {quickLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      display: 'block',
                      py: 0.5,
                      '&:hover': {
                        color: '#2ECC71',
                        transform: 'translateX(-5px)',
                        pl: 1
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </Box>
            </MotionBox>

            <MotionBox variants={fadeInUp} 
               sx={{ 
                textAlign: { xs: 'left', md: 'right' },
                gridColumn: { 
                  xs: '1',
                  sm: '2',
                  md: '4'  // Column 4
                }
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#2ECC71',
                  mb: 3,
                  fontSize: '1.2rem'
                }}
              >
                Get in Touch
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  alignItems: { xs: 'flex-start', md: 'flex-end' }
                }}
              >
                {contactInfo.map((info) => (
                  <Box
                    key={info.text}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      flexDirection: { xs: 'row', md: 'row-reverse' },
                      gap: 2,
                      p: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      textAlign: { xs: 'left', md: 'right' },
                      width: '100%',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        transform: 'translateX(5px)'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        minWidth: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {info.icon}
                    </Box>
                    <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                      <Typography
                        variant="body1"
                        sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', mb: 0.5 }}
                      >
                        {info.text}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}
                      >
                        {info.subtext}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </MotionBox>
          </Box>
        </motion.div>
      </Box>

      <Box
        sx={{
          maxWidth: '1400px',
          mx: 'auto',
          mt: 6,
          pt: 4,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center',
          px: { xs: 2, md: 4 }
        }}
      >
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
          &copy;{new Date().getFullYear()} PetCarePro | All rights reserved.
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          Created by{' '}
          <Link
            href="https://web.facebook.com/akilashehan.induwara/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: '#2ECC71',
              fontWeight: 600,
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Shehan Induwara
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}

export default Footer