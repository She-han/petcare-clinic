import React, { useState, useContext } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  Rating,
  IconButton,
  Backdrop,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  ShoppingCart as CartIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiService from '../services/api';

const ProductDetailsModal = ({ product, onClose }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [processingCheckout, setProcessingCheckout] = useState(false);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      setAddingToCart(true);

      const addToCartRequest = {
        productId: product.id,
        quantity: quantity,
        unitPrice: product.price
      };

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
      setAddingToCart(false);
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to continue with checkout');
      return;
    }

    try {
      setProcessingCheckout(true);

      // Add item to cart silently (without notification)
      const addToCartRequest = {
        productId: product.id,
        quantity: quantity,
        unitPrice: product.price
      };

      await apiService.cart.addItem(user.id, addToCartRequest);
      
      // Close modal and navigate to checkout
      onClose();
      navigate('/checkout');

    } catch (error) {
      console.error('Error during checkout process:', error);
      
      let errorMessage = 'Failed to process checkout';
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
      setProcessingCheckout(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      <Modal
        open={true}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: { backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0,0,0,0.7)' }
        }}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '95%', sm: '90%', md: '80%', lg: '70%' },
              maxWidth: 1000,
              maxHeight: '90vh',
              bgcolor: 'white',
              borderRadius: 4,
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              overflow: 'hidden',
              outline: 'none'
            }}
          >
            {/* Header */}
            <Box
              sx={{
                position: 'relative',
                background: 'linear-gradient(135deg, #103E70, #144E8C)',
                color: 'white',
                p: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Product Details
              </Typography>
              <IconButton
                onClick={onClose}
                sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Content */}
            <Box sx={{ p: 4, maxHeight: 'calc(90vh - 120px)', overflowY: 'auto' }}>
              <Grid container spacing={4}>
                {/* Product Image */}
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      position: 'relative',
                      borderRadius: 3,
                      overflow: 'hidden',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }}
                  >
                    <img
                      src={product.imageUrl || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&h=500&fit=crop'}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '400px',
                        objectFit: 'cover'
                      }}
                    />
                    <Chip
                      label={product.category}
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        backgroundColor: '#2ECC71',
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                </Grid>

                {/* Product Details */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#0074D9',
                        fontWeight: 500,
                        mb: 1,
                        textTransform: 'uppercase',
                        letterSpacing: 1
                      }}
                    >
                      {product.brand || 'Premium Brand'}
                    </Typography>

                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: '#28283E',
                        mb: 2,
                        fontSize: { xs: '1.5rem', md: '2rem' }
                      }}
                    >
                      {product.name}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Rating
                        value={product.rating || 4.5}
                        readOnly
                        precision={0.1}
                        sx={{ color: '#2ECC71' }}
                      />
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        ({product.totalReviews || 0} reviews)
                      </Typography>
                    </Box>

                    <Typography
                      variant="body1"
                      sx={{
                        color: '#666',
                        mb: 3,
                        lineHeight: 1.6
                      }}
                    >
                      {product.description || 'High-quality pet care product designed to keep your companion healthy and happy.'}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 700,
                          color: '#2ECC71',
                          fontSize: { xs: '2rem', md: '2.5rem' }
                        }}
                      >
                        LKR {product.price}
                      </Typography>
                      {product.discountPrice && (
                        <Typography
                          variant="h6"
                          sx={{
                            color: '#666',
                            textDecoration: 'line-through'
                          }}
                        >
                          LKR {product.discountPrice}
                        </Typography>
                      )}
                    </Box>

                    {/* Stock Status */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                        Stock Status:
                      </Typography>
                      <Chip
                        label={
                          product.stockQuantity > 10 
                            ? 'In Stock' 
                            : product.stockQuantity > 0 
                            ? `Only ${product.stockQuantity} left` 
                            : 'Out of Stock'
                        }
                        sx={{
                          backgroundColor: 
                            product.stockQuantity > 10 
                              ? '#2ECC71' 
                              : product.stockQuantity > 0 
                              ? '#F39C12' 
                              : '#E74C3C',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </Box>

                    {/* Quantity Selector */}
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                        Quantity:
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          sx={{ minWidth: 40, color: '#2ECC71', borderColor: '#2ECC71' }}
                        >
                          -
                        </Button>
                        <Typography variant="h6" sx={{ minWidth: 40, textAlign: 'center' }}>
                          {quantity}
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                          sx={{ minWidth: 40, color: '#2ECC71', borderColor: '#2ECC71' }}
                          disabled={quantity >= product.stockQuantity}
                        >
                          +
                        </Button>
                      </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      {/* Add to Cart Button */}
                      <Button
                        variant="outlined"
                        size="large"
                        fullWidth
                        startIcon={addingToCart ? <CircularProgress size={20} color="inherit" /> : <CartIcon />}
                        onClick={handleAddToCart}
                        disabled={product.stockQuantity === 0 || addingToCart || processingCheckout}
                        sx={{
                          color: '#2ECC71',
                          borderColor: '#2ECC71',
                          borderWidth: 2,
                          borderRadius: 3,
                          py: 2,
                          fontWeight: 600,
                          fontSize: '1rem',
                          '&:hover': {
                            backgroundColor: '#2ECC71',
                            color: 'white',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(46, 204, 113, 0.3)'
                          },
                          '&:disabled': {
                            borderColor: '#ccc',
                            color: '#999'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {addingToCart ? 'Adding...' : 'Add to Cart'}
                      </Button>

                      {/* Checkout Button */}
                      <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={handleCheckout}
                        disabled={product.stockQuantity === 0 || processingCheckout || addingToCart}
                        sx={{
                          background: '#144E8C',
                          color: 'white',
                          borderRadius: 3,
                          py: 2,
                          fontWeight: 600,
                          fontSize: '1rem',
                          '&:hover': {
                            background: '#2ECC71',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 10px 30px rgba(46, 204, 113, 0.3)'
                          },
                          '&:disabled': {
                            background: '#ccc',
                            color: '#999'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {processingCheckout ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={20} color="inherit" />
                            Processing...
                          </Box>
                        ) : (
                          'Buy Now'
                        )}
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </motion.div>
      </Modal>
    </AnimatePresence>
  );
};

export default ProductDetailsModal;