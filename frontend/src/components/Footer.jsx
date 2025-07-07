import React from 'react'
import { motion } from 'framer-motion'
import {
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
  Link
} from '@mui/material'
import {
  Pets as PetsIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Schedule as ScheduleIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material'

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

  const badges = [
    { icon: <SecurityIcon />, text: 'Licensed & Certified' },
    { icon: <SupportIcon />, text: '24/7 Support' },
    { icon: <VerifiedIcon />, text: 'Trusted by 10,000+ Pet Owners' }
  ]

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
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
    <Box sx={{ py: 8, backgroundColor:"#28283E", justifyContent: 'space-between',
             }}>
      <Box sx={{ width: '100%', mx: 'auto', px: { xs: 2, md: 4 } }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <Grid container spacing={6}   >
            
            {/* Column 1: Company Info & Social */}
            <Grid item xs={12} sm={6} lg={3}>
              <motion.div variants={fadeInUp}>
                {/* Brand */}
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
                    Professional veterinary care with modern technology 
                    and compassionate service. 
                    
                  </Typography>

                  {/* Social Links */}
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
                      {socialLinks.map((social, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
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
              </motion.div>
            </Grid>

            {/* Column 2: Quick Links */}
            <Grid item xs={12} sm={6} lg={2}>
              <motion.div variants={fadeInUp}>
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
                  {quickLinks.map((link, index) => (
                    <Link
                      key={index}
                      href={link.href}
                      sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        textDecoration: 'none',
                        fontSize: '0.95rem',
                        display: 'block',
                        py: 0.5,
                        '&:hover': {
                          color: '#2ECC71',
                          transform: 'translateX(5px)',
                          paddingLeft: 1
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {link.name}
                    </Link>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* Column 3: Our Services */}
            <Grid item xs={12} sm={6} lg={2}>
              <motion.div variants={fadeInUp}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#2ECC71',
                    mb: 3,
                    fontSize: '1.2rem'
                  }}
                >
                  Our Services
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {services.map((service, index) => (
                    <Link
                      key={index}
                      href={service.href}
                      sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        textDecoration: 'none',
                        fontSize: '0.95rem',
                        display: 'block',
                        py: 0.5,
                        '&:hover': {
                          color: '#2ECC71',
                          transform: 'translateX(5px)',
                          paddingLeft: 1
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {service.name}
                    </Link>
                  ))}
                </Box>
              </motion.div>
            </Grid>

  

            {/* Column 5: Contact Info */}
            <Grid item xs={12} lg={3}>
              <motion.div variants={fadeInUp}>
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
                
                {/* Contact Information */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
                  {contactInfo.map((info, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        p: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          transform: 'translateX(5px)'
                        },
                        transition: 'all 0.3s ease'
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
                      <Box>
                        <Typography
                          variant="body1"
                          sx={{
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            mb: 0.5
                          }}
                        >
                          {info.text}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.8rem'
                          }}
                        >
                          {info.subtext}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

              
              </motion.div>
            </Grid>

          </Grid>
        </motion.div>
      </Box>
    </Box>
  )
}

export default Footer