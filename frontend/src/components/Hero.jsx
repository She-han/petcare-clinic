import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  Typography,
  Button,
  Grid,
  Box,
  IconButton
} from '@mui/material'
import {
  Schedule as ScheduleIcon,
  ShoppingCart as ShoppingIcon,
  Favorite as HeartIcon,
  Star as StarIcon,
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon,
  FiberManualRecord as DotIcon
} from '@mui/icons-material'

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  const slides = [
    {
      id: 1,
      title: "Pet's Health is ",
      highlight: "Our Priority",
      subtitle: "Compassionate Care, Advanced Tech",
      description: "Professional veterinary care with modern technology and compassionate service. We treat your pets like family because they are family.",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop",
      stats: [
        { number: '10,000+', label: 'Happy Pets' },
       
        { number: '24/7', label: 'Emergency Care' },
        { number: '5★', label: 'Rating' }
      ],
      gradient: 'linear-gradient(135deg, #EDFCFD 0%, #ffffff 100%)',
      primaryColor: '#2ECC71',
      secondaryColor: '#144E8C'
    },
    {
      id: 2,
      title: "Every Moment",
      highlight: "Matters",
      subtitle: "Emergency Care When You Need It Most",
      description: "Life doesn't wait, and neither do we. Our 24/7 emergency services ensure your beloved companions get immediate, expert care whenever they need it.",
      image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&h=600&fit=crop",
      stats: [
        { number: '24/7', label: 'Available' },
      
        { number: '98%', label: 'Success Rate' },
        { number: '1000+', label: 'Lives Saved' }
      ],
      gradient: 'linear-gradient(135deg, #E8F5E8 0%, #F0F8FF 100%)',
      primaryColor: '#0074D9',
      secondaryColor: '#2ECC71'
    },
    {
      id: 3,
      title: "Wellness Starts",
      highlight: "Here",
      subtitle: "Preventive Care for Lifelong Health",
      description: "Prevention is the best medicine. Our comprehensive wellness programs keep your pets healthy, happy, and by your side for years to come.",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=600&fit=crop",
      stats: [
        { number: '95%', label: 'Prevention Success' },
        
        { number: '500+', label: 'Checkups' },
        { number: '100%', label: 'Satisfaction' }
      ],
      gradient: 'linear-gradient(135deg, #FFF8DC 0%, #F0FFFF 100%)',
      primaryColor: '#144E8C',
      secondaryColor: '#0074D9'
    },
    {
      id: 4,
      title: "Love Has",
      highlight: "No Limits",
      subtitle: "Specialized Care for Every Species",
      description: "From tiny hamsters to gentle giants, every pet deserves specialized care. Our expert team has the knowledge and passion to care for all your beloved companions.",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop",
      stats: [
        { number: '50+', label: 'Species Treated' },
      
        { number: '15', label: 'Expert Vets' },
        { number: '8', label: 'Years Experience' }
      ],
      gradient: 'linear-gradient(135deg, #F0F8FF 0%, #E6F3FF 100%)',
      primaryColor: '#2ECC71',
      secondaryColor: '#144E8C'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [slides.length])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  const goToSlide = (index) => setCurrentSlide(index)

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.6 },
        scale: { duration: 0.6 }
      }
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 }
      }
    })
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mt: 0
      }}
    >

      {/* Slide Container - 90% width with proper Grid layout */}
      <Box sx={{ width: '98%', position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait" custom={currentSlide}>
          <motion.div
            key={currentSlide}
            custom={currentSlide}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            
            style={{
              width: '100%',
              background: slides[currentSlide].gradient,
              borderRadius: '24px',
              padding: '0',
              minHeight: '80vh'
            }}
          >
            <Grid 
              container 
              spacing={{ xs: 4, sm: 6, md: 8, lg: 12, xl: 16 }} 
              alignItems="stretch" 
              sx={{ 
                p: { xs: 3, sm: 4, md: 5, lg: 2, xl: 6 },
                minHeight: '80vh'
              }}
            >
              {/* Text Content - Left Side */}
              <Grid 
                item 
                xs={12}
                sm={12}
                md={6}
                lg={6}
                xl={6}
                sx={{ 
                  order: { xs: 2, sm: 2, md: 1, lg: 1, xl: 1 },
                  marginLeft:{
                    xl: '60px',  // No margin for xl screens
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Box sx={{ mb: { xs: 3, lg: 2, xl: 3 } }}>
                    <Typography
                      variant="overline"
                      sx={{
                        color: slides[currentSlide].secondaryColor,
                        fontWeight: 700,
                        fontSize: { 
                          xs: '0.8rem', 
                          sm: '0.9rem', 
                          md: '1rem',
                          lg: '0.75rem',
                          xl: '1rem' 
                        },
                        letterSpacing: 2,
                        mb: 1,
                        display: 'block'
                      }}
                    >
                      {slides[currentSlide].subtitle}
                    </Typography>
                  </Box>

                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <Typography
                      variant="h1"
                      sx={{
                        fontSize: { 
                          xs: '2rem', 
                          sm: '2.5rem', 
                          md: '2.2rem', 
                          lg: '2.0rem',  // Reduced for 1024px screens
                          xl: '3.5rem' 
                        },
                        fontWeight: 900,
                        color: '#28283E',
                        mb: { xs: 2, lg: 1.5, xl: 2 },
                        lineHeight: 1.1
                      }}
                    >
                      {slides[currentSlide].title}
                      <Box
                        component="span"
                        sx={{
                          background: `linear-gradient(135deg, ${slides[currentSlide].primaryColor}, ${slides[currentSlide].secondaryColor})`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          display: 'block',
                          transform: { xs: 'none', md: 'translateX(20px)', lg: 'translateX(10px)', xl: 'translateX(20px)' }
                        }}
                      >
                        {slides[currentSlide].highlight}
                      </Box>
                    </Typography>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      gap: { xs: 2, md: 3, lg: 1, xl: 3 }, 
                      mb: { xs: 5, lg: 3, xl: 5 }, 
                      flexWrap: 'wrap' 
                    }}>
                      <Button
  variant="contained"
  size="large"
  startIcon={<ScheduleIcon />}
  sx={{
    backgroundColor: slides[currentSlide].primaryColor,
    color: 'white',
    px: { xs: 3, md: 4, lg: 2, xl: 4 },        // Fixed: was 0, now 2
    py: { xs: 1.5, md: 2, lg: 1, xl: 2 },      // Reduced: was 1.2, now 1
    borderRadius: 4,
    fontWeight: 700,
    fontSize: { 
      xs: '0.9rem', 
      md: '1.1rem',
      lg: '0.8rem',  // Reduced for lg screens
      xl: '1.1rem' 
    },
    textTransform: 'none',
    boxShadow: `0 8px 32px ${slides[currentSlide].primaryColor}40`,
    '&:hover': {
      backgroundColor: slides[currentSlide].secondaryColor,
      transform: 'translateY(-4px)',
      boxShadow: `0 12px 40px ${slides[currentSlide].primaryColor}60`
    },
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
  }}
>
  Book Appointment
</Button>

<Button
  variant="outlined"
  size="large"
  startIcon={<ShoppingIcon />}
  sx={{
    width: { xs: '100%', 
      md: '150px',
      lg: '150px',
      xl: '150px'},
    color: slides[currentSlide].secondaryColor,
    borderColor: slides[currentSlide].secondaryColor,
    borderWidth: 2,
    px: { xs: 3, md: 4, lg: 2, xl: 4 },        // Reduced: was 2.5, now 2
    py: { xs: 1.5, md: 2, lg: 1, xl: 2 },      // Reduced: was 1.2, now 1
    borderRadius: 4,
    fontWeight: 700,
    fontSize: { 
      xs: '0.9rem', 
      md: '1.1rem',
      lg: '0.8rem',  // Reduced for lg screens
      xl: '1.1rem' 
    },
    textTransform: 'none',
    '&:hover': {
      backgroundColor: slides[currentSlide].secondaryColor,
      color: 'white',
      transform: 'translateY(-4px)',
      boxShadow: `0 12px 40px ${slides[currentSlide].secondaryColor}40`
    },
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
  }}
>
  Shop
</Button>
                    </Box>
                  </motion.div>

                  {/* Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                  >
                    <Grid container spacing={{ xs: 2, lg: 1.5, xl: 2 }}>
                      {slides[currentSlide].stats.map((stat, index) => (
                        <Grid item xs={6} sm={3} key={index}>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ 
                              duration: 0.6, 
                              delay: 1.2 + index * 0.1,
                              type: "spring",
                              stiffness: 200
                            }}
                          >
                            <Box
                              sx={{
                                textAlign: 'center',
                                p: { xs: 1.5, md: 2, lg: 1, xl: 2 },
                                borderRadius: 3,
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(10px)',
                                border: `1px solid ${slides[currentSlide].primaryColor}20`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-5px)',
                                  boxShadow: `0 10px 30px ${slides[currentSlide].primaryColor}30`
                                }
                              }}
                            >
                              <Typography
                                variant="h3"
                                sx={{
                                  fontWeight: 900,
                                  background: `linear-gradient(135deg, ${slides[currentSlide].primaryColor}, ${slides[currentSlide].secondaryColor})`,
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                  backgroundClip: 'text',
                                  fontSize: { 
                                    xs: '1.3rem', 
                                    sm: '1.6rem', 
                                    md: '2rem',
                                    lg: '1.4rem',  // Reduced for 1024px screens
                                    xl: '2rem' 
                                  },
                                  mb: 0.5
                                }}
                              >
                                {stat.number}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: slides[currentSlide].secondaryColor,
                                  fontWeight: 600,
                                  fontSize: { 
                                    xs: '0.7rem', 
                                    md: '0.85rem',
                                    lg: '0.75rem',  // Reduced for 1024px screens
                                    xl: '0.85rem' 
                                  },
                                  opacity: 0.8
                                }}
                              >
                                {stat.label}
                              </Typography>
                            </Box>
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>
                  </motion.div>
                </motion.div>
              </Grid>

              {/* Image Content - Right Side */}
              <Grid 
                item 
                xs={12} 
                sm={12}
                md={6}
                lg={6}
                xl={6}
                sx={{ 
                  order: { xs: 1, sm: 1, md: 2, lg: 2, xl: 2 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      marginLeft: {
                        xl: '140px',  // Added margin for xl screens
                      },
                      height: { 
                        xs: '300px', 
                        sm: '400px', 
                        md: '500px', 
                        lg: '400px',  // Reduced height for 1024px screens
                        xl: '500px' 
                      }
                    }}
                  >
                    <motion.div
                      animate={{
                        y: [0, -15, 0],
                        rotateY: [0, 5, 0]
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{
                        perspective: '1000px'
                      }}
                    >
                      <Box
                        component="img"
                        src={slides[currentSlide].image}
                        alt={slides[currentSlide].title}
                        sx={{
                          width: '100%',
                          maxWidth: { 
                            xs: 280, 
                            sm: 350, 
                            md: 400, 
                            lg: 350,  // Reduced width for 1024px screens
                            xl: 500 
                          },
                          height: 'auto',
                          borderRadius: 6,
                          boxShadow: `0 30px 80px ${slides[currentSlide].primaryColor}30`,
                          border: `4px solid rgba(255, 255, 255, 0.8)`,
                          transform: 'perspective(1000px) rotateY(-5deg)',
                          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      />
                    </motion.div>

                    {/* Floating Elements - Adjusted sizes for 1024px screens */}
                    <motion.div
                      animate={{
                        y: [0, -20, 0],
                        rotate: [0, 8, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{
                        position: 'absolute',
                        top: '15%',
                        right: '5%'
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: 'white',
                          borderRadius: 4,
                          p: { xs: 1.5, sm: 2, md: 2.5, lg: 1.5, xl: 2.5 },
                          boxShadow: `0 15px 40px ${slides[currentSlide].primaryColor}40`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: { xs: 1, md: 1.5, lg: 1, xl: 1.5 },
                          border: `2px solid ${slides[currentSlide].primaryColor}20`,
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <HeartIcon sx={{ 
                          color: slides[currentSlide].primaryColor, 
                          fontSize: { xs: 18, sm: 22, md: 28, lg: 20, xl: 28 } 
                        }} />
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: '#28283E', 
                            fontWeight: 700,
                            fontSize: { 
                              xs: '0.7rem', 
                              sm: '0.9rem', 
                              md: '1rem',
                              lg: '0.8rem',  // Reduced for 1024px screens
                              xl: '1rem' 
                            }
                          }}
                        >
                          24/7 Care
                        </Typography>
                      </Box>
                    </motion.div>

                    <motion.div
                      animate={{
                        y: [0, 15, 0],
                        rotate: [0, -6, 0],
                        scale: [1, 1.08, 1]
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1.5
                      }}
                      style={{
                        position: 'absolute',
                        bottom: '20%',
                        left: '8%'
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: 'white',
                          borderRadius: 4,
                          p: { xs: 1.5, sm: 2, md: 2.5, lg: 1.5, xl: 2.5 },
                          boxShadow: `0 15px 40px ${slides[currentSlide].secondaryColor}40`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: { xs: 1, md: 1.5, lg: 1, xl: 1.5 },
                          border: `2px solid ${slides[currentSlide].secondaryColor}20`,
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <StarIcon sx={{ 
                          color: slides[currentSlide].secondaryColor, 
                          fontSize: { xs: 18, sm: 22, md: 28, lg: 20, xl: 28 } 
                        }} />
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: '#28283E', 
                            fontWeight: 700,
                            fontSize: { 
                              xs: '0.7rem', 
                              sm: '0.9rem', 
                              md: '1rem',
                              lg: '0.8rem',  // Reduced for 1024px screens
                              xl: '1rem' 
                            }
                          }}
                        >
                          5★ Rated
                        </Typography>
                      </Box>
                    </motion.div>
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* Navigation Controls */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 2, md: 3 },
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: 6,
          p: { xs: 1.5, md: 2 },
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}
      >
        <IconButton
          onClick={prevSlide}
          sx={{
            backgroundColor: 'transparent',
            color: '#28283E',
            p: { xs: 0.5, md: 1 },
            '&:hover': {
              backgroundColor: slides[currentSlide].primaryColor,
              color: 'white',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          <ArrowBackIcon sx={{ fontSize: { xs: 18, md: 24 } }} />
        </IconButton>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {slides.map((_, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <IconButton
                onClick={() => goToSlide(index)}
                sx={{
                  p: { xs: 0.3, md: 0.5 },
                  minWidth: 'auto',
                  color: index === currentSlide ? slides[currentSlide].primaryColor : '#28283E',
                  opacity: index === currentSlide ? 1 : 0.5,
                  transition: 'all 0.3s ease'
                }}
              >
                <DotIcon sx={{ fontSize: index === currentSlide ? { xs: 14, md: 16 } : { xs: 10, md: 12 } }} />
              </IconButton>
            </motion.div>
          ))}
        </Box>

        <IconButton
          onClick={nextSlide}
          sx={{
            backgroundColor: 'transparent',
            color: '#28283E',
            p: { xs: 0.5, md: 1 },
            '&:hover': {
              backgroundColor: slides[currentSlide].primaryColor,
              color: 'white',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          <ArrowForwardIcon sx={{ fontSize: { xs: 18, md: 24 } }} />
        </IconButton>
      </Box>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(1deg);
          }
          66% {
            transform: translateY(-5px) rotate(-1deg);
          }
        }
      `}</style>
    </Box>
  )
}

export default Hero