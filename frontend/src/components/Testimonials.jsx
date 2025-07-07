import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
  IconButton,
  Grid,
  Chip
} from '@mui/material'
import {
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon,
  FormatQuote as QuoteIcon,
  Verified as VerifiedIcon,
  FiberManualRecord as DotIcon
} from '@mui/icons-material'

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Dog Owner',
      location: 'New York, NY',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b3fd?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      text: "PetCarePro saved my Golden Retriever's life during an emergency. The staff was incredibly professional and caring. Dr. Smith explained everything clearly and kept me informed throughout the entire process. I can't thank them enough!",
      petName: 'Max',
      petType: 'Golden Retriever',
      serviceUsed: 'Emergency Surgery',
      verified: true,
      date: '2024-12-15'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Cat Owner',
      location: 'Los Angeles, CA',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      text: "Outstanding service! The online booking system is so convenient, and the staff always remembers my cat Luna by name. They truly care about each pet individually. The follow-up care and advice have been invaluable.",
      petName: 'Luna',
      petType: 'Persian Cat',
      serviceUsed: 'Regular Checkup',
      verified: true,
      date: '2024-12-10'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Rabbit Owner',
      location: 'Chicago, IL',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      text: "Finding a vet who understands exotic pets was challenging until I found PetCarePro. Dr. Garcia's expertise with rabbits is exceptional. They've helped Snowball through multiple health issues with such care and professionalism.",
      petName: 'Snowball',
      petType: 'Holland Lop Rabbit',
      serviceUsed: 'Exotic Pet Care',
      verified: true,
      date: '2024-12-08'
    },
    {
      id: 4,
      name: 'David Thompson',
      role: 'Dog Owner',
      location: 'Houston, TX',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      text: "The grooming service is fantastic! My German Shepherd always comes back looking and feeling great. The team is gentle, patient, and clearly loves what they do. They even noticed a small health issue during grooming that we hadn't spotted.",
      petName: 'Rex',
      petType: 'German Shepherd',
      serviceUsed: 'Grooming & Health Check',
      verified: true,
      date: '2024-12-05'
    },
    {
      id: 5,
      name: 'Lisa Wang',
      role: 'Multiple Pet Owner',
      location: 'Seattle, WA',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      text: "With three pets, I need a vet clinic I can trust completely. PetCarePro handles all my pets' different needs expertly. From routine vaccinations to complex treatments, they're always professional, compassionate, and thorough.",
      petName: 'Bella, Milo & Whiskers',
      petType: 'Dog, Cat & Ferret',
      serviceUsed: 'Comprehensive Care',
      verified: true,
      date: '2024-11-28'
    },
    {
      id: 6,
      name: 'Robert Martinez',
      role: 'Senior Pet Owner',
      location: 'Miami, FL',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      text: "At 70, I was worried about caring for my aging cat. The team at PetCarePro created a perfect senior care plan. They're patient with my questions and always make sure both Mittens and I are comfortable during visits.",
      petName: 'Mittens',
      petType: 'Senior Cat',
      serviceUsed: 'Senior Pet Care',
      verified: true,
      date: '2024-11-20'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToTestimonial = (index) => {
    setCurrentTestimonial(index)
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

  const slideVariants = {
    enter: { opacity: 0, x: 100, scale: 0.9 },
    center: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -100, scale: 0.9 }
  }

  return (
    <Box 
      sx={{ 
        background: 'linear-gradient(135deg, #EDFCFD 0%, #F8FFFE 100%)',
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgba(46, 204, 113, 0.1), rgba(20, 78, 140, 0.1))',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite'
        }}
      />

      <Box sx={{ width: '80%', mx: 'auto' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          {/* Header */}
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
                What Our <span className="text-gradient">Clients Say</span>
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#144E8C',
                  maxWidth: 600,
                  mx: 'auto',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  opacity: 0.9
                }}
              >
                Real stories from pet owners who trust us with their beloved companions
              </Typography>
            </Box>
          </motion.div>

          {/* Main Testimonial Slider */}
          <motion.div variants={fadeInUp}>
            <Box sx={{ position: 'relative', mb: 6 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <Grid container spacing={6} alignItems="center">
                    {/* Main Testimonial Card */}
                    <Grid item xs={12} lg={8}>
                      <Card
                        sx={{
                          background: 'linear-gradient(145deg, #ffffff 0%, rgba(237, 252, 253, 0.5) 100%)',
                          borderRadius: 4,
                          boxShadow: '0 20px 60px rgba(46, 204, 113, 0.15)',
                          border: '1px solid rgba(46, 204, 113, 0.1)',
                          position: 'relative',
                          overflow: 'visible'
                        }}
                      >
                        {/* Quote Icon */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -20,
                            left: 40,
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #2ECC71, #144E8C)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 10px 30px rgba(46, 204, 113, 0.3)'
                          }}
                        >
                          <QuoteIcon sx={{ color: 'white', fontSize: 28 }} />
                        </Box>

                        <CardContent sx={{ p: { xs: 4, md: 6 }, pt: { xs: 6, md: 8 } }}>
                          {/* Rating */}
                          <Box sx={{ mb: 3 }}>
                            <Rating
                              value={testimonials[currentTestimonial].rating}
                              readOnly
                              size="large"
                              sx={{
                                '& .MuiRating-iconFilled': {
                                  color: '#2ECC71'
                                }
                              }}
                            />
                          </Box>

                          {/* Testimonial Text */}
                          <Typography
                            variant="h6"
                            sx={{
                              color: '#144E8C',
                              fontStyle: 'italic',
                              lineHeight: 1.8,
                              mb: 4,
                              fontSize: { xs: '1.1rem', md: '1.3rem' },
                              fontWeight: 400
                            }}
                          >
                            "{testimonials[currentTestimonial].text}"
                          </Typography>

                          {/* Service Info */}
                          <Box sx={{ mb: 3 }}>
                            <Chip
                              label={testimonials[currentTestimonial].serviceUsed}
                              sx={{
                                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                                color: '#2ECC71',
                                fontWeight: 600,
                                mr: 2
                              }}
                            />
                            <Chip
                              label={`Pet: ${testimonials[currentTestimonial].petName}`}
                              variant="outlined"
                              sx={{
                                borderColor: '#144E8C',
                                color: '#144E8C'
                              }}
                            />
                          </Box>

                          {/* Client Info */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Avatar
                              src={testimonials[currentTestimonial].image}
                              alt={testimonials[currentTestimonial].name}
                              sx={{
                                width: 60,
                                height: 60,
                                border: '3px solid #2ECC71'
                              }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 600,
                                    color: '#28283E',
                                    fontSize: '1.2rem'
                                  }}
                                >
                                  {testimonials[currentTestimonial].name}
                                </Typography>
                                {testimonials[currentTestimonial].verified && (
                                  <VerifiedIcon sx={{ color: '#2ECC71', fontSize: 20 }} />
                                )}
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: '#144E8C',
                                  fontWeight: 500
                                }}
                              >
                                {testimonials[currentTestimonial].role} • {testimonials[currentTestimonial].location}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Pet Type Info */}
                    <Grid item xs={12} lg={4}>
                      <Box
                        sx={{
                          textAlign: 'center',
                          p: 4,
                          backgroundColor: 'white',
                          borderRadius: 3,
                          boxShadow: '0 10px 30px rgba(46, 204, 113, 0.1)',
                          border: '1px solid rgba(46, 204, 113, 0.1)'
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 600,
                            color: '#28283E',
                            mb: 2
                          }}
                        >
                          Pet Information
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            color: '#2ECC71',
                            fontWeight: 600,
                            mb: 1
                          }}
                        >
                          {testimonials[currentTestimonial].petName}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: '#144E8C',
                            mb: 3
                          }}
                        >
                          {testimonials[currentTestimonial].petType}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#144E8C',
                            opacity: 0.7
                          }}
                        >
                          Review Date: {new Date(testimonials[currentTestimonial].date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </motion.div>
              </AnimatePresence>
            </Box>
          </motion.div>

          {/* Navigation Controls */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              mb: 4
            }}
          >
            <IconButton
              onClick={prevTestimonial}
              sx={{
                backgroundColor: 'white',
                color: '#144E8C',
                boxShadow: '0 4px 20px rgba(46, 204, 113, 0.1)',
                '&:hover': {
                  backgroundColor: '#2ECC71',
                  color: 'white',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <ArrowBackIcon />
            </IconButton>

            <Box sx={{ display: 'flex', gap: 1 }}>
              {testimonials.map((_, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IconButton
                    onClick={() => goToTestimonial(index)}
                    sx={{
                      p: 0.5,
                      color: index === currentTestimonial ? '#2ECC71' : '#144E8C',
                      opacity: index === currentTestimonial ? 1 : 0.5,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <DotIcon sx={{ fontSize: index === currentTestimonial ? 16 : 12 }} />
                  </IconButton>
                </motion.div>
              ))}
            </Box>

            <IconButton
              onClick={nextTestimonial}
              sx={{
                backgroundColor: 'white',
                color: '#144E8C',
                boxShadow: '0 4px 20px rgba(46, 204, 113, 0.1)',
                '&:hover': {
                  backgroundColor: '#2ECC71',
                  color: 'white',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <ArrowForwardIcon />
            </IconButton>
          </Box>

          {/* Statistics */}
          <motion.div variants={fadeInUp}>
            <Grid container spacing={4} sx={{ mt: 4 }}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 900,
                      background: 'linear-gradient(135deg, #2ECC71, #144E8C)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      mb: 1
                    }}
                  >
                    10,000+
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: '#144E8C', fontWeight: 600 }}
                  >
                    Happy Pet Owners
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 900,
                      background: 'linear-gradient(135deg, #2ECC71, #144E8C)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      mb: 1
                    }}
                  >
                    4.9★
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: '#144E8C', fontWeight: 600 }}
                  >
                    Average Rating
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 900,
                      background: 'linear-gradient(135deg, #2ECC71, #144E8C)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      mb: 1
                    }}
                  >
                    98%
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: '#144E8C', fontWeight: 600 }}
                  >
                    Recommend Us
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </motion.div>
        </motion.div>
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

export default Testimonials