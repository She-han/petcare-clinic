import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
  Chip,
  CircularProgress,
  IconButton
} from '@mui/material'
import {
  FormatQuote as QuoteIcon,
  Verified as VerifiedIcon,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material'
import apiService from '../services/api'

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const autoPlayRef = useRef(null)

  // Fetch testimonials from database
  useEffect(() => {
    fetchTestimonials()
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [])

  const fetchTestimonials = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiService.testimonials.getApproved()
      const data = response.data || []
      
      if (data.length > 0) {
        const mappedTestimonials = data.map(t => ({
          id: t.id,
          name: t.customerName,
          image: t.customerImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.customerName)}&background=2ECC71&color=fff&size=128`,
          rating: t.rating,
          text: t.content,
          petName: t.petName || 'Pet',
          petType: t.petType || 'Animal',
          serviceUsed: t.serviceType || 'Veterinary Service',
          verified: t.isApproved,
          date: t.createdAt
        }))
        
        setTestimonials(mappedTestimonials)
      } else {
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

  // Auto-play carousel
  useEffect(() => {
    if (!isPaused && testimonials.length > 0) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
      }, 5000) // Change slide every 5 seconds

      return () => {
        if (autoPlayRef.current) clearInterval(autoPlayRef.current)
      }
    }
  }, [isPaused, testimonials.length])

  // Get all testimonials for sliding
  const extendedTestimonials = useMemo(() => {
    if (testimonials.length === 0) return []
    // Create extended array for seamless infinite scroll
    return [...testimonials, ...testimonials, ...testimonials]
  }, [testimonials])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const handleDragEnd = (event, info) => {
    const threshold = 50
    if (info.offset.x > threshold) {
      handlePrev()
    } else if (info.offset.x < -threshold) {
      handleNext()
    }
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
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F0FFFE 100%)',
        py: { xs: 6, md: 10 },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          right: '-10%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(46, 204, 113, 0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '-5%',
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20, 78, 140, 0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                fontWeight: 700,
                color: '#1A1A2E',
                mb: 1.5,
                background: 'linear-gradient(135deg, #2ECC71 0%, #144E8C 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              What Our Clients Say
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#64748B',
                maxWidth: 600,
                mx: 'auto',
                fontSize: { xs: '0.95rem', md: '1.05rem' },
              }}
            >
              Real stories from pet owners who trust us with their beloved companions
            </Typography>
          </Box>
        </motion.div>

        {/* Content */}
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#2ECC71', mb: 2 }} size={50} />
            <Typography variant="body2" color="#64748B">
              Loading testimonials...
            </Typography>
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography variant="h6" color="error" mb={3}>
              {error}
            </Typography>
            <button 
              onClick={fetchTestimonials}
              style={{
                padding: '12px 32px',
                backgroundColor: '#2ECC71',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(46, 204, 113, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Try Again
            </button>
          </Box>
        ) : testimonials.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2ECC71 0%, #144E8C 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                opacity: 0.1
              }}
            >
              <QuoteIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography variant="h6" color="#1A1A2E" mb={1} fontWeight={600}>
              No testimonials yet
            </Typography>
            <Typography variant="body2" color="#64748B">
              Be the first to share your experience with us!
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{ 
              position: 'relative', 
              overflow: 'hidden',
              Height: 800
             }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Testimonials Slider */}
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              style={{ cursor: 'grab' }}

            >
              <motion.div
                animate={{ 
                  x: `calc(-${currentIndex * (100 / 3)}% - ${currentIndex * 12}px)` 
                }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 30 
                }}
                style={{
                  display: 'flex',
                  gap: '12px',
                  willChange: 'transform'
                }}
              >
                {extendedTestimonials.map((testimonial, idx) => (
                  <Box
                    key={`${testimonial.id}-${idx}`}
                    sx={{
                      flexShrink: 0,
                      width: {
                        xs: '100%',
                        md: 'calc(50% - 6px)',
                        lg: 'calc(33.333% - 6px)'
                      },
                      marginTop:2
                      
                    }}
                  >
                    <motion.div
                      whileHover={{ y: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ height: '100%' }}
                    >
                      <Card
                        sx={{
                          height: '100%',
                          background: 'white',
                          borderRadius: 3,
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                          border: '1px solid #E2E8F0',
                          position: 'relative',
                          overflow: 'visible',
                          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 12px 40px rgba(46, 204, 113, 0.15)',
                            borderColor: '#2ECC71',
                          }
                        }}
                      >
                      {/* Quote Icon */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -12,
                          right: 24,
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(46, 204, 113, 0.3)'
                        }}
                      >
                        <QuoteIcon sx={{ color: 'white', fontSize: 20 }} />
                      </Box>

                      <CardContent sx={{ p: 3 }}>
                        {/* Rating */}
                        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Rating
                            value={testimonial.rating}
                            readOnly
                            size="small"
                            sx={{
                              '& .MuiRating-iconFilled': {
                                color: '#FFA500'
                              }
                            }}
                          />
                          <Typography variant="caption" color="#64748B" fontWeight={600}>
                            {testimonial.rating}.0
                          </Typography>
                        </Box>

                        {/* Testimonial Text */}
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#475569',
                            lineHeight: 1.7,
                            mb: 2.5,
                            fontSize: '0.94rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            minHeight: 90,
                          }}
                        >
                          "{testimonial.text}"
                        </Typography>

                        {/* Service & Pet Info */}
                        <Box sx={{ mb: 2.5, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Chip
                            label={testimonial.serviceUsed}
                            size="small"
                            sx={{
                              backgroundColor: '#ECFDF5',
                              color: '#059669',
                              fontWeight: 600,
                              fontSize: '0.7rem',
                              height: 24,
                              '& .MuiChip-label': { px: 1.5 }
                            }}
                          />
                          <Chip
                            label={`${testimonial.petName}  ( ${testimonial.petType} )`}
                            size="small"
                            sx={{
                              backgroundColor: '#EFF6FF',
                              color: '#2563EB',
                              fontWeight: 600,
                              fontSize: '0.7rem',
                              height: 24,
                              '& .MuiChip-label': { px: 1.5 }
                            }}
                          />
                        </Box>

                        {/* Client Info */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: 2.5, borderTop: '1px solid #E2E8F0' }}>
                          <Avatar
                            src={testimonial.image}
                            alt={testimonial.name}
                            sx={{
                              width: 42,
                              height: 42,
                              border: '2px solid #2ECC71'
                            }}
                          />
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: 600,
                                  color: '#1A1A2E',
                                  fontSize: '0.9rem',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {testimonial.name}
                              </Typography>
                              {testimonial.verified && (
                                <VerifiedIcon sx={{ color: '#2ECC71', fontSize: 14 }} />
                              )}
                            </Box>
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#94A3B8',
                                fontSize: '0.75rem'
                              }}
                            >
                              {new Date(testimonial.date).toLocaleDateString('en-US', {
                                month: 'short',
                                year: 'numeric'
                              })}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                      </Card>
                    </motion.div>
                  </Box>
                ))}
              </motion.div>
            </motion.div>

            {/* Navigation Controls */}
            {testimonials.length > 3 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 3, mt: 2 }}>
                <IconButton
                  onClick={handlePrev}
                  sx={{
                    width: 48,
                    height: 48,
                    background: 'white',
                    border: '2px solid #E2E8F0',
                    color: '#2ECC71',
                    '&:hover': {
                      background: '#2ECC71',
                      color: 'white',
                      borderColor: '#2ECC71',
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <ChevronLeft />
                </IconButton>

                {/* Dots Indicator */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {testimonials.map((_, idx) => (
                    <Box
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      sx={{
                        width: idx === currentIndex ? 24 : 8,
                        height: 8,
                        borderRadius: 4,
                        background: idx === currentIndex ? '#2ECC71' : '#CBD5E1',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </Box>

                <IconButton
                  onClick={handleNext}
                  sx={{
                    width: 48,
                    height: 48,
                    background: 'white',
                    border: '2px solid #E2E8F0',
                    color: '#2ECC71',
                    '&:hover': {
                      background: '#2ECC71',
                      color: 'white',
                      borderColor: '#2ECC71',
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <ChevronRight />
                </IconButton>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Testimonials