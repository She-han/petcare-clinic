import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import TestimonialModal from '../components/TestimonialModal';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  FaUser, 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaStar, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope,
  FaBoxOpen,
  FaShoppingBag,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaSpinner
} from 'react-icons/fa';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    dateOfBirth: '',
    profileImageUrl: ''
  });

  const [userAppointments, setUserAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [testimonialModal, setTestimonialModal] = useState({
    open: false,
    appointment: null
  });

  
  useEffect(() => {
    if (user && user.id) {
      fetchUserProfile();
      fetchUserAppointments();
      fetchUserOrders();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const response = await apiService.auth.getProfile(user.id);
      const userData = response.data;
      setProfileData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
        state: userData.state || '',
        zipCode: userData.zipCode || '',
        country: userData.country || 'Sri Lanka',
        dateOfBirth: userData.dateOfBirth || '',
        profileImageUrl: userData.profileImageUrl || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    }
  };

  const fetchUserAppointments = async () => {
    try {
      setAppointmentsLoading(true);
      const response = await apiService.appointments.getByUser(user.id);
      // Handle different response formats
      const appointmentsData = response.data?.content || response.data || [];
      setUserAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
      setUserAppointments([]); // Ensure it's always an array
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    try {
      setOrdersLoading(true);
      console.log('Fetching orders for user:', user.id);
      const response = await apiService.orders.getByUserId(user.id);
      console.log('Orders API response:', response);
      
      // Handle paginated response or direct array
      const ordersData = response.data?.content || response.data || [];
      console.log('Processed orders data:', ordersData);
      
      const ordersArray = Array.isArray(ordersData) ? ordersData : [];
      console.log('Final orders array:', ordersArray);
      setUserOrders(ordersArray);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      setUserOrders([]); // Ensure it's always an array
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await apiService.auth.updateProfile(user.id, profileData);
      const updatedUser = response.data;
      
      // Update the user in context
      updateUser({
        ...user,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName
      });
      
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    fetchUserProfile(); // Reset to original data
  };

  const handleOpenTestimonialModal = (appointment) => {
    setTestimonialModal({
      open: true,
      appointment: appointment
    });
  };

  const handleCloseTestimonialModal = () => {
    setTestimonialModal({
      open: false,
      appointment: null
    });
  };

  const handleTestimonialSuccess = () => {
    fetchUserAppointments(); // Refresh appointments to show updated testimonial status
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'CONFIRMED': 'bg-green-100 text-green-800 border-green-200',
      'PROCESSING': 'bg-blue-100 text-blue-800 border-blue-200',
      'TO_BE_SENT': 'bg-purple-100 text-purple-800 border-purple-200',
      'SENT': 'bg-orange-100 text-orange-800 border-orange-200',
      'DELIVERED': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'CANCELLED': 'bg-red-100 text-red-800 border-red-200',
      'REFUNDED': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'CONFIRMED': return <FaCheckCircle className="w-4 h-4" />;
      case 'PROCESSING': return <FaClock className="w-4 h-4" />;
      case 'SENT': case 'TO_BE_SENT': return <FaTruck className="w-4 h-4" />;
      case 'DELIVERED': return <FaBoxOpen className="w-4 h-4" />;
      default: return <FaClock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <FaUser className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-700">Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  // Safety check for orders data
  if (!Array.isArray(userOrders)) {
    console.warn('userOrders is not an array:', userOrders);
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="pt-20 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8"
          >
            {/* Profile Header */}
            <div className="mb-8 overflow-hidden bg-white shadow-xl rounded-2xl">
              <div className="px-8 py-12 bg-gradient-to-r from-[#27AE60] to-[#2ECC71]">
                <div className="flex flex-col items-center gap-6 md:flex-row">
                  <div className="relative">
                    <div className="flex items-center justify-center w-32 h-32 bg-white rounded-full shadow-lg">
                      {profileData.profileImageUrl ? (
                        <img 
                          src={profileData.profileImageUrl} 
                          alt="Profile" 
                          className="object-cover rounded-full w-28 h-28"
                        />
                      ) : (
                        <FaUser className="w-16 h-16 text-emerald-500" />
                      )}
                    </div>
                    <div className="absolute p-2 rounded-full -bottom-2 -right-2 bg-emerald-500">
                      <FaCheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="mb-2 text-3xl font-bold text-white">
                      {user.firstName} {user.lastName}
                    </h1>
                    <div className="flex flex-col items-center gap-4 md:flex-row text-emerald-100">
                      <div className="flex items-center gap-2">
                        <FaUser className="w-4 h-4" />
                        <span>@{user.username}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {!editing ? (
                      <button
                        onClick={() => setEditing(true)}
                        className="flex items-center gap-2 px-6 py-3 font-semibold transition-all duration-200 bg-white shadow-lg text-emerald-600 rounded-xl hover:bg-emerald-50 hover:shadow-xl"
                      >
                        <FaEdit className="w-4 h-4" />
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex gap-3">
                        <button
                          onClick={handleSave}
                          disabled={loading}
                          className="flex items-center gap-2 px-6 py-3 font-semibold transition-all duration-200 bg-white shadow-lg text-emerald-600 rounded-xl hover:bg-emerald-50 hover:shadow-xl disabled:opacity-70"
                        >
                          {loading ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaSave className="w-4 h-4" />}
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-200 bg-red-500 shadow-lg rounded-xl hover:bg-red-600 hover:shadow-xl"
                        >
                          <FaTimes className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div className="p-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="w-full px-4 py-3 transition-all duration-200 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="w-full px-4 py-3 transition-all duration-200 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                    <div className="relative">
                      <FaPhone className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="w-full py-3 pl-12 pr-4 transition-all duration-200 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={profileData.dateOfBirth}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="w-full px-4 py-3 transition-all duration-200 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">City</label>
                    <input
                      type="text"
                      name="city"
                      value={profileData.city}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="w-full px-4 py-3 transition-all duration-200 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">State</label>
                    <input
                      type="text"
                      name="state"
                      value={profileData.state}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="w-full px-4 py-3 transition-all duration-200 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={profileData.zipCode}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="w-full px-4 py-3 transition-all duration-200 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={profileData.country}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="w-full px-4 py-3 transition-all duration-200 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-semibold text-gray-700">Address</label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute w-4 h-4 text-gray-400 left-3 top-4" />
                      <textarea
                        name="address"
                        value={profileData.address}
                        onChange={handleInputChange}
                        disabled={!editing}
                        rows={3}
                        className="w-full py-3 pl-12 pr-4 transition-all duration-200 border border-gray-200 resize-none rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointments Section */}
            <div className="mb-8 overflow-hidden bg-white shadow-xl rounded-2xl">
              <div className="px-8 py-6 bg-gradient-to-r from-[#27AE60] to-[#2ECC71]">
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="w-6 h-6 text-white" />
                  <h2 className="text-2xl font-bold text-white">My Appointments</h2>
                </div>
              </div>

              <div className="p-8">
                {appointmentsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <FaSpinner className="w-8 h-8 text-blue-500 animate-spin" />
                    <span className="ml-3 text-gray-600">Loading appointments...</span>
                  </div>
                ) : userAppointments.length === 0 ? (
                  <div className="py-12 text-center">
                    <FaCalendarAlt className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="mb-2 text-xl font-semibold text-gray-700">No appointments found</h3>
                    <p className="text-gray-500">Book your first appointment with our expert veterinarians!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {userAppointments.map((appointment) => (
                      <motion.div
                        key={appointment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 transition-all duration-300 border border-blue-100 bg-gradient-to-br from-white to-blue-50 rounded-xl hover:shadow-lg"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="mb-1 text-xl font-bold text-gray-800">{appointment.petName}</h3>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                              appointment.status === 'SCHEDULED' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {appointment.status === 'SCHEDULED' ? <FaCheckCircle className="w-3 h-3" /> : <FaClock className="w-3 h-3" />}
                              {appointment.status}
                            </span>
                          </div>
                        </div>

                        <div className="mb-4 space-y-3">
                          <div className="flex items-center gap-2 text-gray-700">
                            <span className="font-semibold">Pet Type:</span>
                            <span>{appointment.petType}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <span className="font-semibold">Reason:</span>
                            <span>{appointment.reasonForVisit}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <FaCalendarAlt className="w-4 h-4 text-blue-500" />
                            <span className="font-semibold">Date & Time:</span>
                            <span>{appointment.appointmentDate} at {appointment.appointmentTime}</span>
                          </div>
                        </div>

                        {appointment.additionalNotes && (
                          <div className="p-3 mb-4 rounded-lg bg-blue-50">
                            <span className="font-semibold text-gray-700">Notes: </span>
                            <span className="text-gray-600">{appointment.additionalNotes}</span>
                          </div>
                        )}

                        {appointment.appointmentRating ? (
                          <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                            <div className="flex items-center gap-2 mb-2 font-semibold text-green-700">
                              <FaCheckCircle className="w-4 h-4" />
                              Review Submitted
                            </div>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <span>Appointment Rating:</span>
                                <div className="flex">
                                  {[...Array(appointment.appointmentRating)].map((_, i) => (
                                    <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span>Doctor Rating:</span>
                                <div className="flex">
                                  {[...Array(appointment.doctorRating)].map((_, i) => (
                                    <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleOpenTestimonialModal(appointment)}
                            className="flex items-center justify-center w-full gap-2 py-3 font-semibold text-white transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700"
                          >
                            <FaStar className="w-4 h-4" />
                            Rate Appointment
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Orders Section */}
            <div className="overflow-hidden bg-white shadow-xl rounded-2xl">
              <div className="px-8 py-6 bg-gradient-to-r from-[#27AE60] to-[#2ECC71]">
                <div className="flex items-center gap-3">
                  <FaShoppingBag className="w-6 h-6 text-white" />
                  <h2 className="text-2xl font-bold text-white">My Orders</h2>
                </div>
              </div>

              <div className="p-8">
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <FaSpinner className="w-8 h-8 text-purple-500 animate-spin" />
                    <span className="ml-3 text-gray-600">Loading orders...</span>
                  </div>
                ) : userOrders.length === 0 ? (
                  <div className="py-12 text-center">
                    <FaShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="mb-2 text-xl font-semibold text-gray-700">No orders found</h3>
                    <p className="text-gray-500">Start shopping to see your orders here!</p>
                  </div>
                ) : Array.isArray(userOrders) && userOrders.length > 0 ? (
                  <div className="space-y-6">
                    {userOrders.filter(order => order && order.id).map((order) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 transition-all duration-300 border border-purple-100 bg-gradient-to-r from-white to-purple-50 rounded-xl hover:shadow-lg"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col justify-between gap-4 mb-6 lg:flex-row lg:items-center">
                          <div className="flex items-center gap-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-800">
                                Order #{order.orderNumber || 'N/A'}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {order.orderDate ? formatDate(order.orderDate) : 'N/A'}
                              </p>
                            </div>
                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(order.status || 'UNKNOWN')}`}>
                              {getStatusIcon(order.status)}
                              {order.status || 'UNKNOWN'}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="text-2xl font-bold text-emerald-600">
                              LKR {order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}
                            </p>
                          </div>
                        </div>

                        {/* Order Content */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                          {/* Items */}
                          <div className="lg:col-span-2">
                            <h4 className="flex items-center gap-2 mb-3 font-semibold text-gray-600">
                              <FaBoxOpen className="w-4 h-4" />
                              Items ({order.orderItems?.length || 0})
                            </h4>
                            {order.orderItems && order.orderItems.length > 0 ? (
                              <div className="space-y-2 overflow-y-auto max-h-32">
                                {order.orderItems.map((item, index) => (
                                  <div key={index} className="flex items-center justify-between px-3 py-2 bg-green-100 border-gray-100 rounded-lg">
                                    <span className="font-medium text-gray-600">
                                      {item.productName} × {item.quantity}
                                    </span>
                                    <span className="font-semibold text-gray-600">
                                      LKR {item.unitPrice*item.quantity?.toFixed(2)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="italic text-gray-500">No items available</p>
                            )}
                            <div className="space-y-2 overflow-y-auto max-h-32">
                                
                                  <div className="flex items-center justify-between px-3 py-2 mt-2 bg-green-100 border-gray-100 rounded-lg">
                                    <span className="font-medium text-gray-700">
                                      Shipping Cost
                                    </span>
                                    <span className="font-semibold text-gray-600">
                                      LKR {order.shippingCost}
                                    </span>
                                  </div>
                                
                              </div>
                          </div>

                          <div className='grid lg:grid-rows-2'>
                            <div>
                              <h4 className="flex items-center gap-2 mb-3 font-semibold text-gray-700">
                                <FaEnvelope className="w-4 h-4" />
                                Payment Method
                              </h4>
                              <div className="p-3 bg-white border-gray-500 rounded-lg">
                                <p className="text-sm leading-relaxed text-gray-700">
                                  {order.paymentMethod}</p>
                              </div>
                            </div>

                            <div>
                               {/* Shipping Address */}
                          {order.shippingAddress && (   
                            <div>
                              <h4 className="flex items-center gap-2 mb-3 font-semibold text-gray-700">
                                <FaMapMarkerAlt className="w-4 h-4" />
                                Shipping Address
                              </h4>
                              <div className="p-3 bg-white border-gray-500 rounded-lg">
                                <p className="text-sm leading-relaxed text-gray-700">
                                  {order.shippingAddress}</p>
                                <p className="text-sm leading-relaxed text-gray-700">
                                  {order.shippingCity}</p>
                               
                              </div>
                            </div>

                            
                          )}
                            </div>
                          </div>
                         

                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <FaShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="mb-2 text-xl font-semibold text-gray-700">Unable to load orders</h3>
                    <p className="text-gray-500">Please try again later.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Testimonial Modal */}
        {testimonialModal.open && (
          <TestimonialModal
            open={testimonialModal.open}
            onClose={handleCloseTestimonialModal}
            appointment={testimonialModal.appointment}
            onSuccess={handleTestimonialSuccess}
          />
        )}
      </div>
      <Footer />
    </>
  );
};


export default UserProfile;