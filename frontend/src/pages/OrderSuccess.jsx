import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon, TruckIcon, ReceiptPercentIcon, HomeIcon } from '@heroicons/react/24/outline';
import apiService from '../services/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const { orderId, orderNumber, totalAmount } = location.state || {};

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await apiService.orders.getById(orderId);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-b-2 border-green-500 rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!orderId && !orderNumber) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
          <div className="text-center">
            <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full">
              <span className="text-4xl text-red-500">⚠️</span>
            </div>
            <h1 className="mb-4 text-2xl font-bold text-gray-800">Order Not Found</h1>
            <p className="mb-6 text-gray-600">We couldn't find your order information.</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 text-white transition-colors bg-green-600 rounded-xl hover:bg-green-700"
            >
              Go Home
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-12 mt-8 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="mb-12 text-center"
          >
            <motion.div variants={fadeInUp}>
              <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full">
                <CheckCircleIcon className="w-12 h-12 text-green-600" />
              </div>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="mb-4 text-4xl font-bold text-gray-800">
              Order Confirmed! 🎉
            </motion.h1>

            <motion.p variants={fadeInUp} className="mb-2 text-xl text-gray-600">
              Thank you for your purchase!
            </motion.p>

            <motion.p variants={fadeInUp} className="text-lg text-gray-500">
              Order #{order?.orderNumber || orderNumber} has been placed successfully.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Order Summary */}
            <motion.div
              variants={fadeInUp}
              className="p-6 bg-white shadow-xl rounded-2xl"
            >
              <h2 className="flex items-center mb-6 text-2xl font-semibold text-gray-800">
                <ReceiptPercentIcon className="w-6 h-6 mr-2 text-green-600" />
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Order Number:</span>
                  <span className="font-semibold text-gray-800">
                    #{order?.orderNumber || orderNumber}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Order Date:</span>
                  <span className="font-semibold text-gray-800">
                    {order?.orderDate 
                      ? new Date(order.orderDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : new Date().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                    }
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Payment Method:</span>
                  <span className="font-semibold text-gray-800 capitalize">
                    {order?.paymentMethod || 'Card'}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Order Status:</span>
                  <span className="px-3 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
                    {order?.status || 'CONFIRMED'}
                  </span>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total Amount:</span>
                    <span className="text-green-600">
                      LKR {order?.totalAmount?.toFixed(2) || totalAmount?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Shipping Information */}
            <motion.div
              variants={fadeInUp}
              className="p-6 bg-white shadow-xl rounded-2xl"
            >
              <h2 className="flex items-center mb-6 text-2xl font-semibold text-gray-800">
                <TruckIcon className="w-6 h-6 mr-2 text-green-600" />
                Shipping Information
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 font-semibold text-gray-700">Delivery Address:</h3>
                  <div className="space-y-1 text-gray-600">
                    <p className="font-semibold">{order?.shippingFullName}</p>
                    <p>{order?.shippingAddress}</p>
                    <p>
                      {order?.shippingCity}, {order?.shippingState} {order?.shippingZipCode}
                    </p>
                    <p>{order?.shippingCountry}</p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-gray-700">Contact Information:</h3>
                  <div className="space-y-1 text-gray-600">
                    <p>📧 {order?.shippingEmail}</p>
                    <p>📱 {order?.shippingPhone}</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-green-50">
                  <h3 className="mb-2 font-semibold text-green-800">Estimated Delivery:</h3>
                  <p className="text-green-700">
                    3-5 business days
                  </p>
                  <p className="mt-1 text-sm text-green-600">
                    You'll receive tracking information via email once your order ships.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Order Items */}
          {order?.orderItems && order.orderItems.length > 0 && (
            <motion.div
              variants={fadeInUp}
              className="p-6 mt-8 bg-white shadow-xl rounded-2xl"
            >
              <h2 className="mb-6 text-2xl font-semibold text-gray-800">
                Items Ordered ({order.orderItems.length})
              </h2>

              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    variants={fadeInUp}
                    className="flex items-center p-4 border border-gray-200 rounded-xl"
                  >
                    <img
                      src={item.productImageUrl || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=100&h=100&fit=crop'}
                      alt={item.productName}
                      className="object-cover w-16 h-16 mr-4 rounded-lg"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-800">{item.productName}</h3>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-500">
                        LKR {item.unitPrice?.toFixed(2)} each
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">
                        LKR {item.totalPrice?.toFixed(2)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col justify-center gap-4 mt-8 sm:flex-row"
          >
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center px-8 py-3 text-white transition-colors bg-green-600 rounded-xl hover:bg-green-700"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              Continue Shopping
            </button>

            <button
              onClick={() => navigate('/profile')}
              className="flex items-center justify-center px-8 py-3 text-green-600 transition-colors border-2 border-green-600 rounded-xl hover:bg-green-50"
            >
              <ReceiptPercentIcon className="w-5 h-5 mr-2" />
              View My Orders
            </button>
          </motion.div>

          {/* Contact Support */}
          <motion.div
            variants={fadeInUp}
            className="p-6 mt-8 text-center bg-blue-50 rounded-xl"
          >
            <h3 className="mb-2 font-semibold text-gray-800">Need Help?</h3>
            <p className="mb-4 text-gray-600">
              If you have any questions about your order, our support team is here to help.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="mailto:support@petcarepro.com"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                📧 support@petcarepro.com
              </a>
              <a
                href="tel:+15551234567"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                📞 +1 (555) 123-4567
              </a>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderSuccess;