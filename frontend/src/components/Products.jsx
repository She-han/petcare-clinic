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
  Chip
} from '@mui/material'
import {
  ShoppingCart as ShoppingIcon,
  Star as StarIcon
} from '@mui/icons-material'

const Products = () => {
  const products = [
    {
      id: 1,
      name: 'Premium Dog Food',
      category: 'Nutrition',
      price: '$29.99',
      originalPrice: '$39.99',
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 245,
      badge: 'Best Seller'
    },
    {
      id: 2,
      name: 'Cat Wellness Kit',
      category: 'Healthcare',
      price: '$45.99',
      originalPrice: '$55.99',
      image: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=300&h=300&fit=crop',
      rating: 4.9,
      reviews: 189,
      badge: 'New'
    },
    {
      id: 3,
      name: 'Interactive Pet Toys',
      category: 'Toys & Enrichment',
      price: '$19.99',
      originalPrice: '$24.99',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop',
      rating: 4.7,
      reviews: 312,
      badge: 'Sale'
    },
    {
      id: 4,
      name: 'Pet Grooming Set',
      category: 'Grooming',
      price: '$34.99',
      originalPrice: '$44.99',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300&h=300&fit=crop',
      rating: 4.6,
      reviews: 156,
      badge: 'Popular'
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

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Best Seller':
        return { backgroundColor: '#2ECC71', color: 'white' }
      case 'New':
        return { backgroundColor: '#0074D9', color: 'white' }
      case 'Sale':
        return { backgroundColor: '#FF6B6B', color: 'white' }
      case 'Popular':
        return { backgroundColor: '#144E8C', color: 'white' }
      default:
        return { backgroundColor: '#2ECC71', color: 'white' }
    }
  }

  return (
    <Box sx={{ width: '90%', mx: 'auto', py: { xs: 8, md: 12 } }}>
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
              Featured <span className="text-gradient">Products</span>
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
              High-quality pet care products and supplies to keep your companions healthy and happy
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={4}
                  sx={{ 
            justifyContent: 'center',
            alignItems: 'stretch' // Ensures all cards have equal height
          }}
        >
          {products.map((product, index) => (
            <Grid item xs={12} sm={6} lg={3} key={product.id}>
              <motion.div
                variants={fadeInUp}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
              >
                <Card 
                  sx={{
                    
                    height: '100%',
                    borderRadius: 4,
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(46, 204, 113, 0.1)',
                    '&:hover': {
                      boxShadow: '0 20px 40px rgba(46, 204, 113, 0.2)',
                      transform: 'translateY(-5px)'
                    },
                    transition: 'all 0.3s ease',
                    backgroundColor: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Badge */}
                  <Chip
                    label={product.badge}
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      zIndex: 2,
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      ...getBadgeColor(product.badge)
                    }}
                  />

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardMedia
                      component="img"
                      height={200}
                      image={product.image}
                      alt={product.name}
                      sx={{
                        objectFit: 'cover',
                        borderRadius: '16px 16px 0 0'
                      }}
                    />
                  </motion.div>

                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#0074D9',
                        fontWeight: 500,
                        mb: 1,
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: 1
                      }}
                    >
                      {product.category}
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: '#28283E',
                        mb: 0,
                        fontSize: { xs: '1.1rem', md: '1.3rem' }
                      }}
                    >
                      {product.name}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 2
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <StarIcon sx={{ color: '#2ECC71', fontSize: 16 }} />
                        <Typography
                          variant="body2"
                          sx={{ color: '#144E8C', fontWeight: 500 }}
                        >
                          {product.rating}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ color: '#144E8C', opacity: 0.7 }}
                      >
                        ({product.reviews} reviews)
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 3
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: '#2ECC71',
                          fontSize: { xs: '1.3rem', md: '1.5rem' }
                        }}
                      >
                        {product.price}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#144E8C',
                          textDecoration: 'line-through',
                          opacity: 0.6
                        }}
                      >
                        {product.originalPrice}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<ShoppingIcon />}
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
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <motion.div variants={fadeInUp}>
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="outlined"
              size="large"
              sx={{
                color: '#2ECC71',
                borderColor: '#2ECC71',
                borderWidth: 2,
                px: 4,
                py: 2,
                borderRadius: 3,
                fontWeight: 600,
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: '#2ECC71',
                  color: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(46, 204, 113, 0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              View All Products
            </Button>
          </Box>
        </motion.div>
      </motion.div>
    </Box>
  )
}

export default Products