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
  BarChart3,
  ShoppingCart,
  CreditCard,
  Truck,
  MapPin,
  ChevronDown,
  PieChart
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
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

  // Chart colors
  const CHART_COLORS = [
    '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe', '#f3f4f6'
  ];
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
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Product statistics states
  const [productStats, setProductStats] = useState({
    salesData: [],
    inventoryData: []
  });
  const [statsViewType, setStatsViewType] = useState('sales'); // 'sales' or 'inventory'
  
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
        veterinariansResponse,
        ordersResponse
      ] = await Promise.all([
        apiService.users.getAll(),
        apiService.products.getAll(),
        apiService.appointments.getAll(),
        apiService.testimonials.getAll(),
        apiService.veterinarians.getAll(),
        apiService.orders.getRecent(),
      ]);

      const users = usersResponse.data || [];
      const products = productsResponse.data || [];
      const appointments = appointmentsResponse.data || [];
      const testimonials = testimonialsResponse.data || [];
      const veterinarians = veterinariansResponse.data || [];
      const orders = ordersResponse.data || [];
      
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
      setRecentOrders(orders.slice(0, 6));

      // Process product statistics
      const processedStats = processProductStatistics(products, orders);
      setProductStats(processedStats);
      
      // Get upcoming appointments (next 2 weeks)
      const today = new Date();
      const twoWeeksFromNow = new Date();
      twoWeeksFromNow.setDate(today.getDate() + 14);
      
      const todayString = today.toISOString().split('T')[0];
      const twoWeeksString = twoWeeksFromNow.toISOString().split('T')[0];
      
      const upcoming = appointments
        .filter(apt => 
          apt.appointmentDate >= todayString && 
          apt.appointmentDate <= twoWeeksString
        )
        .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
        .slice(0, 8); // Show up to 8 appointments
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

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'PROCESSING':
        return 'bg-purple-100 text-purple-800';
      case 'READY_TO_SHIP':
        return 'bg-orange-100 text-orange-800';
      case 'SHIPPED':
        return 'bg-indigo-100 text-indigo-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'REFUNDED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return Clock;
      case 'CONFIRMED':
        return CheckCircle;
      case 'PROCESSING':
        return Package;
      case 'READY_TO_SHIP':
        return Package;
      case 'SHIPPED':
        return Truck;
      case 'DELIVERED':
        return CheckCircle;
      case 'CANCELLED':
        return AlertCircle;
      case 'REFUNDED':
        return CreditCard;
      default:
        return Package;
    }
  };

  const formatCurrency = (amount) => {
    return `LKR ${parseFloat(amount).toFixed(2)}`;
  };

  // Process product statistics for charts
  const processProductStatistics = (products, orders) => {
    // Create sales data from orders
    const productSalesMap = new Map();
    
    // Mock sales data based on products (since we might not have actual sales data)
    products.forEach(product => {
      const mockSales = Math.floor(Math.random() * 100) + 10; // Random sales between 10-110
      const mockRevenue = mockSales * parseFloat(product.price || 0);
      productSalesMap.set(product.name, {
        name: product.name,
        sales: mockSales,
        revenue: mockRevenue,
        stock: product.stockQuantity || 0
      });
    });

    // Convert to array and sort by sales
    const salesArray = Array.from(productSalesMap.values());
    const topSales = salesArray
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
    
    // Calculate others for sales
    const othersSales = salesArray
      .slice(5)
      .reduce((acc, item) => ({
        sales: acc.sales + item.sales,
        revenue: acc.revenue + item.revenue
      }), { sales: 0, revenue: 0 });

    const salesData = [...topSales];
    if (othersSales.sales > 0) {
      salesData.push({
        name: 'Others',
        sales: othersSales.sales,
        revenue: othersSales.revenue,
        stock: 0
      });
    }

    // Create inventory data
    const topInventory = salesArray
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 5);
    
    const othersInventory = salesArray
      .slice(5)
      .reduce((acc, item) => acc + item.stock, 0);

    const inventoryData = [...topInventory];
    if (othersInventory > 0) {
      inventoryData.push({
        name: 'Others',
        sales: 0,
        revenue: 0,
        stock: othersInventory
      });
    }

    return {
      salesData,
      inventoryData
    };
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
      <div className="p-1 text-gray-900 rounded-lg bg-gradient-to-r from-primary to-secondary">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
         <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard   <span className="text-xl font-medium text-gray-600">   | Complete Overview |</span></h1>
          
        </div>
      
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-6">
        {statCards.map((card) => (
          <div key={card.title} className={`relative overflow-hidden ${card.bgColor} backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-102 group`}>
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

      {/* Quick Actions */}
      <div className="p-6 transition-all duration-300 bg-white border shadow-lg backdrop-blur-sm border-gray-200/50 rounded-2xl hover:shadow-xl ">
          <div className="flex items-center justify-between mb-6 ">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <p className="text-sm text-gray-500">Create new entries</p>
            </div>
            <div className="p-2 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl">
              <BarChart3 className="w-5 h-5 text-violet-600" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:gap-8">
            <div className="space-y-3">
            {quickActions.slice(0,2).map((action, index) => (
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
            <div className="space-y-3">
            {quickActions.slice(2,4).map((action, index) => (
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
          
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:gap-8">
        

        {/* Upcoming Appointments */}
        <div className="p-6 transition-all duration-300 border shadow-lg bg-white/90 backdrop-blur-sm border-gray-200/50 rounded-2xl hover:shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
              <p className="text-sm text-gray-500">Next 2 weeks scheduled visits</p>
            </div>
            <button
              onClick={() => navigate('appointments')}
              className="px-3 py-1 text-sm font-medium transition-colors rounded-lg cursor-pointer text-violet-600 hover:text-violet-800 hover:bg-violet-50"
            >
              View All
            </button>
          </div>
          <div className="space-y-3 overflow-y-auto max-h-80">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => {
                // First try to get doctor from the nested relationship, fallback to finding by ID
                const doctor = appointment.veterinarian || veterinarians.find(vet => vet.id === appointment.veterinarianId);
                
                return (
                  <div key={appointment.id} className="flex items-center p-4 transition-all duration-300 border border-gray-200/60 rounded-xl hover:border-violet-300 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:shadow-md group">
                    {/* Doctor Picture */}
                    <div className="relative">
                      <div className="w-12 h-12 overflow-hidden transition-transform duration-300 border-2 border-white rounded-full shadow-sm bg-gradient-to-br from-violet-100 to-purple-100 group-hover:scale-110">
                        {doctor?.imageUrl || doctor?.photo ? (
                          <img
                            src={doctor.imageUrl || doctor.photo}
                            alt={`Dr. ${doctor.firstName || doctor.fullName?.split(' ')[0]} ${doctor.lastName || doctor.fullName?.split(' ')[1]}`}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-sm font-semibold text-violet-600">
                            {doctor?.firstName?.charAt(0) || doctor?.fullName?.charAt(0) || 'D'}
                            {doctor?.lastName?.charAt(0) || doctor?.fullName?.split(' ')[1]?.charAt(0) || 'R'}
                          </div>
                        )}
                      </div>
                      {/* Online status indicator */}
                      <div className="absolute w-4 h-4 bg-green-400 border-2 border-white rounded-full -bottom-1 -right-1"></div>
                    </div>
                    
                    {/* Appointment Details */}
                    <div className="flex-1 ml-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-violet-900">
                             {doctor?.firstName || doctor?.fullName?.split(' ')[0] || 'Unknown'} {doctor?.lastName || doctor?.fullName?.split(' ').slice(1).join(' ') || 'Doctor'}
                          </p>
                          <p className="text-xs text-gray-500 transition-colors group-hover:text-violet-600">
                            {doctor?.specialization || 'General Practice'}
                          </p>
                        </div>
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                      
                      {/* Date and Time */}
                      <div className="flex items-center space-x-4 text-xs text-gray-600 transition-colors group-hover:text-gray-700">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-violet-500" />
                          <span className="font-medium">{formatDate(appointment.appointmentDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-violet-500" />
                          <span className="font-medium">{formatTime(appointment.appointmentTime)}</span>
                        </div>
                        {(appointment.reasonForVisit || appointment.reason) && (
                          <div className="flex items-center space-x-1 max-w-32">
                            <MessageSquare className="w-3 h-3 text-violet-500" />
                            <span className="truncate">{appointment.reasonForVisit || appointment.reason}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
     
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <p className="mb-1 text-sm font-medium text-gray-500">No upcoming appointments</p>
                <p className="text-xs text-gray-400">The next 2 weeks are clear</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="p-6 transition-all duration-300 border shadow-lg bg-white/90 backdrop-blur-sm border-gray-200/50 rounded-2xl hover:shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <p className="hidden text-sm text-gray-500 sm:block">Latest customer orders</p>
            </div>
            <button
              onClick={() => navigate('orders')}
              className="flex-shrink-0 px-3 py-1 text-sm font-medium transition-colors rounded-lg cursor-pointer text-violet-600 hover:text-violet-800 hover:bg-violet-50"
            >
              <span className="hidden sm:inline">View All</span>
              <span className="sm:hidden">All</span>
            </button>
          </div>
          <div className="space-y-3 overflow-y-auto max-h-80">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => {
                const StatusIcon = getOrderStatusIcon(order.status);
                
                return (
                  <div 
                    key={order.id} 
                    className="flex items-center p-3 transition-all duration-300 border cursor-pointer sm:p-4 border-gray-200/60 rounded-xl hover:border-violet-300 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:shadow-md group"
                    onClick={() => navigate('orders')}
                  >
                    {/* Order Icon */}
                    <div className="relative flex-shrink-0">
                      <div className="flex items-center justify-center w-10 h-10 transition-transform duration-300 border-2 border-white rounded-full shadow-sm sm:w-12 sm:h-12 bg-gradient-to-br from-violet-100 to-purple-100 group-hover:scale-110">
                        <StatusIcon className="w-4 h-4 sm:w-5 sm:h-5 text-violet-600" />
                      </div>
                      {/* Status indicator dot */}
                      <div className={`absolute w-3 h-3 sm:w-4 sm:h-4 border-2 border-white rounded-full -bottom-1 -right-1 ${
                        order.status === 'DELIVERED' ? 'bg-green-400' :
                        order.status === 'SHIPPED' ? 'bg-blue-400' :
                        order.status === 'PROCESSING' ? 'bg-yellow-400' :
                        order.status === 'CANCELLED' ? 'bg-red-400' : 
                        'bg-gray-400'
                      }`}></div>
                    </div>
                    
                    {/* Order Details */}
                    <div className="flex-1 min-w-0 ml-3 sm:ml-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate transition-colors group-hover:text-violet-900">
                            #{order.orderNumber || `ORD-${order.id}`}
                          </p>
                          <p className="text-xs text-gray-500 truncate transition-colors group-hover:text-violet-600">
                            {order.shippingFullName || 'Customer'}
                          </p>
                        </div>
                        <span className={`inline-flex px-2 sm:px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 flex-shrink-0 ml-2 ${getOrderStatusColor(order.status)}`}>
                          <span className="hidden sm:inline">{order.status.replace('_', ' ')}</span>
                          <span className="sm:hidden">{order.status.split('_')[0]}</span>
                        </span>
                      </div>
                      
                      {/* Order Info */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 transition-colors sm:gap-3 group-hover:text-gray-700">
                        <div className="flex items-center space-x-1">
                          <CreditCard className="flex-shrink-0 w-3 h-3 text-violet-500" />
                          <span className="font-medium">{formatCurrency(order.totalAmount)}</span>
                        </div>
                      
                        <div className="flex items-center space-x-1">
                          <Calendar className="flex-shrink-0 w-3 h-3 text-violet-500" />
                          <span className="hidden sm:inline">{formatDate(order.orderDate)}</span>
                          <span className="sm:hidden">{formatDate(order.orderDate).split(',')[0]}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200">
                  <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <p className="mb-1 text-sm font-medium text-gray-500">No recent orders</p>
                <p className="text-xs text-gray-400">Orders will appear here once customers start purchasing</p>
              </div>
            )}
          </div>
        </div>



      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8">
        
        {/* Recent Products */}
        <div className="p-6 transition-all duration-300 border shadow-lg bg-white/90 backdrop-blur-sm border-gray-200/50 rounded-2xl hover:shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Products</h3>
              <p className="text-sm text-gray-500">Latest inventory</p>
            </div>
            <button
              onClick={() => navigate('products')}
              className="px-3 py-1 text-sm font-medium transition-colors rounded-lg cursor-pointer text-violet-600 hover:text-violet-800 hover:bg-violet-50"
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
                    <p className="text-xs text-gray-500">LKR {product.price}</p>
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



        {/* Product Statistics */}
        <div className="col-span-1 md:col-span-2 p-6 transition-all duration-300 border shadow-lg bg-white/90 backdrop-blur-sm border-gray-200/50 rounded-2xl hover:shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Product Analytics</h3>
              <p className="text-sm text-gray-500">
                {statsViewType === 'sales' ? 'Sales performance metrics' : 'Inventory stock levels'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {/* View Type Dropdown */}
              <div className="relative">
                <select
                  value={statsViewType}
                  onChange={(e) => setStatsViewType(e.target.value)}
                  className="appearance-none bg-gradient-to-br from-violet-100 to-purple-100 border border-violet-200 rounded-xl px-4 py-2 pr-8 text-sm font-medium text-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent cursor-pointer hover:from-violet-200 hover:to-purple-200 transition-all duration-300"
                >
                  <option value="sales">Sales Data</option>
                  <option value="inventory">Inventory</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-violet-600 pointer-events-none" />
              </div>
              <div className="p-2 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl">
                {statsViewType === 'sales' ? (
                  <BarChart3 className="w-5 h-5 text-violet-600" />
                ) : (
                  <Package className="w-5 h-5 text-violet-600" />
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100">
              <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2 text-violet-600" />
                {statsViewType === 'sales' ? 'Sales Volume' : 'Stock Levels'}
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statsViewType === 'sales' ? productStats.salesData : productStats.inventoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={{ stroke: '#e2e8f0' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        fontSize: '12px'
                      }}
                      formatter={(value, name) => [
                        statsViewType === 'sales' ? `${value} units` : `${value} in stock`,
                        statsViewType === 'sales' ? 'Sales' : 'Stock'
                      ]}
                    />
                    <Bar 
                      dataKey={statsViewType === 'sales' ? 'sales' : 'stock'}
                      fill="url(#barGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#a78bfa" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100">
              <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                <PieChart className="w-4 h-4 mr-2 text-violet-600" />
                Distribution Overview
              </h4>
              <div className="h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={statsViewType === 'sales' ? productStats.salesData : productStats.inventoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey={statsViewType === 'sales' ? 'sales' : 'stock'}
                    >
                      {(statsViewType === 'sales' ? productStats.salesData : productStats.inventoryData).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        fontSize: '12px'
                      }}
                      formatter={(value, name, entry) => [
                        statsViewType === 'sales' ? `${value} units` : `${value} in stock`,
                        entry.payload.name
                      ]}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
                
                {/* Legend */}
                <div className="absolute bottom-0 left-0 right-0">
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {(statsViewType === 'sales' ? productStats.salesData : productStats.inventoryData)
                      .slice(0, 4)
                      .map((item, index) => (
                        <div key={item.name} className="flex items-center text-xs">
                          <div 
                            className="w-3 h-3 rounded-full mr-1"
                            style={{ backgroundColor: CHART_COLORS[index] }}
                          ></div>
                          <span className="text-gray-600 truncate max-w-16">
                            {item.name.length > 8 ? `${item.name.substring(0, 8)}...` : item.name}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl">
              <div className="text-lg font-bold text-violet-600">
                {(statsViewType === 'sales' ? productStats.salesData : productStats.inventoryData)
                  .reduce((acc, item) => acc + (statsViewType === 'sales' ? item.sales : item.stock), 0)
                  .toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">
                {statsViewType === 'sales' ? 'Total Units Sold' : 'Total Stock'}
              </div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl">
              <div className="text-lg font-bold text-emerald-600">
                {productStats.salesData.length}
              </div>
              <div className="text-xs text-gray-600">Active Products</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
              <div className="text-lg font-bold text-amber-600">
                {statsViewType === 'sales' ? 
                  `LKR ${productStats.salesData.reduce((acc, item) => acc + (item.revenue || 0), 0).toFixed(0)}` :
                  `${productStats.inventoryData.filter(item => item.stock < 20).length}`
                }
              </div>
              <div className="text-xs text-gray-600">
                {statsViewType === 'sales' ? 'Total Revenue' : 'Low Stock Items'}
              </div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl">
              <div className="text-lg font-bold text-rose-600">
                {statsViewType === 'sales' ? 
                  productStats.salesData[0]?.name?.substring(0, 8) || 'N/A' :
                  productStats.inventoryData[0]?.name?.substring(0, 8) || 'N/A'
                }
              </div>
              <div className="text-xs text-gray-600">
                {statsViewType === 'sales' ? 'Top Seller' : 'Highest Stock'}
              </div>
            </div>
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