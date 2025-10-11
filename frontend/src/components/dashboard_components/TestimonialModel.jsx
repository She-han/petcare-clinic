import React, { useState, useEffect } from 'react';
import { X, User, Star, MessageSquare, Heart, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const TestimonialModel = ({ testimonial, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    userId: null,
    customerName: '',
    customerEmail: '',
    customerImageUrl: '',
    rating: 5,
    title: '',
    content: '',
    petName: '',
    petType: '',
    serviceType: '',
    isApproved: false,
    isFeatured: false
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const petTypes = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Fish', 'Reptile', 'Other'];
  const serviceTypes = [
    'Regular Checkup',
    'Vaccination',
    'Surgery',
    'Emergency Care',
    'Dental Care',
    'Grooming',
    'Behavioral Consultation',
    'Other'
  ];

  useEffect(() => {
    if (testimonial) {
      setFormData({
        userId: testimonial.userId || null,
        customerName: testimonial.customerName || '',
        customerEmail: testimonial.customerEmail || '',
        customerImageUrl: testimonial.customerImageUrl || '',
        rating: testimonial.rating || 5,
        title: testimonial.title || '',
        content: testimonial.content || '',
        petName: testimonial.petName || '',
        petType: testimonial.petType || '',
        serviceType: testimonial.serviceType || '',
        isApproved: testimonial.isApproved || false,
        isFeatured: testimonial.isFeatured || false
      });
    }
  }, [testimonial]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (!formData.customerEmail.trim()) newErrors.customerEmail = 'Customer email is required';
    if (!formData.content.trim()) newErrors.content = 'Testimonial content is required';
    if (!formData.rating) newErrors.rating = 'Rating is required';
    if (formData.rating < 1 || formData.rating > 5) newErrors.rating = 'Rating must be between 1 and 5';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.customerEmail && !emailRegex.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address';
    }

    // Content length validation
    if (formData.content && formData.content.length < 10) {
      newErrors.content = 'Testimonial must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }
    
    setLoading(true);
    
    try {
      await onSave(formData);
      toast.success(testimonial ? 'Testimonial updated successfully!' : 'Testimonial created successfully!');
      onClose();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast.error('Failed to save testimonial');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 z-10 transition-all duration-300 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-white z-50 rounded-2xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 text-white bg-gradient-to-r from-violet-500 to-purple-600">
          <h2 className="text-xl font-semibold">
            {testimonial ? 'Edit Testimonial' : 'Create New Testimonial'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-200 transition-colors hover:text-gray-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Customer Information */}
            <div className="md:col-span-2">
              <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                <User className="w-5 h-5 mr-2" />
                Customer Information
              </h3>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Customer Name *
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  errors.customerName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter customer name"
              />
              {errors.customerName && (
                <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  errors.customerEmail ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter email address"
              />
              {errors.customerEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.customerEmail}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Customer Image URL
              </label>
              <input
                type="url"
                name="customerImageUrl"
                value={formData.customerImageUrl}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Pet Information */}
            <div className="md:col-span-2">
              <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                <Heart className="w-5 h-5 mr-2" />
                Pet Information
              </h3>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Pet Name
              </label>
              <input
                type="text"
                name="petName"
                value={formData.petName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Enter pet name"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Pet Type
              </label>
              <select
                name="petType"
                value={formData.petType}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">Select pet type</option>
                {petTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Testimonial Details */}
            <div className="md:col-span-2">
              <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                <Star className="w-5 h-5 mr-2" />
                Testimonial Details
              </h3>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Rating *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  min="1"
                  max="5"
                  className={`w-24 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                    errors.rating ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={`${
                        star <= formData.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              {errors.rating && (
                <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Service Type
              </label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">Select service type</option>
                {serviceTypes.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Enter testimonial title (optional)"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                <MessageSquare className="inline w-4 h-4 mr-1" />
                Testimonial Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={5}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  errors.content ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Write the testimonial content here..."
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                {formData.content.length} characters
              </p>
            </div>

            {/* Approval Status */}
            <div className="md:col-span-2">
              <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                <CheckCircle className="w-5 h-5 mr-2" />
                Status
              </h3>
            </div>

            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isApproved"
                  checked={formData.isApproved}
                  onChange={handleChange}
                  className="w-5 h-5 border-gray-300 rounded text-violet-600 focus:ring-2 focus:ring-violet-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Approved for Display
                </span>
              </label>
              <p className="mt-1 ml-8 text-xs text-gray-500">
                Approved testimonials will be visible on the public website
              </p>
            </div>

            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-5 h-5 border-gray-300 rounded text-violet-600 focus:ring-2 focus:ring-violet-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Featured Testimonial
                </span>
              </label>
              <p className="mt-1 ml-8 text-xs text-gray-500">
                Featured testimonials get priority display placement
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end pt-6 mt-6 space-x-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-white transition-colors rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (testimonial ? 'Update Testimonial' : 'Create Testimonial')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestimonialModel;
