import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';
import apiService from '../services/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCart, setFetchingCart] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  
  const [shippingDetails, setShippingDetails] = useState({
    fullName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    country: user?.country || 'United States'
  });

  useEffect(() => {
    if (user?.id) {
      fetchCartItems();
    }
  }, [user]);

  const fetchCartItems = async () => {
    try {
      setFetchingCart(true);
      const response = await apiService.cart.get(user.id);
      const items = response.data.cartItems || [];
      setCartItems(items);
      // Select all items by default
      setSelectedItems(items.map(item => item.id));
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart items');
    } finally {
      setFetchingCart(false);
    }
  };

  const handleShippingChange = (field, value) => {
    setShippingDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemSelect = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getSelectedItemsData = () => {
    return cartItems.filter(item => selectedItems.includes(item.id));
  };

  const calculateSubtotal = () => {
    return getSelectedItemsData().reduce((total, item) => {
      return total + (parseFloat(item.unitPrice) * item.quantity);
    }, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleConfirmCheckout = async () => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item to checkout');
      return;
    }

    // Validate shipping details
    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    const missingFields = requiredFields.filter(field => !shippingDetails[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    try {
      setLoading(true);
      
      const orderPayload = {
        userId: user.id,
        cartItemIds: selectedItems,
        shippingDetails,
        paymentMethod: selectedPaymentMethod,
        subtotal: calculateSubtotal(),
        taxAmount: calculateTax(),
        totalAmount: calculateTotal()
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

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Visa, Mastercard, American Express'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: '🅿️',
      description: 'Pay with your PayPal account'
    },
    {
      id: 'apple',
      name: 'Apple Pay',
      icon: '🍎',
      description: 'Touch ID or Face ID'
    },
    {
      id: 'google',
      name: 'Google Pay',
      icon: '🎯',
      description: 'Pay with Google'
    }
  ];

  return (
    <>
    <Navbar />
    <div className="min-h-screen py-8 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mt-16 mb-8 text-4xl font-bold text-center text-gray-800">
            Checkout
          </h1>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left Side - Shipping Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-6 bg-white shadow-xl rounded-2xl h-fit"
            >
              <div className="flex items-center mb-6">
                
                <h2 className="text-2xl font-semibold text-gray-800">
                  Shipping Information
                </h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={shippingDetails.fullName}
                      onChange={(e) => handleShippingChange('fullName', e.target.value)}
                      className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={shippingDetails.email}
                      onChange={(e) => handleShippingChange('email', e.target.value)}
                      className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={shippingDetails.phone}
                    onChange={(e) => handleShippingChange('phone', e.target.value)}
                    className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={shippingDetails.address}
                    onChange={(e) => handleShippingChange('address', e.target.value)}
                    className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Street address"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      City *
                    </label>
                    <input
                      type="text"
                      value={shippingDetails.city}
                      onChange={(e) => handleShippingChange('city', e.target.value)}
                      className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      State *
                    </label>
                    <input
                      type="text"
                      value={shippingDetails.state}
                      onChange={(e) => handleShippingChange('state', e.target.value)}
                      className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="State"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      value={shippingDetails.zipCode}
                      onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                      className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="ZIP"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input
                    type="text"
                    value={shippingDetails.country}
                    onChange={(e) => handleShippingChange('country', e.target.value)}
                    className="w-full px-4 py-3 transition-all duration-200 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Country"
                  />
                </div>
              </div>
            
            <hr className='mt-12 mb-6'/>
                            {/* Payment Methods */}
              <div className="p-6 bg-white rounded-2xl">
                <div className="flex items-center mb-6">
                   
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Payment Method
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {paymentMethods.map((method) => (
                    <motion.div
                      key={method.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedPaymentMethod === method.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <span className="mr-3 text-2xl">{method.icon}</span>
                        <h3 className="font-semibold text-gray-800">
                          {method.name}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        {method.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

            </motion.div>

            

            {/* Right Side - Cart Items, Payment, and Checkout */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Cart Items */}
              <div className="p-6 bg-white shadow-xl rounded-2xl">
                <div className="flex items-center mb-6">
                 
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Your Items ({cartItems.length})
                  </h2>
                </div>

                {fetchingCart ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-b-2 border-green-500 rounded-full animate-spin"></div>
                  </div>
                ) : cartItems.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4 overflow-y-auto max-h-180">
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`flex items-center p-4 border-2 rounded-xl transition-all duration-200 ${
                          selectedItems.includes(item.id)
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleItemSelect(item.id)}
                          className="w-5 h-5 mr-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        
                        <img
                          src={item.product?.imageUrl || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=100&h=100&fit=crop'}
                          alt={item.product?.name}
                          className="object-cover w-16 h-16 mr-4 rounded-lg"
                        />
                        
                        <div className="flex-grow">
                          <h3 className="font-semibold text-gray-800">
                            {item.product?.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-lg font-bold text-green-600">
                            ${parseFloat(item.unitPrice).toFixed(2)}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-800">
                            ${(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>



              {/* Order Summary & Checkout */}
              <div className="p-6 bg-white shadow-xl rounded-2xl">
                <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                  Order Summary
                </h2>

                <div className="mb-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (8%):</span>
                    <span className="font-semibold">${calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex justify-between text-xl">
                      <span className="font-bold">Total:</span>
                      <span className="font-bold text-green-600">
                        ${calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmCheckout}
                  disabled={loading || selectedItems.length === 0}
                  className="w-full py-4 text-lg font-semibold text-white transition-all duration-200 shadow-lg bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-red-700 hover:via-red-700 hover:to-red-700"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    `Confirm Checkout (${selectedItems.length} items)`
                  )}
                </motion.button>

                {selectedItems.length === 0 && (
                  <p className="mt-2 text-sm text-center text-red-500">
                    Please select at least one item to checkout
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Checkout;