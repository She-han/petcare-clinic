import React from 'react'
import { motion } from 'framer-motion'
import {
  Typography,
  Box,
  Container
} from '@mui/material'
import {
  LocalHospital as HospitalIcon,
  Schedule as ScheduleIcon,
  ShoppingCart as ShoppingIcon,
  Pets as PetsIcon,
  Favorite as HeartIcon,
  Star as StarIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material'
import clinic from '../assets/clinic.webp'

const Services = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  }

  const fadeInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  }

  const fadeInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  }

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
  }

  const services = [
    {
      icon: <HospitalIcon sx={{ fontSize: 50, color: '#2ECC71' }} />,
      title: '24/7 Emergency Care',
      description: 'Your pet\'s health emergency is our priority. Our dedicated team of experienced veterinarians is available round the clock to provide immediate medical attention. From minor injuries to critical care, we ensure your beloved companion receives the best treatment when they need it most.',
      image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=800&h=600&fit=crop',
      align: 'left',
      color: '#2ECC71'
    },
    {
      icon: <ScheduleIcon sx={{ fontSize: 50, color: '#0074D9' }} />,
      title: 'Smart Appointment Booking',
      description: 'Schedule your pet\'s visit with ease through our intuitive online booking system. Choose your preferred veterinarian, select a convenient time slot, and receive instant confirmation. We send automated reminders so you never miss an appointment, making pet care hassle-free.',
      image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&h=600&fit=crop',
      align: 'right',
      color: '#0074D9'
    },
    {
      icon: <ShoppingIcon sx={{ fontSize: 50, color: '#144E8C' }} />,
      title: 'Premium Pet Products',
      description: 'Discover our curated collection of high-quality pet care essentials. From nutritious food and treats to toys, accessories, and medications, we offer everything your pet needs. All products are carefully selected and recommended by our expert veterinarians for your peace of mind.',
      image: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=800&h=600&fit=crop',
      align: 'left',
      color: '#144E8C'
    },
    {
      icon: <PetsIcon sx={{ fontSize: 50, color: '#2ECC71' }} />,
      title: 'Professional Grooming & Spa',
      description: 'Treat your pet to our luxurious grooming services that go beyond just looking good. Our certified groomers provide gentle care including bathing, haircuts, nail trimming, and specialized spa treatments. Regular grooming maintains your pet\'s health while keeping them comfortable and stylish.',
      image: 'https://images.unsplash.com/photo-1570018144715-43110363d70a?w=800&h=600&fit=crop',
      align: 'right',
      color: '#2ECC71'
    }
  ]

  return (
    <Box sx={{ 
      width: '90%', 
      mx: 'auto',
      overflow: 'hidden',
      borderRadius: 12,
      
      py: { xs: 8, md: 12 }
    }}>
      <Container maxWidth="xl">
        {/* PetCare Shop Information Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Box sx={{ 
            mb: { xs: 12, md: 18 },
            px: { xs: 2, md: 4 }
          }}>
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: { xs: 6, md: 10 },
              background: 'linear-gradient(135deg, rgba(46, 204, 113, 0.08) 0%, rgba(0, 116, 217, 0.08) 100%)',
              borderRadius: 8,
              p: { xs: 4, md: 6 },
              boxShadow: '0 10px 40px rgba(46, 204, 113, 0.15)',
              border: '2px solid rgba(46, 204, 113, 0.2)'
            }}>
              {/* Shop Image */}
              <Box
                sx={{
                  flex: { xs: '1', md: '0 0 45%' },
                  width: '100%',
                  maxWidth: { xs: '100%', md: 500 },
                }}
              >
                <Box
                  component="img"
                  src={clinic}
                  alt="PetCare Clinic & Shop"
                  sx={{
                    width: '100%',
                    height: { xs: 280, md: 600 },
                    objectFit: 'cover',
                    borderRadius: '2px 60px 2px 60px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                  }}
                />
              </Box>

              {/* Shop Information */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: '2rem', md: '3rem' },
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #2ECC71 0%, #0074D9 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2,
                    lineHeight: 1.2
                  }}
                >
                  PetCare Clinic & Shop
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: '#144E8C',
                    fontSize: { xs: '1rem', md: '1.15rem' },
                    lineHeight: 1.9,
                    mb: 3,
                    textAlign: 'left'
                  }}
                >
                  Welcome to PetCare Clinic & Shop, your trusted partner in pet health and wellness since 2014. 
                  Located in the heart of Colombo, we combine state-of-the-art veterinary services with a 
                  comprehensive pet supply store. Our team of certified veterinarians and pet care specialists 
                  is dedicated to providing exceptional care for your beloved companions.
                </Typography>

                {/* Contact Information */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LocationIcon sx={{ color: '#2ECC71', fontSize: 28 }} />
                    <Typography sx={{ color: '#28283E', fontSize: '1rem' }}>
                      123 Pet Street, Colombo 07, Sri Lanka
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <PhoneIcon sx={{ color: '#0074D9', fontSize: 28 }} />
                    <Typography sx={{ color: '#28283E', fontSize: '1rem' }}>
                      +94 11 234 5678 | Emergency: +94 77 123 4567
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <EmailIcon sx={{ color: '#144E8C', fontSize: 28 }} />
                    <Typography sx={{ color: '#28283E', fontSize: '1rem' }}>
                      info@petcareclinic.lk | support@petcareclinic.lk
                    </Typography>
                  </Box>
                </Box>

                {/* Operating Hours */}
                <Box sx={{ 
                  mt: 4, 
                  p: 3, 
                  background: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: 4,
                  border: '2px solid rgba(46, 204, 113, 0.3)'
                }}>
                  <Typography sx={{ 
                    color: '#2ECC71', 
                    fontWeight: 700, 
                    fontSize: '1.1rem',
                    mb: 1 
                  }}>
                    Operating Hours
                  </Typography>
                  <Typography sx={{ color: '#144E8C', fontSize: '0.95rem' }}>
                    Mon - Fri: 8:00 AM - 8:00 PM<br />
                    Sat - Sun: 9:00 AM - 6:00 PM<br />
                    Emergency Services: 24/7
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Hero Introduction */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Box sx={{ 
            textAlign: 'center', 
            mb: { xs: 10, md: 16 },
            px: { xs: 2, md: 4 }
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <HeartIcon sx={{ 
                fontSize: { xs: 50, md: 70 }, 
                color: '#2ECC71',
                mb: 3,
                filter: 'drop-shadow(0 4px 8px rgba(46, 204, 113, 0.3))'
              }} />
            </motion.div>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.2rem', md: '3.5rem', lg: '4rem' },
                fontWeight: 800,
                background: 'linear-gradient(135deg, #2ECC71 0%, #0074D9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3,
                lineHeight: 1.2
              }}
            >
              Our Services
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: '#144E8C',
                maxWidth: 800,
                mx: 'auto',
                fontSize: { xs: '1.1rem', md: '1.4rem' },
                lineHeight: 1.8,
                fontWeight: 400,
                mb: 2
              }}
            >
              Where Every Paw Matters, Every Tail Wags with Joy
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: '#28283E',
                maxWidth: 900,
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.9,
                opacity: 0.85
              }}
            >
              We understand that your pets are family. For over a decade, 
              we've been providing comprehensive veterinary care with compassion, expertise, 
              and cutting-edge medical technology. Our mission is to ensure your furry companions 
              live their happiest, healthiest lives.
            </Typography>
          </Box>
        </motion.div>

        {/* Services Flow */}
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={service.align === 'left' ? fadeInLeft : fadeInRight}
          >
            <Box sx={{ 
              mb: { xs: 12, md: 20 },
              position: 'relative'
            }}>
              <Box sx={{
                display: 'flex',
                flexDirection: { 
                  xs: 'column', 
                  md: service.align === 'left' ? 'row' : 'row-reverse' 
                },
                alignItems: 'center',
                gap: { xs: 6, md: 10, lg: 14 },
                px: { xs: 2, md: 4 }
              }}>
                {/* Image Section with Curved Frame */}
                <Box sx={{ flex: 1, position: 'relative' }}>
                  {/* Decorative floating icon - positioned outside the frame */}
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{
                      position: 'absolute',
                      top: 350,
                      left: '60%',
                      transform: 'translateX(-50%)',
                      zIndex: 100
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 80, md: 100 },
                        height: { xs: 80, md: 100 },
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fffe 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 15px 40px ${service.color}50`,
                        border: '5px solid white'
                      }}
                    >
                      {service.icon}
                    </Box>
                  </motion.div>

                  <Box
                    sx={{
                      position: 'relative',
                      borderRadius: service.align === 'left' ? '48% 52% 68% 32% / 42% 78% 22% 58%' : '100% 100% 100% 100% / 72% 24% 76% 28%',
                      overflow: 'hidden',
                      boxShadow: `0 20px 60px ${service.color}30`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      maxWidth: { xs: '100%', md: 500 },
                      mx: 'auto',
                      willChange: 'transform, box-shadow',
                      '&:hover': {
                        transform: `scale(1.03) rotate(${service.align === 'left' ? '1deg' : '-1deg'})`,
                        boxShadow: `0 30px 80px ${service.color}40`,
                      }
                    }}
                  >
                    <Box
                      component="img"
                      src={service.image}
                      alt={service.title}
                      sx={{
                        width: '100%',
                        height: { xs: 300, md: 400 },
                        objectFit: 'cover',
                        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        willChange: 'transform',
                        '&:hover': {
                          transform: 'scale(1.08)'
                        }
                      }}
                    />
                  </Box>
                </Box>

                {/* Content Section */}
                <Box sx={{ flex: 1 }}>
                  <motion.div
                    variants={scaleIn}
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      mb: 3
                    }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 4,
                          backgroundColor: service.color,
                          borderRadius: 2,
                          transition: 'width 0.4s ease'
                        }}
                      />
                      <StarIcon sx={{ color: service.color, fontSize: 24 }} />
                    </Box>
                  </motion.div>

                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: { xs: '1.8rem', md: '2.5rem', lg: '3rem' },
                      fontWeight: 700,
                      color: '#28283E',
                      mb: 3,
                      lineHeight: 1.3
                    }}
                  >
                    {service.title}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: '#144E8C',
                      fontSize: { xs: '1rem', md: '1.15rem' },
                      lineHeight: 2,
                      mb: 4,
                      textAlign: 'justify'
                    }}
                  >
                    {service.description}
                  </Typography>

                  {/* Decorative elements */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {['Expert Care', 'Modern Facility', 'Trusted by Thousands'].map((badge, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          px: 3,
                          py: 1.5,
                          borderRadius: 25,
                          background: `linear-gradient(135deg, ${service.color}15 0%, ${service.color}05 100%)`,
                          border: `2px solid ${service.color}30`,
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: service.color,
                          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                          willChange: 'transform, background, border-color',
                          cursor: 'default'
                         
                        }}
                      >
                        {badge}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* Decorative Background Element */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: service.align === 'left' ? -100 : 'auto',
                  right: service.align === 'right' ? -100 : 'auto',
                  width: 300,
                  height: 300,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${service.color}10 0%, transparent 70%)`,
                  zIndex: -1,
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}
              />
            </Box>
          </motion.div>
        ))}

      
      </Container>
    </Box>
  )
}

export default Services