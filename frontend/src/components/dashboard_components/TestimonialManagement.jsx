import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Star, User, Mail, Calendar, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import apiService from '../../services/api';
import TestimonialModel from './TestimonialModel';
import ConfirmModal from './ConfirmModal';

const TestimonialManagement = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [statusOptions] = useState(['All', 'Approved', 'Pending']);
  const [ratingOptions] = useState([1, 2, 3, 4, 5]);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState(null);

  // Fetch testimonials from API
  useEffect(() => {
    console.log('TestimonialManagement mounted, fetching data...');
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await apiService.testimonials.getAll();
      console.log('Fetched testimonials:', response);
      setTestimonials(response.data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to fetch testimonials');
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
    
    if (!searchTerm.trim()) {
      fetchTestimonials();
      return;
    }
    
    const filtered = testimonials.filter(testimonial => 
      testimonial.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.petName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setTestimonials(filtered);
  };

  // Handle create testimonial
  const handleCreateTestimonial = () => {
    setSelectedTestimonial(null);
    setShowModal(true);
  };

  // Handle edit testimonial
  const handleEditTestimonial = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setShowModal(true);
  };

  // Handle delete testimonial
  const handleDeleteTestimonial = (testimonial) => {
    setTestimonialToDelete(testimonial);
    setShowConfirmModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      await apiService.testimonials.delete(testimonialToDelete.id);
      toast.success('Testimonial deleted successfully!');
      setShowConfirmModal(false);
      setTestimonialToDelete(null);
      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial');
    }
  };

  // Handle save testimonial (create or update)
  const handleSaveTestimonial = async (testimonialData) => {
    try {
      if (selectedTestimonial) {
        // Update existing testimonial
        await apiService.testimonials.update(selectedTestimonial.id, testimonialData);
      } else {
        // Create new testimonial
        await apiService.testimonials.create(testimonialData);
      }
      fetchTestimonials();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      throw error;
    }
  };

  // Handle approve testimonial
  const handleApproveTestimonial = async (testimonialId) => {
    try {
      // Get current user ID from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const approvedBy = user.id || 1; // Default to 1 if no user found
      
      await apiService.testimonials.approve(testimonialId, approvedBy);
      toast.success('Testimonial approved successfully!');
      fetchTestimonials();
    } catch (error) {
      console.error('Error approving testimonial:', error);
      toast.error('Failed to approve testimonial');
    }
  };

  // Filter testimonials
  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesStatus = !selectedStatus || selectedStatus === 'All' || 
      (selectedStatus === 'Approved' && testimonial.isApproved) ||
      (selectedStatus === 'Pending' && !testimonial.isApproved);
    
    const matchesRating = !selectedRating || testimonial.rating === parseInt(selectedRating);
    
    return matchesStatus && matchesRating;
  });

  // Get status badge color
  const getStatusBadgeColor = (isApproved) => {
    return isApproved
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return 'N/A';
    }
  };

  console.log('Rendering TestimonialManagement, loading:', loading, 'testimonials:', testimonials.length);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 rounded-full border-violet-600 animate-spin border-t-transparent"></div>
          <p className="text-gray-600">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimonials Management</h1>
         
        </div>
        <button
          onClick={handleCreateTestimonial}
          className="inline-flex items-center px-4 py-2 text-white transition-colors rounded-lg shadow-lg bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-violet-500/25"
        >
          <Plus size={16} className="mr-2" />
          Add New Testimonial
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Testimonials</p>
              <p className="text-2xl font-bold text-gray-900">{testimonials.length}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {testimonials.filter(t => t.isApproved).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {testimonials.filter(t => !t.isApproved).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {testimonials.length > 0
                  ? (testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / testimonials.length).toFixed(1)
                  : '0.0'}
              </p>
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
                placeholder="Search testimonials by customer name, email, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="">All Ratings</option>
              {ratingOptions.map(rating => (
                <option key={rating} value={rating}>{rating} Stars</option>
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
                setSelectedRating('');
                fetchTestimonials();
              }}
              className="px-6 py-3 text-gray-600 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Testimonials Table */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Pet Info
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Rating
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Content
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Service
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
              {filteredTestimonials.map((testimonial) => (
                <tr key={testimonial.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-violet-100">
                        {testimonial.customerImageUrl ? (
                          <img
                            src={testimonial.customerImageUrl}
                            alt={testimonial.customerName}
                            className="w-12 h-12 rounded-full"
                          />
                        ) : (
                          <User className="w-6 h-6 text-violet-600" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {testimonial.customerName || 'N/A'}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="w-4 h-4 mr-1" />
                          {testimonial.customerEmail || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {testimonial.petName || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.petType || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          size={16}
                          className={`${
                            index < (testimonial.rating || 0)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {testimonial.rating || 0}/5
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      {testimonial.title && (
                        <div className="text-sm font-semibold text-gray-900 truncate">
                          {testimonial.title}
                        </div>
                      )}
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {testimonial.content || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {testimonial.serviceType || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(testimonial.isApproved)}`}>
                        {testimonial.isApproved ? 'Approved' : 'Pending'}
                      </span>
                      {testimonial.isFeatured && (
                        <span className="inline-flex px-3 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                      {formatDate(testimonial.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-2">
                      {!testimonial.isApproved && (
                        <button
                          onClick={() => handleApproveTestimonial(testimonial.id)}
                          className="p-2 text-green-600 transition-colors rounded-lg hover:bg-green-50"
                          title="Approve Testimonial"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleEditTestimonial(testimonial)}
                        className="p-2 text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                        title="Edit Testimonial"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTestimonial(testimonial)}
                        className="p-2 text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        title="Delete Testimonial"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredTestimonials.length === 0 && (
          <div className="py-12 text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No testimonials found</p>
            <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Testimonial Modal */}
      {showModal && (
        <TestimonialModel
          testimonial={selectedTestimonial}
          onClose={() => setShowModal(false)}
          onSave={handleSaveTestimonial}
        />
      )}

      {/* Confirm Delete Modal */}
      {showConfirmModal && (
        <ConfirmModal
          title="Delete Testimonial"
          message={`Are you sure you want to delete the testimonial from "${testimonialToDelete?.customerName}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};

export default TestimonialManagement;
