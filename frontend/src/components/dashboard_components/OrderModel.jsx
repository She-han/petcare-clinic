import React, { useState } from 'react';
import { 
  X, 
  Package, 
  User, 
  MapPin, 
  CreditCard, 
  Calendar, 
  Truck, 
  Phone,
  Mail,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  DollarSign,
  Hash
} from 'lucide-react';
import toast from 'react-hot-toast';

const OrderModel = ({ order, onClose, onStatusUpdate, orderStatuses }) => {
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  // Handle status update
  const handleStatusChange = async (newStatus) => {
    if (newStatus === order.status) return;
    
    try {
      setStatusUpdateLoading(true);
      await onStatusUpdate(order.id, newStatus);
      toast.success('Order status updated successfully');
    } catch (error) {
      toast.error('Failed to update order status');
      console.error('Error updating order status:', error);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  // Get status configuration
  const getStatusConfig = (status) => {
    return orderStatuses.find(s => s.value === status) || orderStatuses[0];
  };

  const currentStatusConfig = getStatusConfig(order.status);
  const StatusIcon = currentStatusConfig.icon;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  // Calculate order timeline
  const getOrderTimeline = () => {
    const timeline = [];
    
    if (order.orderDate || order.createdAt) {
      timeline.push({
        status: 'Order Placed',
        date: order.orderDate || order.createdAt,
        icon: Package,
        color: 'text-blue-600 bg-blue-100'
      });
    }
    
    if (order.confirmedDate) {
      timeline.push({
        status: 'Order Confirmed',
        date: order.confirmedDate,
        icon: CheckCircle,
        color: 'text-green-600 bg-green-100'
      });
    }
    
    if (order.shippedDate) {
      timeline.push({
        status: 'Order Shipped',
        date: order.shippedDate,
        icon: Truck,
        color: 'text-indigo-600 bg-indigo-100'
      });
    }
    
    if (order.deliveredDate) {
      timeline.push({
        status: 'Order Delivered',
        date: order.deliveredDate,
        icon: CheckCircle,
        color: 'text-emerald-600 bg-emerald-100'
      });
    }
    
    if (order.cancelledDate) {
      timeline.push({
        status: 'Order Cancelled',
        date: order.cancelledDate,
        icon: AlertCircle,
        color: 'text-red-600 bg-red-100'
      });
    }
    
    return timeline.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const timeline = getOrderTimeline();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 z-10 transition-all duration-300 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="bg-white z-50 rounded-2xl shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 text-white bg-gradient-to-r from-blue-500 to-cyan-600">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Order Details</h2>
              <p className="text-blue-100">#{order.orderNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-200 transition-colors hover:text-gray-50"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column - Order Info & Customer */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Summary */}
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                  <Hash className="w-5 h-5 mr-2" />
                  Order Summary
                </h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-semibold text-gray-900">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Number</p>
                    <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Items</p>
                    <p className="font-semibold text-gray-900">{order.orderItems?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-lg font-bold text-green-600">LKR {parseFloat(order.totalAmount || 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="p-6 bg-white border border-gray-200 rounded-xl">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                  <User className="w-5 h-5 mr-2" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-semibold text-gray-900">
                      {order.user?.firstName} {order.user?.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-700">{order.user?.email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-700">{order.user?.phone || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Customer ID</p>
                    <p className="text-gray-700">#{order.user?.id}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="p-6 bg-white border border-gray-200 rounded-xl">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                  <MapPin className="w-5 h-5 mr-2" />
                  Shipping Information
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Shipping Address</p>
                    <p className="font-medium text-gray-900">{order.shippingAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="text-gray-700">{order.shippingCity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">State</p>
                    <p className="text-gray-700">{order.shippingState}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ZIP Code</p>
                    <p className="text-gray-700">{order.shippingZipCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Country</p>
                    <p className="text-gray-700">{order.shippingCountry}</p>
                  </div>
                  {order.trackingNumber && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Tracking Number</p>
                      <p className="font-mono text-blue-600">{order.trackingNumber}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6 bg-white border border-gray-200 rounded-xl">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                  <Package className="w-5 h-5 mr-2" />
                  Order Items
                </h3>
                <div className="space-y-4">
                  {order.orderItems?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-lg">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.productName}</p>
                          <p className="text-sm text-gray-500">SKU: {item.product?.sku || 'N/A'}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">LKR {parseFloat(item.unitPrice || item.price || 0).toFixed(2)}</p>
                        <p className="text-sm text-gray-500">each</p>
                        <p className="text-sm font-medium text-green-600">
                          Total: LKR {parseFloat(item.totalPrice || (item.unitPrice * item.quantity) || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Order Totals */}
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal:</span>
                      <span className="text-gray-900">LKR {parseFloat(order.subtotal || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tax:</span>
                      <span className="text-gray-900">LKR {parseFloat(order.taxAmount || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Shipping:</span>
                      <span className="text-gray-900">LKR {parseFloat(order.shippingCost || order.shippingAmount || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 text-lg font-bold border-t border-gray-200">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-green-600">LKR {parseFloat(order.totalAmount || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Status & Timeline */}
            <div className="space-y-6">
              {/* Current Status & Controls */}
              <div className="p-6 bg-white border border-gray-200 rounded-xl">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                  <StatusIcon className="w-5 h-5 mr-2" />
                  Order Status
                </h3>
                
                <div className="mb-4">
                  <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold ${currentStatusConfig.color}`}>
                    <StatusIcon className="w-4 h-4 mr-2" />
                    {currentStatusConfig.label}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Update Status
                  </label>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={statusUpdateLoading}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  >
                    {orderStatuses.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  {statusUpdateLoading && (
                    <div className="flex items-center text-sm text-gray-500">
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Updating status...
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              <div className="p-6 bg-white border border-gray-200 rounded-xl">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium text-gray-900">{order.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                      {order.paymentStatus || 'Completed'}
                    </span>
                  </div>
                  {order.transactionId && (
                    <div>
                      <p className="text-sm text-gray-500">Transaction ID</p>
                      <p className="font-mono text-sm text-gray-700">{order.transactionId}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Timeline */}
              <div className="p-6 bg-white border border-gray-200 rounded-xl">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                  <Calendar className="w-5 h-5 mr-2" />
                  Order Timeline
                </h3>
                <div className="space-y-4">
                  {timeline.map((event, index) => {
                    const EventIcon = event.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${event.color}`}>
                          <EventIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{event.status}</p>
                          <p className="text-xs text-gray-500">{formatDate(event.date)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Additional Details */}
              <div className="p-6 bg-white border border-gray-200 rounded-xl">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                  <Clock className="w-5 h-5 mr-2" />
                  Order Dates
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">Created:</p>
                    <p className="text-gray-900">{formatDate(order.orderDate || order.createdAt)}</p>
                  </div>
                  {order.updatedAt && (
                    <div>
                      <p className="text-gray-500">Last Updated:</p>
                      <p className="text-gray-900">{formatDate(order.updatedAt)}</p>
                    </div>
                  )}
                  {order.notes && (
                    <div>
                      <p className="text-gray-500">Notes:</p>
                      <p className="text-gray-900">{order.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 bg-gray-50 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModel;
