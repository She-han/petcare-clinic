import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Heart, Stethoscope, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const AppointmentModal = ({ appointment, veterinarians, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    veterinarianId: '',
    userId: null,
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    petName: '',
    petType: '',
    petAge: '',
    appointmentDate: '',
    appointmentTime: '',
    reasonForVisit: '',
    additionalNotes: '',
    status: 'SCHEDULED'
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const petTypes = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Fish', 'Reptile', 'Other'];
  const reasonOptions = [
    'Regular Checkup',
    'Vaccination',
    'Surgery Consultation',
    'Emergency Care',
    'Dental Care',
    'Grooming',
    'Behavioral Issues',
    'Skin Problems',
    'Other'
  ];
  const statusOptions = ['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];

  useEffect(() => {
    if (appointment) {
      setFormData({
        veterinarianId: appointment.veterinarianId || '',
        userId: appointment.userId || null,
        clientName: appointment.clientName || '',
        clientEmail: appointment.clientEmail || '',
        clientPhone: appointment.clientPhone || '',
        petName: appointment.petName || '',
        petType: appointment.petType || '',
        petAge: appointment.petAge || '',
        appointmentDate: appointment.appointmentDate || '',
        appointmentTime: appointment.appointmentTime || '',
        reasonForVisit: appointment.reasonForVisit || '',
        additionalNotes: appointment.additionalNotes || '',
        status: appointment.status || 'SCHEDULED'
      });
    }
  }, [appointment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    
    if (!formData.veterinarianId) newErrors.veterinarianId = 'Veterinarian is required';
    if (!formData.clientName.trim()) newErrors.clientName = 'Client name is required';
    if (!formData.clientEmail.trim()) newErrors.clientEmail = 'Client email is required';
    if (!formData.petName.trim()) newErrors.petName = 'Pet name is required';
    if (!formData.petType) newErrors.petType = 'Pet type is required';
    if (!formData.appointmentDate) newErrors.appointmentDate = 'Appointment date is required';
    if (!formData.appointmentTime) newErrors.appointmentTime = 'Appointment time is required';
    if (!formData.reasonForVisit) newErrors.reasonForVisit = 'Reason for visit is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.clientEmail && !emailRegex.test(formData.clientEmail)) {
      newErrors.clientEmail = 'Please enter a valid email address';
    }
    
    // Date validation (should be future date for new appointments)
    if (formData.appointmentDate && !appointment) {
      const selectedDate = new Date(formData.appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.appointmentDate = 'Please select a future date';
      }
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
      const appointmentData = {
        ...formData,
        veterinarianId: parseInt(formData.veterinarianId),
        userId: formData.userId ? parseInt(formData.userId) : null
      };
      
      await onSave(appointmentData);
    } catch (error) {
      console.error('Error saving appointment:', error);
      toast.error('Failed to save appointment');
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today for new appointments)
  const getMinDate = () => {
    if (appointment) return ''; // Allow past dates for editing
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 z-10 transition-all duration-300 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-white rounded-2xl z-50 shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 text-white bg-gradient-to-r from-violet-500 to-purple-600">
          <h2 className="text-xl font-semibold">
            {appointment ? 'Edit Appointment' : 'Create New Appointment'}
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
            {/* Veterinarian Selection */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                <Stethoscope className="inline w-4 h-4 mr-1" />
                Veterinarian *
              </label>
              <select
                name="veterinarianId"
                value={formData.veterinarianId}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  errors.veterinarianId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a veterinarian</option>
                {veterinarians.map(vet => (
                  <option key={vet.id} value={vet.id}>
                    {vet.fullName} - {vet.specialization}
                  </option>
                ))}
              </select>
              {errors.veterinarianId && (
                <p className="mt-1 text-sm text-red-600">{errors.veterinarianId}</p>
              )}
            </div>

            {/* Client Information */}
            <div className="md:col-span-2">
              <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                <User className="w-5 h-5 mr-2" />
                Client Information
              </h3>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Client Name *
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  errors.clientName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter client name"
              />
              {errors.clientName && (
                <p className="mt-1 text-sm text-red-600">{errors.clientName}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  errors.clientEmail ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter email address"
              />
              {errors.clientEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.clientEmail}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Enter phone number"
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
                Pet Name *
              </label>
              <input
                type="text"
                name="petName"
                value={formData.petName}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  errors.petName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter pet name"
              />
              {errors.petName && (
                <p className="mt-1 text-sm text-red-600">{errors.petName}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Pet Type *
              </label>
              <select
                name="petType"
                value={formData.petType}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  errors.petType ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select pet type</option>
                {petTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.petType && (
                <p className="mt-1 text-sm text-red-600">{errors.petType}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Pet Age
              </label>
              <input
                type="text"
                name="petAge"
                value={formData.petAge}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="e.g., 2 years"
              />
            </div>

            {/* Appointment Details */}
            <div className="md:col-span-2">
              <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                <Calendar className="w-5 h-5 mr-2" />
                Appointment Details
              </h3>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Appointment Date *
              </label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                min={getMinDate()}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  errors.appointmentDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.appointmentDate && (
                <p className="mt-1 text-sm text-red-600">{errors.appointmentDate}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Appointment Time *
              </label>
              <input
                type="time"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  errors.appointmentTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.appointmentTime && (
                <p className="mt-1 text-sm text-red-600">{errors.appointmentTime}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Reason for Visit *
              </label>
              <select
                name="reasonForVisit"
                value={formData.reasonForVisit}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  errors.reasonForVisit ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select reason</option>
                {reasonOptions.map(reason => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
              {errors.reasonForVisit && (
                <p className="mt-1 text-sm text-red-600">{errors.reasonForVisit}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                <FileText className="inline w-4 h-4 mr-1" />
                Additional Notes
              </label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Any additional notes or special requirements..."
              />
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
              {loading ? 'Saving...' : (appointment ? 'Update Appointment' : 'Create Appointment')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;