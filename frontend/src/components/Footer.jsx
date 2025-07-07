import React from 'react'
import { motion } from 'framer-motion'
import {
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
  Divider,
  Link,
  TextField,
  InputAdornment
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
  Send as SendIcon,
  Schedule as ScheduleIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material'

const Footer = () => {
  const currentYear = new Date().getFullYear()

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

  const legalLinks = [
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' },
    { name: 'Cookie Policy', href: '#cookies' },
    { name: 'Refund Policy', href: '#refund' }
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
    <Box
      component="footer"
      sx={{
        backgroundColor: '#28283E',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Main Footer Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Newsletter Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #2ECC71 0%, #144E8C 100%)',
            py: 6
          }}
        >
          <Box sx={{ width: '90%', mx: 'auto' }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={8}>
                  <motion.div variants={fadeInUp}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: 'white',
                        mb: 2,
                        fontSize: { xs: '1.5rem', md: '2rem' }
                      }}
                    >
                      Stay Updated with Pet Care Tips
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: { xs: '0.9rem', md: '1.1rem' }
                      }}
                    >
                      Get the latest pet health tips, special offers, and updates delivered to your inbox
                    </Typography>
                  </motion.div>
                </Grid>
                <Grid item xs={12} md={4}>
                  <motion.div variants={fadeInUp}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        fullWidth
                        placeholder="Enter your email"
                        variant="outlined"
                        size="medium"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                            borderRadius: 2,
                            '& fieldset': {
                              borderColor: 'transparent'
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.3)'
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'white'
                            }
                          }
                        }}
                      />
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: '#144E8C',
                          color: 'white',
                          px: 3,
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: '#28283E'
                          }
                        }}
                      >
                        <SendIcon />
                      </Button>
                    </Box>
                  </motion.div>
                </Grid>
              </Grid>
            </motion.div>
          </Box>
        </Box>

        {/* Main Footer Links */}
        <Box sx={{ py: 8 }}>
          <Box sx={{ width: '90%', mx: 'auto' }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <Grid container spacing={6}>
                {/* Company Info */}
                <Grid item xs={12} lg={4}>
                  <motion.div variants={fadeInUp}>
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
                        Professional veterinary care with modern technology and compassionate service. 
                        Your pet's health and happiness is our top priority. We've been serving the 
                        community for over 8 years with dedication and expertise.
                      </Typography>

                      {/* Badges */}
                      <Box sx={{ mb: 4 }}>
                        {badges.map((badge, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                              mb: 2,
                              p: 2,
                              backgroundColor: 'rgba(46, 204, 113, 0.1)',
                              borderRadius: 2,
                              border: '1px solid rgba(46, 204, 113, 0.2)'
                            }}
                          >
                            {React.cloneElement(badge.icon, { 
                              sx: { fontSize: 18, color: '#2ECC71' } 
                            })}
                            <Typography
                              variant="body2"
                              sx={{ 
                                color: '#2ECC71', 
                                fontWeight: 600,
                                fontSize: '0.85rem'
                              }}
                            >
                              {badge.text}
                            </Typography>
                          </Box>
                        ))}
                      </Box>

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
                        <Box sx={{ display: 'flex', gap: 1 }}>
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

                {/* Quick Links */}
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
                            '&:hover': {
                              color: '#2ECC71',
                              transform: 'translateX(5px)'
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

                {/* Services */}
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
                            '&:hover': {
                              color: '#2ECC71',
                              transform: 'translateX(5px)'
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

                {/* Contact Info */}
                <Grid item xs={12} lg={4}>
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
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {contactInfo.map((info, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 2
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
                                fontSize: '0.95rem',
                                mb: 0.5
                              }}
                            >
                              {info.text}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontSize: '0.85rem'
                              }}
                            >
                              {info.subtext}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>

                    {/* Emergency Button */}
                    <Box sx={{ mt: 4 }}>
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<ScheduleIcon />}
                        sx={{
                          backgroundColor: '#2ECC71',
                          color: 'white',
                          px: 4,
                          py: 2,
                          borderRadius: 3,
                          fontWeight: 600,
                          fontSize: '1rem',
                          '&:hover': {
                            backgroundColor: '#144E8C',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(46, 204, 113, 0.3)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Book Emergency Appointment
                      </Button>
                    </Box>
                  </motion.div>
                </Grid>
              </Grid>
            </motion.div>
          </Box>
        </Box>

        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Bottom Footer */}
        <Box sx={{ py: 4 }}>
          <Box sx={{ width: '80%', mx: 'auto' }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '0.9rem',
                      textAlign: { xs: 'center', md: 'left' }
                    }}
                  >
                    © {currentYear} PetCarePro. All rights reserved. Made with ❤️ for pets and their families.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      gap: 3, 
                      justifyContent: { xs: 'center', md: 'flex-end' },
                      flexWrap: 'wrap'
                    }}
                  >
                    {legalLinks.map((link, index) => (
                      <Link
                        key={index}
                        href={link.href}
                        sx={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          textDecoration: 'none',
                          fontSize: '0.85rem',
                          '&:hover': {
                            color: '#2ECC71'
                          },
                          transition: 'color 0.3s ease'
                        }}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </motion.div>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Footer