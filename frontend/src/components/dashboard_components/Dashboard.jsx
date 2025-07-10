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
import apiService from '../services/api';
import toast from 'react-hot-toast';

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
        testimonialsResponse
      ] = await Promise.all([
        apiService.users.getAll(),
        apiService.products.getAll(),
        apiService.appointments.getAll(),
        apiService.testimonials.getAll(),
      ]);

      const users = usersResponse.data || [];
      const products = productsResponse.data || [];
      const appointments = appointmentsResponse.data || [];
      const testimonials = testimonialsResponse.data || [];

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

  // Get current date and time
  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      date: now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const { date, time } = getCurrentDateTime();

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      subValue: `${stats.activeUsers} active`,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: '+12%',
      changeType: 'increase',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      subValue: `${stats.featuredProducts} featured`,
      icon: Package,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      change: '+5%',
      changeType: 'increase',
    },
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      subValue: `${stats.pendingAppointments} pending`,
      icon: Calendar,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      change: '+8%',
      changeType: 'increase',
    },
    {
      title: 'Total Testimonials',
      value: stats.totalTestimonials,
      subValue: `${stats.approvedTestimonials} approved`,
      icon: MessageSquare,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      change: '+15%',
      changeType: 'increase',
    },
  ];

  const quickActions = [
    {
      title: 'Add New User',
      description: 'Create a new user account',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: () => navigate('/users'),
    },
    {
      title: 'Add New Product',
      description: 'Add a product to inventory',
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      action: () => navigate('/products'),
    },
    {
      title: 'View Appointments',
      description: 'Manage appointments',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      action: () => navigate('/appointments'),
    },
    {
      title: 'Manage Testimonials',
      description: 'Review testimonials',
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      action: () => navigate('/testimonials'),
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, She-han! 👋</h1>
            <p className="text-primary-100 text-lg">
              Here's what's happening with your pet care business today.
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-primary-100 text-sm">Current Date & Time</p>
            <p className="text-xl font-semibold">{date}</p>
            <p className="text-primary-100">{time}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.title} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {card.value.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  {card.subValue}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600">
                    {card.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`${card.bgColor} p-3 rounded-full`}>
                <card.icon className={`h-6 w-6 ${card.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
              >
                <div className="flex items-center">
                  <div className={`${action.bgColor} p-2 rounded-lg group-hover:scale-110 transition-transform`}>
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{action.title}</p>
                    <p className="text-xs text-gray-500">{action.description}</p>
                  </div>
                  <Plus className="h-4 w-4 text-gray-400 ml-auto group-hover:text-primary" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
            <button
              onClick={() => navigate('/users')}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div key={user.id} className="flex items-center p-3 rounded-lg hover:bg-gray-50">
                  <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                  </div>
                  <div className="ml-3 flex-1">
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
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <p className="text-sm text-gray-500 mt-2">No users found</p>
              </div>
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm font-medium text-gray-900">Database</span>
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm font-medium text-gray-900">API Services</span>
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm font-medium text-gray-900">Email Service</span>
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="text-sm font-medium text-gray-900">Backup Service</span>
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Maintenance
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Products */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Products</h3>
            <button
              onClick={() => navigate('/products')}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentProducts.length > 0 ? (
              recentProducts.map((product) => (
                <div key={product.id} className="flex items-center p-3 rounded-lg hover:bg-gray-50">
                  <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="ml-3 flex-1">
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
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <p className="text-sm text-gray-500 mt-2">No products found</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
            <button
              onClick={() => navigate('/appointments')}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center p-3 rounded-lg hover:bg-gray-50">
                  <div className="h-10 w-10 rounded-full bg-secondary text-white flex items-center justify-center">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="ml-3 flex-1">
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
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <p className="text-sm text-gray-500 mt-2">No upcoming appointments</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;