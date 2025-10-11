import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  Activity, 
  Plus,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import toast from 'react-hot-toast';
import TestimonialModel from './TestimonialModel';
import AppointmentModal from './AppointmentModal';
import UserModal from './UserModal';
import VeterinarianModal from './VeterinarianModal';
import ProductModal from './ProductModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalAppointments: 0,
    totalTestimonials: 0,
    activeUsers: 0,
    featuredProducts: 0,
    pendingAppointments: 0,
    approvedTestimonials: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showVeterinarianModal, setShowVeterinarianModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  
  // Data for modals
  const [veterinarians, setVeterinarians] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data concurrently
      const [
        usersResponse, 
        productsResponse, 
        appointmentsResponse, 
        testimonialsResponse,
        veterinariansResponse
      ] = await Promise.all([
        apiService.users.getAll(),
        apiService.products.getAll(),
        apiService.appointments.getAll(),
        apiService.testimonials.getAll(),
        apiService.veterinarians.getAll(),
      ]);

      const users = usersResponse.data || [];
      const products = productsResponse.data || [];
      const appointments = appointmentsResponse.data || [];
      const testimonials = testimonialsResponse.data || [];
      const veterinarians = veterinariansResponse.data || [];
      
      // Set veterinarians for appointment modal
      setVeterinarians(veterinarians);

      // Calculate stats
      const activeUsers = users.filter(user => user.isActive).length;
      const featuredProducts = products.filter(product => product.isFeatured).length;
      const pendingAppointments = appointments.filter(apt => apt.status === 'SCHEDULED').length;
      const approvedTestimonials = testimonials.filter(test => test.isApproved).length;

      setStats({
        totalUsers: users.length,
        totalProducts: products.length,
        totalAppointments: appointments.length,
        totalTestimonials: testimonials.length,
        activeUsers,
        featuredProducts,
        pendingAppointments,
        approvedTestimonials,
      });

      // Get recent data (last 5 items)
      setRecentUsers(users.slice(0, 5));
      setRecentProducts(products.slice(0, 5));
      
      // Get upcoming appointments (next 5)
      const today = new Date().toISOString().split('T')[0];
      const upcoming = appointments
        .filter(apt => apt.appointmentDate >= today)
        .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
        .slice(0, 5);
      setUpcomingAppointments(upcoming);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };


  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      subValue: `${stats.activeUsers} active`,
      icon: Users,
      gradientFrom: 'from-slate-400',
      gradientTo: 'to-slate-600',
      bgColor: 'bg-gradient-to-br from-slate-50 to-slate-200',
      iconBg: 'bg-gradient-to-br from-slate-100 to-slate-300',
      textColor: 'text-slate-700',
      change: '+12%',
      changeType: 'increase',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      subValue: `${stats.featuredProducts} featured`,
      icon: Package,
      gradientFrom: 'from-emerald-400',
      gradientTo: 'to-emerald-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-200',
      iconBg: 'bg-gradient-to-br from-emerald-100 to-emerald-300',
      textColor: 'text-emerald-700',
      change: '+5%',
      changeType: 'increase',
    },
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      subValue: `${stats.pendingAppointments} pending`,
      icon: Calendar,
      gradientFrom: 'from-violet-400',
      gradientTo: 'to-violet-600',
      bgColor: 'bg-gradient-to-br from-violet-50 to-violet-200',
      iconBg: 'bg-gradient-to-br from-violet-100 to-violet-300',
      textColor: 'text-violet-700',
      change: '+8%',
      changeType: 'increase',
    },
    {
      title: 'Total Testimonials',
      value: stats.totalTestimonials,
      subValue: `${stats.approvedTestimonials} approved`,
      icon: MessageSquare,
      gradientFrom: 'from-amber-400',
      gradientTo: 'to-amber-600',
      bgColor: 'bg-gradient-to-br from-amber-50 to-amber-200',
      iconBg: 'bg-gradient-to-br from-amber-100 to-amber-300',
      textColor: 'text-amber-700',
      change: '+15%',
      changeType: 'increase',
    },
  ];

  const quickActions = [
    {
      title: 'Add New Doctor',
      description: 'Create a new veterinarian account',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: () => setShowVeterinarianModal(true),
    },
    {
      title: 'Add New Product',
      description: 'Add a product to inventory',
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      action: () => setShowProductModal(true),
    },
    {
      title: 'New Appointments',
      description: 'Make new appointments',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      action: () => setShowAppointmentModal(true),
    },
    {
      title: 'Add Testimonials',
      description: 'Create new testimonials',
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      action: () => setShowTestimonialModal(true),
    },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Modal handlers
  const handleSaveVeterinarian = async (veterinarianData) => {
    try {
      await apiService.veterinarians.create(veterinarianData);
      toast.success('Veterinarian created successfully!');
      setShowVeterinarianModal(false);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error creating veterinarian:', error);
      toast.error('Failed to create veterinarian');
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      await apiService.products.create(productData);
      toast.success('Product created successfully!');
      setShowProductModal(false);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    }
  };

  const handleSaveAppointment = async (appointmentData) => {
    try {
      await apiService.appointments.create(appointmentData);
      toast.success('Appointment created successfully!');
      setShowAppointmentModal(false);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Failed to create appointment');
    }
  };

  const handleSaveTestimonial = async (testimonialData) => {
    try {
      await apiService.testimonials.create(testimonialData);
      toast.success('Testimonial created successfully!');
      setShowTestimonialModal(false);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error creating testimonial:', error);
      toast.error('Failed to create testimonial');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-2 text-gray-900 rounded-lg bg-gradient-to-r from-primary to-secondary">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
         <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard   <span className="text-xl font-medium text-gray-600">   | Complete Overview |</span></h1>
          
        </div>
      
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-6">
        {statCards.map((card) => (
          <div key={card.title} className={`relative overflow-hidden ${card.bgColor} backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group`}>
            <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
            <div className="relative p-5 lg:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="mb-1 text-xs font-medium tracking-wide uppercase text-gray-600/80">
                    {card.title}
                  </p>
                  <p className="mb-2 text-2xl font-bold text-gray-900 transition-colors lg:text-3xl group-hover:text-gray-800">
                    {card.value.toLocaleString()}
                  </p>
                </div>
                <div className={`${card.iconBg} p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className={`h-5 w-5 lg:h-6 lg:w-6 ${card.textColor} group-hover:animate-pulse`} />
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">
                  {card.subValue}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1 text-emerald-500" />
                    <span className="text-xs font-semibold text-emerald-600">
                      {card.change}
                    </span>
                    <span className="ml-1 text-xs text-gray-500">vs last month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 xl:gap-8">
        
        {/* Quick Actions */}
        <div className="p-6 transition-all duration-300 border shadow-lg bg-white/90 backdrop-blur-sm border-gray-200/50 rounded-2xl hover:shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <p className="text-sm text-gray-500">Create new entries</p>
            </div>
            <div className="p-2 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl">
              <BarChart3 className="w-5 h-5 text-violet-600" />
            </div>
          </div>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="w-full p-4 text-left transition-all duration-300 border border-gray-200/60 rounded-xl hover:border-violet-300 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 group hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center">
                  <div className={`${action.bgColor} p-3 rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm group-hover:shadow-md`}>
                    <action.icon className={`h-5 w-5 ${action.color} group-hover:animate-bounce`} />
                  </div>
                  <div className="flex-1 ml-4">
                    <p className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-violet-900">
                      {action.title}
                    </p>
                    <p className="text-xs text-gray-500 transition-colors group-hover:text-violet-600">
                      {action.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Plus className="w-4 h-4 text-gray-400 transition-all duration-300 group-hover:text-violet-600 group-hover:rotate-90" />
                    <div className="w-2 h-2 transition-all duration-300 bg-gray-300 rounded-full group-hover:bg-violet-400 group-hover:scale-150"></div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="p-6 transition-all duration-300 border shadow-lg bg-white/90 backdrop-blur-sm border-gray-200/50 rounded-2xl hover:shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
              <p className="text-sm text-gray-500">Next scheduled visits</p>
            </div>
            <button
              onClick={() => navigate('appointments')}
              className="px-3 py-1 text-sm font-medium transition-colors rounded-lg cursor-pointer text-violet-600 hover:text-violet-800 hover:bg-violet-50"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-center w-10 h-10 text-white rounded-full bg-secondary">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex-1 ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {appointment.user?.firstName} {appointment.user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(appointment.appointmentDate)} at {formatTime(appointment.appointmentTime)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <Calendar className="w-12 h-12 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No upcoming appointments</p>
              </div>
            )}
          </div>
        </div>


        {/* System Status */}
        <div className="p-6 transition-all duration-300 border shadow-lg bg-white/90 backdrop-blur-sm border-gray-200/50 rounded-2xl hover:shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
              <p className="text-sm text-gray-500">Service health</p>
            </div>
            <div className="p-2 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl">
              <Activity className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                <span className="text-sm font-medium text-gray-900">Database</span>
              </div>
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                <span className="text-sm font-medium text-gray-900">API Services</span>
              </div>
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                <span className="text-sm font-medium text-gray-900">Email Service</span>
              </div>
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-yellow-500" />
                <span className="text-sm font-medium text-gray-900">Backup Service</span>
              </div>
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                Maintenance
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:gap-8">
        
        {/* Recent Products */}
        <div className="p-6 transition-all duration-300 border shadow-lg bg-white/90 backdrop-blur-sm border-gray-200/50 rounded-2xl hover:shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Products</h3>
              <p className="text-sm text-gray-500">Latest inventory</p>
            </div>
            <button
              onClick={() => navigate('products')}
              className="px-3 py-1 text-sm font-medium transition-colors rounded-lg cursor-pointer text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentProducts.length > 0 ? (
              recentProducts.map((product) => (
                <div key={product.id} className="flex items-center p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-center w-12 h-12 overflow-hidden bg-gray-200 rounded-lg">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <Package className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 ml-3">
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category} • ${product.price}</p>
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      product.stockQuantity > 10 ? 'bg-green-100 text-green-800' : 
                      product.stockQuantity > 0 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.stockQuantity} in stock
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <Package className="w-12 h-12 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No products found</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="p-6 transition-all duration-300 border shadow-lg bg-white/90 backdrop-blur-sm border-gray-200/50 rounded-2xl hover:shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
              <p className="text-sm text-gray-500">Latest registrations</p>
            </div>
            <button
              onClick={() => navigate('users')}
              className="px-3 py-1 text-sm font-medium transition-colors rounded-lg cursor-pointer text-violet-600 hover:text-violet-800 hover:bg-violet-50"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div key={user.id} className="flex items-center p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-center w-10 h-10 text-sm font-medium text-white rounded-full bg-primary">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                  </div>
                  <div className="flex-1 ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <Users className="w-12 h-12 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No users found</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Modals */}
      {showVeterinarianModal && (
        <VeterinarianModal
          veterinarian={null}
          onClose={() => setShowVeterinarianModal(false)}
          onSave={handleSaveVeterinarian}
        />
      )}

      {showProductModal && (
        <ProductModal
          product={null}
          onClose={() => setShowProductModal(false)}
          onSave={handleSaveProduct}
        />
      )}

      {showAppointmentModal && (
        <AppointmentModal
          appointment={null}
          veterinarians={veterinarians}
          onClose={() => setShowAppointmentModal(false)}
          onSave={handleSaveAppointment}
        />
      )}

      {showTestimonialModal && (
        <TestimonialModel
          testimonial={null}
          onClose={() => setShowTestimonialModal(false)}
          onSave={handleSaveTestimonial}
        />
      )}
    </div>
  );
};

export default Dashboard;