import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
  Grid,
  Chip,
  CircularProgress
} from '@mui/material'
import {
  FormatQuote as QuoteIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material'
import apiService from '../services/api'

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [offset, setOffset] = useState(0)
  const [error, setError] = useState(null)
  const scrollRef = useRef(null)

  // Fetch testimonials from database
  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Use apiService like Products.jsx does
      const response = await apiService.testimonials.getApproved()
      console.log('Testimonials response:', response)
      
      const data = response.data || []
      
      if (data.length > 0) {
        const mappedTestimonials = data.map(t => ({
          id: t.id,
          name: t.customerName,
          image: t.customerImageUrl || 'https://images.unsplash.com/photo-1494790108755-2616b612b3fd?w=150&h=150&fit=crop&crop=face',
          rating: t.rating,
          text: t.content,
          petName: t.petName || 'Pet',
          petType: t.petType || 'Animal',
          serviceUsed: t.serviceType || 'Veterinary Service',
          verified: t.isApproved,
          date: t.createdAt
        }))
        
        console.log('Mapped testimonials:', mappedTestimonials)
        
        // Duplicate testimonials for infinite scroll effect
        const duplicated = [...mappedTestimonials, ...mappedTestimonials, ...mappedTestimonials]
        setTestimonials(duplicated)
      } else {
        console.log('No testimonials found')
        setTestimonials([])
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      setError('Failed to load testimonials')
      setTestimonials([])
    } finally {
      setLoading(false)
    }
  }

  // Auto-scroll effect (slow continuous scroll)
  useEffect(() => {
    if (!isPaused && testimonials.length > 0) {
      const interval = setInterval(() => {
        setOffset((prev) => {
          const newOffset = prev - 1
          // Reset to beginning when scrolled through one set
          if (Math.abs(newOffset) >= (testimonials.length / 3) * 350) {
            return 0
          }
          return newOffset
        })
      }, 30) // Smooth 30ms intervals for slow scroll

      return () => clearInterval(interval)
    }
  }, [isPaused, testimonials.length])

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
    <Box 
      sx={{ 
        
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden'
      }}
    >


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

          {/* Infinite Testimonial Slider */}
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#2ECC71', mb: 2 }} size={60} />
              <Typography variant="body1" color="#144E8C">
                Loading testimonials...
              </Typography>
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="error" mb={2}>
                {error}
              </Typography>
              <button 
                onClick={fetchTestimonials}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#2ECC71',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 600
                }}
              >
                Retry
              </button>
            </Box>
          ) : testimonials.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="#144E8C" mb={2}>
                No testimonials yet. Be the first to share your experience!
              </Typography>
              <Typography variant="body2" color="#666">
                After your appointment, you can rate your experience and it will appear here.
              </Typography>
            </Box>
          ) : (
            <motion.div variants={fadeInUp}>
              <Box 
                sx={{ 
                  position: 'relative', 
                  overflow: 'hidden',
                  mb: 6,
                  py: 2
                }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <Box
                  ref={scrollRef}
                  sx={{
                    display: 'flex',
                    gap: 3,
                    transform: `translateX(${offset}px)`,
                    transition: isPaused ? 'none' : 'transform 0.03s linear',
                    willChange: 'transform'
                  }}
                >
                  {testimonials.map((testimonial, index) => (
                    <Card
                      key={`${testimonial.id}-${index}`}
                      sx={{
                        minWidth: 350,
                        maxWidth: 350,
                        background: 'white',
                        borderRadius: 4,
                        boxShadow: '0 20px 60px rgba(46, 204, 113, 0.15)',
                        border: '1px solid rgba(46, 204, 113, 0.8)',
                        position: 'relative',
                        overflow: 'visible',
                        flexShrink: 0,
                        '&:hover': {
                          
                          boxShadow: '0 25px 70px rgba(46, 204, 113, 0.45)',
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {/* Quote Icon */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -15,
                          left: 20,
                          width: 45,
                          height: 45,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #2ECC71, #144E8C)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 8px 20px rgba(46, 204, 113, 0.3)'
                        }}
                      >
                        <QuoteIcon sx={{ color: 'white', fontSize: 22 }} />
                      </Box>

                      <CardContent sx={{ p: 3, pt: 5 }}>
                        {/* Rating */}
                        <Box sx={{ mb: 2 }}>
                          <Rating
                            value={testimonial.rating}
                            readOnly
                            size="small"
                            sx={{
                              '& .MuiRating-iconFilled': {
                                color: '#2ECC71'
                              }
                            }}
                          />
                        </Box>

                        {/* Testimonial Text */}
                        <Typography
                          variant="body1"
                          sx={{
                            color: '#144E8C',
                            fontStyle: 'italic',
                            lineHeight: 1.6,
                            mb: 2,
                            fontSize: '0.95rem',
                            fontWeight: 400,
                            minHeight: 120,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 5,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          "{testimonial.text}"
                        </Typography>

                        {/* Service Info */}
                        <Box sx={{ mb: 2 }}>
                          <Chip
                            label={testimonial.serviceUsed}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(46, 204, 113, 0.1)',
                              color: '#2ECC71',
                              fontWeight: 600,
                              fontSize: '0.7rem',
                              mb: 1
                            }}
                          />
                          <Chip
                            label={`${testimonial.petName} • ${testimonial.petType}`}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: '#144E8C',
                              color: '#144E8C',
                              fontSize: '0.7rem',
                              ml: 1
                            }}
                          />
                        </Box>

                        {/* Client Info */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pt: 2, borderTop: '1px solid rgba(46, 204, 113, 0.1)' }}>
                          <Avatar
                            src={testimonial.image}
                            alt={testimonial.name}
                            sx={{
                              width: 45,
                              height: 45,
                              border: '2px solid #2ECC71'
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: 600,
                                  color: '#28283E',
                                  fontSize: '0.95rem'
                                }}
                              >
                                {testimonial.name}
                              </Typography>
                              {testimonial.verified && (
                                <VerifiedIcon sx={{ color: '#2ECC71', fontSize: 16 }} />
                              )}
                            </Box>
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#144E8C',
                                fontSize: '0.75rem'
                              }}
                            >
                              {new Date(testimonial.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>

                {/* Gradient Overlays for fade effect */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 100,
                    background: 'linear-gradient(to right, #EDFCFD, transparent)',
                    pointerEvents: 'none',
                    zIndex: 1
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: 100,
                    background: 'linear-gradient(to left, #EDFCFD, transparent)',
                    pointerEvents: 'none',
                    zIndex: 1
                  }}
                />
              </Box>
            </motion.div>
          )}

     
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