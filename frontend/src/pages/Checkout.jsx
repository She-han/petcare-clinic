import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Divider,
  Chip,
  Alert
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  CreditCard as PaymentIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';
import apiService from '../services/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  const [orderData, setOrderData] = useState(location.state || {});
  const [loading, setLoading] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  useEffect(() => {
    if (!orderData.product && !orderData.cartItems) {
      navigate('/products');
    }
  }, [orderData, navigate]);

  const handleShippingChange = (field, value) => {
    setShippingDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotal = () => {
    if (orderData.type === 'single') {
      return orderData.product.price * orderData.product.quantity;
    }
    // Handle cart items total calculation
    return orderData.cartItems?.reduce((total, item) => total + (item.unitPrice * item.quantity), 0) || 0;
  };

  const handleConfirmCheckout = async () => {
    try {
      setLoading(true);
      
      const orderPayload = {
        type: orderData.type,
        shippingDetails,
        items: orderData.type === 'single' 
          ? [{ productId: orderData.product.id, quantity: orderData.product.quantity }]
          : orderData.cartItems,
        totalAmount: calculateTotal(),
        taxAmount: calculateTotal() * 0.08, // 8% tax
        finalAmount: calculateTotal() * 1.08
      };

      const response = await apiService.orders.create(orderPayload);
      
      toast.success('Order placed successfully!');
      navigate('/order-success', { 
        state: { orderId: response.data.id } 
      });
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '90%', mx: 'auto', py: 8, minHeight: '100vh' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h3"
          sx={{
            textAlign: 'center',
            fontWeight: 700,
            color: '#28283E',
            mb: 6,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          Checkout
        </Typography>

        <Grid container spacing={4}>
          {/* Shipping Details */}
          <Grid item xs={12} lg={7}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                border: '1px solid rgba(46, 204, 113, 0.1)'
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: '#28283E',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <HomeIcon sx={{ color: '#2ECC71' }} />
                  Shipping Information
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={shippingDetails.fullName}
                      onChange={(e) => handleShippingChange('fullName', e.target.value)}
                      InputProps={{
                        startAdornment: <PersonIcon sx={{ color: '#2ECC71', mr: 1 }} />
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': { borderColor: '#2ECC71' },
                          '&.Mui-focused fieldset': { borderColor: '#2ECC71' }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={shippingDetails.email}
                      onChange={(e) => handleShippingChange('email', e.target.value)}
                      InputProps={{
                        startAdornment: <EmailIcon sx={{ color: '#2ECC71', mr: 1 }} />
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': { borderColor: '#2ECC71' },
                          '&.Mui-focused fieldset': { borderColor: '#2ECC71' }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={shippingDetails.phone}
                      onChange={(e) => handleShippingChange('phone', e.target.value)}
                      InputProps={{
                        startAdornment: <PhoneIcon sx={{ color: '#2ECC71', mr: 1 }} />
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': { borderColor: '#2ECC71' },
                          '&.Mui-focused fieldset': { borderColor: '#2ECC71' }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      value={shippingDetails.address}
                      onChange={(e) => handleShippingChange('address', e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': { borderColor: '#2ECC71' },
                          '&.Mui-focused fieldset': { borderColor: '#2ECC71' }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="City"
                      value={shippingDetails.city}
                      onChange={(e) => handleShippingChange('city', e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': { borderColor: '#2ECC71' },
                          '&.Mui-focused fieldset': { borderColor: '#2ECC71' }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="State"
                      value={shippingDetails.state}
                      onChange={(e) => handleShippingChange('state', e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': { borderColor: '#2ECC71' },
                          '&.Mui-focused fieldset': { borderColor: '#2ECC71' }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="ZIP Code"
                      value={shippingDetails.zipCode}
                      onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': { borderColor: '#2ECC71' },
                          '&.Mui-focused fieldset': { borderColor: '#2ECC71' }
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} lg={5}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                border: '1px solid rgba(46, 204, 113, 0.1)',
                position: 'sticky',
                top: 20
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: '#28283E',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <PaymentIcon sx={{ color: '#2ECC71' }} />
                  Order Summary
                </Typography>

                {/* Product Details */}
                {orderData.type === 'single' && orderData.product && (
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <img
                        src={orderData.product.imageUrl || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=100&h=100&fit=crop'}
                        alt={orderData.product.name}
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: 'cover',
                          borderRadius: 8
                        }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#28283E' }}>
                          {orderData.product.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                          Quantity: {orderData.product.quantity}
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#2ECC71', fontWeight: 600 }}>
                          ${orderData.product.price}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}

                <Divider sx={{ my: 3 }} />

                {/* Price Breakdown */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Subtotal:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      ${calculateTotal().toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Tax (8%):</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      ${(calculateTotal() * 0.08).toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Shipping:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#2ECC71' }}>
                      FREE
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Total:</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2ECC71' }}>
                      ${(calculateTotal() * 1.08).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleConfirmCheckout}
                  disabled={loading}
                  sx={{
                    background: 'linear-gradient(135deg, #2ECC71, #144E8C)',
                    color: 'white',
                    borderRadius: 3,
                    py: 2,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #144E8C, #2ECC71)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 30px rgba(46, 204, 113, 0.3)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {loading ? 'Processing...' : 'Confirm Checkout'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default Checkout;