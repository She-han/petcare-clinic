import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCartIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { AuthContext } from '../contexts/AuthContext';
import apiService from '../services/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Cart = () => {
  const { user, isAuthenticated, loading: authLoading, initialized } = useContext(AuthContext);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItem, setUpdatingItem] = useState(null);

  useEffect(() => {
    // Wait for AuthContext to be initialized before doing anything
    if (!initialized) {
      console.log('Cart: Waiting for auth initialization...');
      return;
    }

    console.log('Cart useEffect triggered');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('user:', user);
    console.log('user.id:', user?.id);
    console.log('initialized:', initialized);

    if (isAuthenticated && user?.id) {
      fetchCart();
    } else if (!isAuthenticated) {
      setLoading(false);
      setError('Please login to view your cart');
    } else if (!user?.id) {
      setLoading(false);
      setError('User ID not found');
    }
  }, [isAuthenticated, user, initialized]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      console.log('Fetching cart for user ID:', user.id);
      
      const response = await apiService.cart.get(user.id);
      console.log('Cart response:', response);
      
      setCart(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching cart:', error);
      if (error.response?.status === 404) {
        // No cart found - this is normal for new users
        setCart({ 
          cartItems: [], 
          totalAmount: 0, 
          totalItemsCount: 0,
          finalAmount: 0,
          taxAmount: 0,
          discountAmount: 0
        });
      } else {
        setError('Failed to load cart');
        toast.error('Failed to load cart');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setUpdatingItem(itemId);
      const response = await apiService.cart.updateItem(user.id, itemId, {
        quantity: newQuantity
      });
      setCart(response.data);
      toast.success('Cart updated');
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart');
    } finally {
      setUpdatingItem(null);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setUpdatingItem(itemId);
      const response = await apiService.cart.removeItem(user.id, itemId);
      setCart(response.data);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    } finally {
      setUpdatingItem(null);
    }
  };

  const clearCart = async () => {
    try {
      await apiService.cart.clear(user.id);
      setCart({ 
        cartItems: [], 
        totalAmount: 0, 
        totalItemsCount: 0,
        finalAmount: 0,
        taxAmount: 0,
        discountAmount: 0
      });
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const goToProducts = () => {
    window.location.href = '/products';
  };

  const proceedToCheckout = () => {
    // TODO: Implement checkout functionality
    window.location.href = '/checkout';
  };

  // Show loading while auth is initializing
  if (!initialized || authLoading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-green-500 rounded-full border-t-transparent"
          />
        </div>
      </>
    );
  }

  // Show loading while fetching cart
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-green-500 rounded-full border-t-transparent"
          />
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen py-12 bg-gray-50">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="max-w-md px-6 py-4 mx-auto mb-4 text-red-700 bg-red-100 border border-red-400 rounded-lg">
                {error}
              </div>
              {!isAuthenticated ? (
                <button 
                  onClick={() => window.location.href = '/login'}
                  className="px-6 py-3 font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                >
                  Login to Continue
                </button>
              ) : (
                <button 
                  onClick={fetchCart}
                  className="px-6 py-3 font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Empty cart
  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen py-12 bg-gray-50">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full">
                <ShoppingCartIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h1 className="mb-4 text-3xl font-bold text-gray-900">Your cart is empty</h1>
              <p className="mb-8 text-lg text-gray-600">
                Looks like you haven't added any items to your cart yet.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToProducts}
                className="inline-flex items-center px-6 py-3 text-base font-medium text-white transition-colors duration-200 bg-green-600 border border-transparent rounded-md hover:bg-green-700"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Continue Shopping
              </motion.button>
            </motion.div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Cart with items
  return (
    <>
      <Navbar />
      <div className="min-h-screen py-12 mt-12 md:mt-16 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600">
                {cart.totalItemsCount} {cart.totalItemsCount === 1 ? 'item' : 'items'}
              </p>
            </div>
            
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
              {/* Cart Items */}
              <div className="lg:col-span-7">
                <div className="overflow-hidden bg-white rounded-lg shadow">
                  <AnimatePresence>
                    {cart.cartItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-6 border-b border-gray-200 last:border-b-0"
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <img
                              src={item.product?.imageUrl || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=150&h=150&fit=crop'}
                              alt={item.product?.name || 'Product'}
                              className="object-cover w-20 h-20 rounded-lg shadow-sm"
                            />
                          </div>
                          
                          <div className="flex-1 ml-6">
                            <h3 className="mb-1 text-lg font-medium text-gray-900">
                              {item.product?.name || 'Unknown Product'}
                            </h3>
                            <p className="mb-2 text-gray-600">
                              LKR {Number(item.unitPrice || 0).toFixed(2)} each
                            </p>
                            <div className="text-sm text-gray-500">
                              Category: {item.product?.category || 'N/A'}
                            </div>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center mt-4">
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={updatingItem === item.id || item.quantity <= 1}
                                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <MinusIcon className="w-4 h-4" />
                                </motion.button>
                                
                                <span className="px-4 py-2 text-lg font-medium min-w-[3rem] text-center">
                                  {updatingItem === item.id ? '...' : item.quantity}
                                </span>
                                
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  disabled={updatingItem === item.id}
                                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <PlusIcon className="w-4 h-4" />
                                </motion.button>
                              </div>
                              
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeItem(item.id)}
                                disabled={updatingItem === item.id}
                                className="p-2 ml-6 text-red-600 rounded-lg hover:text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </motion.button>
                            </div>
                          </div>
                          
                          <div className="ml-4 text-right">
                            <p className="text-lg font-medium text-gray-900">
                              LKR {Number(item.totalPrice || 0).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Order Summary */}
              <div className="mt-8 lg:col-span-5 lg:mt-0">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="sticky p-6 bg-white rounded-lg shadow top-8"
                >
                  <h2 className="mb-6 text-lg font-medium text-gray-900">Order Summary</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">LKR {Number(cart.totalAmount || 0).toFixed(2)}</span>
                    </div>
                    
                    {cart.discountAmount && Number(cart.discountAmount) > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-LKR {Number(cart.discountAmount).toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">LKR {Number(cart.taxAmount || 0).toFixed(2)}</span>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="flex justify-between text-lg font-medium">
                        <span>Total</span>
                        <span className="text-green-600">
                          LKR {Number(cart.finalAmount || cart.totalAmount || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={proceedToCheckout}
                      className="w-full px-4 py-3 font-medium text-white transition-colors duration-200 bg-green-600 rounded-lg hover:bg-green-700"
                    >
                      Proceed to Checkout
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={goToProducts}
                      className="w-full px-4 py-3 font-medium text-gray-800 transition-colors duration-200 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Continue Shopping
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={clearCart}
                      className="w-full px-4 py-2 font-medium text-red-600 transition-colors duration-200 rounded-lg hover:bg-red-50"
                    >
                      Clear Cart
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;