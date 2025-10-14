import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Eye, 
  Package, 
  Clock, 
  DollarSign, 
  TrendingUp,
  ChevronDown,
  Calendar,
  User,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import apiService from '../../services/api';
import OrderModel from './OrderModel';
import ConfirmModal from './ConfirmModal';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusUpdateLoading, setStatusUpdateLoading] = useState({});

  // Order status options
  const orderStatuses = [
    { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    { value: 'CONFIRMED', label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    { value: 'PROCESSING', label: 'Processing', color: 'bg-purple-100 text-purple-800', icon: RefreshCw },
    { value: 'TO_BE_SENT', label: 'Ready to Ship', color: 'bg-orange-100 text-orange-800', icon: Package },
    { value: 'SENT', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800', icon: Truck },
    { value: 'DELIVERED', label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: AlertCircle },
    { value: 'REFUNDED', label: 'Refunded', color: 'bg-gray-100 text-gray-800', icon: RefreshCw }
  ];

  // Fetch orders from API
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiService.orders.getAll();
      console.log('Orders API Response:', response);
      console.log('Orders Data:', response.data);
      
      // Handle paginated response
      if (response.data && response.data.content) {
        setOrders(response.data.content);
      } else if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchOrders();
      return;
    }
    
    try {
      setLoading(true);
      console.log('Searching for:', searchTerm);
      
      // Check if search endpoint exists, if not use client-side filtering
      try {
        const response = await apiService.orders.search(searchTerm);
        console.log('Search API Response:', response);
        
        // Handle search response (might be paginated or array)
        if (response.data && response.data.content) {
          setOrders(response.data.content);
        } else if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          setOrders([]);
        }
      } catch (apiError) {
        console.log('API search failed, using client-side filtering:', apiError);
        
        // Fallback to client-side search if API search fails
        const allOrders = await apiService.orders.getAll();
        const ordersData = allOrders.data && allOrders.data.content ? 
          allOrders.data.content : 
          Array.isArray(allOrders.data) ? allOrders.data : [];
        
        const filteredOrders = ordersData.filter(order => {
          const searchLower = searchTerm.toLowerCase();
          return (
            (order.orderNumber && order.orderNumber.toLowerCase().includes(searchLower)) ||
            (order.shippingFullName && order.shippingFullName.toLowerCase().includes(searchLower)) ||
            (order.shippingEmail && order.shippingEmail.toLowerCase().includes(searchLower)) ||
            (order.user?.firstName && order.user.firstName.toLowerCase().includes(searchLower)) ||
            (order.user?.lastName && order.user.lastName.toLowerCase().includes(searchLower)) ||
            (order.user?.email && order.user.email.toLowerCase().includes(searchLower))
          );
        });
        
        setOrders(filteredOrders);
        toast.success(`Found ${filteredOrders.length} orders`);
      }
    } catch (error) {
      toast.error('Search failed');
      console.error('Error searching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle view order
  const handleViewOrder = async (order) => {
    try {
      console.log('Viewing order:', order);
      // Fetch detailed order information
      const response = await apiService.orders.getById(order.id);
      console.log('Order details response:', response);
      setSelectedOrder(response.data);
      setShowModal(true);
    } catch (error) {
      toast.error('Failed to fetch order details');
      console.error('Error fetching order details:', error);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setStatusUpdateLoading(prev => ({ ...prev, [orderId]: true }));
      await apiService.orders.updateStatus(orderId, newStatus);
      toast.success('Order status updated successfully');
      fetchOrders(); // Refresh the list
    } catch (error) {
      toast.error('Failed to update order status');
      console.error('Error updating order status:', error);
    } finally {
      setStatusUpdateLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  // Filter orders by status
  const filteredOrders = selectedStatus 
    ? orders.filter(order => order.status === selectedStatus)
    : orders;

  // Get status configuration
  const getStatusConfig = (status) => {
    return orderStatuses.find(s => s.value === status) || orderStatuses[0];
  };

  // Calculate statistics
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    processing: orders.filter(o => ['CONFIRMED', 'PROCESSING', 'TO_BE_SENT'].includes(o.status)).length,
    completed: orders.filter(o => o.status === 'DELIVERED').length,
    totalRevenue: orders.reduce((sum, order) => sum + (parseFloat(order.totalAmount) || 0), 0)
  };

  console.log('Orders array:', orders);
  console.log('Orders length:', orders.length);
  console.log('Filtered orders:', filteredOrders);
  console.log('Stats:', stats);

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        
        </div>
   
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200">
              <Package className="w-6 h-6 text-blue-800" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-100 to-yellow-200">
              <Clock className="w-6 h-6 text-yellow-800" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-100 to-purple-200">
              <RefreshCw className="w-6 h-6 text-purple-800" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-gray-900">{stats.processing}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-100 to-emerald-200">
              <CheckCircle className="w-6 h-6 text-emerald-800" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-100 to-green-200">
              <DollarSign className="w-6 h-6 text-green-800" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">LKR {stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
        <form onSubmit={handleSearch} className="flex flex-col gap-4 lg:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={16} />
              <input
                type="text"
                placeholder="Search orders by order number, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              {orderStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-6 py-3 text-white transition-colors rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedStatus('');
                fetchOrders();
              }}
              className="px-6 py-3 text-gray-600 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Order Details
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Items & Amount
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Payment & Shipping
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <tr key={order.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          #{order.orderNumber}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {order.id}
                        </div>
                        {order.trackingNumber && (
                          <div className="text-xs text-blue-600">
                            Tracking: {order.trackingNumber}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.user?.firstName || order.shippingFullName || 'N/A'} {order.user?.lastName || ''}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user?.email || order.shippingEmail || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-400">
                          {order.shippingCity && order.shippingState ? `${order.shippingCity}, ${order.shippingState}` : 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          LKR {parseFloat(order.totalAmount || 0).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Items: {order.orderItems?.length || 0}
                        </div>
                        <div className="text-xs text-gray-400">
                          Subtotal: LKR {parseFloat(order.subtotal || 0).toFixed(2)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-gray-900">
                          {order.paymentMethod}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.shippingMethod || 'Standard'}
                        </div>
                        {order.paymentStatus && (
                          <div className="text-xs text-green-600">
                            Payment: {order.paymentStatus}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          disabled={statusUpdateLoading[order.id]}
                          className={`text-xs font-semibold px-3 py-1 rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${statusConfig.color} ${
                            statusUpdateLoading[order.id] ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                        >
                          {orderStatuses.map(status => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                        {statusUpdateLoading[order.id] && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-gray-900">
                          {new Date(order.orderDate || order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.orderDate || order.createdAt).toLocaleTimeString()}
                        </div>
                        {order.deliveredDate && (
                          <div className="text-xs text-green-600">
                            Delivered: {new Date(order.deliveredDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="p-2 text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                        title="View Order Details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredOrders.length === 0 && (
          <div className="py-12 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <OrderModel
          order={selectedOrder}
          onClose={() => setShowModal(false)}
          onStatusUpdate={handleStatusUpdate}
          orderStatuses={orderStatuses}
        />
      )}
    </div>
  );
};

export default OrdersManagement;
