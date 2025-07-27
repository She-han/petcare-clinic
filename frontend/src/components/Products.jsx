import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  ShoppingCart as ShoppingIcon,
  Star as StarIcon,
  ShoppingBag as BuyNowIcon
} from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import apiService from '../services/api';
import toast from 'react-hot-toast';
import ProductDetailsModal from '../components/ProductDetailsModal';
import AuthModal from '../components/AuthModal';

const Products = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [actionType, setActionType] = useState(''); // 'cart' or 'buy'
  const [addingToCart, setAddingToCart] = useState({}); // Track loading state per product

  const navigate = useNavigate();
  
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.products.getAll();
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const stagger = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const getBadgeColor = (category) => {
    switch (category) {
      case 'FOOD':
        return { backgroundColor: '#2ECC71', color: 'white' };
      case 'TOYS':
        return { backgroundColor: '#0074D9', color: 'white' };
      case 'MEDICINE':
        return { backgroundColor: '#FF6B6B', color: 'white' };
      case 'ACCESSORIES':
        return { backgroundColor: '#144E8C', color: 'white' };
      case 'GROOMING':
        return { backgroundColor: '#9B59B6', color: 'white' };
      default:
        return { backgroundColor: '#2ECC71', color: 'white' };
    }
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      setSelectedProduct(product);
      setActionType('cart');
      setShowAuthModal(true);
      return;
    }

    try {
      // Set loading state for this specific product
      setAddingToCart(prev => ({ ...prev, [product.id]: true }));

      const addToCartRequest = {
        productId: product.id,
        quantity: 1,
        unitPrice: product.price
      };

      // Use the correct API endpoint structure based on your CartService
      await apiService.cart.addItem(user.id, addToCartRequest);
      
      toast.success(`${product.name} added to cart successfully!`, {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#2ECC71',
          color: 'white',
          fontWeight: '600',
          borderRadius: '12px',
        },
      });

    } catch (error) {
      console.error('Error adding to cart:', error);
      
      // Handle specific error messages
      let errorMessage = 'Failed to add product to cart';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#FF6B6B',
          color: 'white',
          fontWeight: '600',
          borderRadius: '12px',
        },
      });
    } finally {
      // Clear loading state for this product
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const handleBuyNow = (product) => {
    if (!isAuthenticated) {
      setSelectedProduct(product);
      setActionType('buy');
      setShowAuthModal(true);
      return;
    }

    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (actionType === 'cart' && selectedProduct) {
      handleAddToCart(selectedProduct);
    } else if (actionType === 'buy' && selectedProduct) {
      setShowProductModal(true);
    }
    // Clear selected product and action type
    setSelectedProduct(null);
    setActionType('');
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
    setSelectedProduct(null);
    setActionType('');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} sx={{ color: '#2ECC71' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: '90%', mx: 'auto', py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      </Box>
    );
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
              Pet Care <span className="text-gradient">Products</span>
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

        <Grid container spacing={4} sx={{ justifyContent: 'center', alignItems: 'stretch' }}>
          {products.slice(1,5).map((product, index) => (
            <Grid item xs={12} sm={6} lg={3} key={product.id}>
              <motion.div
                variants={fadeInUp}
                whileHover={{ 
                  y: 0,
                  transition: { duration: 0.3 }
                }}
              >
                <Card 
                  sx={{
                    width: '300px',
                    height: '600px',
                    borderRadius: 4,
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(46, 204, 113, 0.1)',
                    '&:hover': {
                      boxShadow: '0 20px 40px rgba(46, 204, 113, 0.2)'
                    },
                    transition: 'all 0.3s ease',
                    backgroundColor: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {/* Badge */}
                  <Chip
                    label={product.category}
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      zIndex: 2,
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      ...getBadgeColor(product.category)
                    }}
                  />

                  {/* Stock Status */}
                  {product.stockQuantity <= 10 && (
                    <Chip
                      label={product.stockQuantity === 0 ? 'Out of Stock' : 'Low Stock'}
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        zIndex: 2,
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        backgroundColor: product.stockQuantity === 0 ? '#FF6B6B' : '#F39C12',
                        color: 'white'
                      }}
                    />
                  )}

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardMedia
                      component="img"
                      height={200}
                      
                      image={product.imageUrl || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300&h=300&fit=crop'}
                      alt={product.name}
                      sx={{
                        objectFit: 'cover',
                        borderRadius: '16px 16px 0 0',
                        padding:'8px',
                       
                      }}
                    />
                  </motion.div>

                  <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#0074D9',
                        fontWeight: 500,
                        mb: 0,
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: 1
                      }}
                    >
                      {product.brand || 'Premium Brand'}
                    </Typography>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: '#28283E',
                        mb: 0,
                        fontSize: { xs: '1.1rem', md: '1.3rem' },
                        flexGrow: 1,
                        minHeight: '2.6rem' // Ensure consistent height
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
                          {product.rating || 4.5}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ color: '#144E8C', opacity: 0.7 }}
                      >
                        ({product.totalReviews || 0} reviews)
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
                          fontSize: { xs: '1rem', md: '1.2rem' }
                        }}
                      >
                        ${product.price}
                      </Typography>
                      {product.discountPrice && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#144E8C',
                            textDecoration: 'line-through',
                            opacity: 0.6
                          }}
                        >
                          ${product.discountPrice}
                        </Typography>
                      )}
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 'auto' }}>
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={addingToCart[product.id] ? <CircularProgress size={16} color="inherit" /> : <ShoppingIcon />}
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stockQuantity === 0 || addingToCart[product.id]}
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
                          '&:disabled': {
                            backgroundColor: '#ccc',
                            color: '#999'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {addingToCart[product.id] ? 'Adding...' : 'Add to Cart'}
                      </Button>

                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<BuyNowIcon />}
                        onClick={() => handleBuyNow(product)}
                        disabled={product.stockQuantity === 0}
                        sx={{
                          color: '#144E8C',
                          borderColor: '#144E8C',
                          borderWidth: 2,
                          borderRadius: 3,
                          py: 1.5,
                          fontWeight: 600,
                          fontSize: { xs: '0.8rem', md: '0.9rem' },
                          '&:hover': {
                            backgroundColor: '#144E8C',
                            color: 'white',
                            transform: 'translateY(-2px)'
                          },
                          '&:disabled': {
                            borderColor: '#ccc',
                            color: '#999'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Buy Now
                      </Button>
                    </Box>
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
              onClick={() => navigate('/products')}
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

      {/* Product Details Modal */}
      {showProductModal && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setShowProductModal(false)}
        />
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          open={showAuthModal}
          onClose={handleAuthModalClose}
          onSuccess={handleAuthSuccess}
        />
      )}
    </Box>
  );
};

export default Products;