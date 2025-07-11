import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Stethoscope, Clock, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

const VeterinarianModal = ({ veterinarian, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    userId: '',
    licenseNumber: '',
    specialization: '',
    yearsOfExperience: '',
    education: '',
    bio: '',
    consultationFee: '',
    availableFrom: '09:00',
    availableTo: '17:00',
    workingDays: 'MON,TUE,WED,THU,FRI',
    isAvailable: true,
    rating: 0,
    totalReviews: 0
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const specializations = [
    'General Practice',
    'Surgery',
    'Dermatology',
    'Cardiology',
    'Orthopedics',
    'Oncology',
    'Neurology',
    'Dentistry',
    'Emergency Medicine',
    'Internal Medicine',
    'Ophthalmology',
    'Radiology'
  ];

  const workingDaysOptions = [
    { value: 'MON', label: 'Monday' },
    { value: 'TUE', label: 'Tuesday' },
    { value: 'WED', label: 'Wednesday' },
    { value: 'THU', label: 'Thursday' },
    { value: 'FRI', label: 'Friday' },
    { value: 'SAT', label: 'Saturday' },
    { value: 'SUN', label: 'Sunday' }
  ];

  useEffect(() => {
    if (veterinarian) {
      setFormData({
        userId: veterinarian.userId || '',
        licenseNumber: veterinarian.licenseNumber || '',
        specialization: veterinarian.specialization || '',
        yearsOfExperience: veterinarian.yearsOfExperience || '',
        education: veterinarian.education || '',
        bio: veterinarian.bio || '',
        consultationFee: veterinarian.consultationFee || '',
        availableFrom: veterinarian.availableFrom || '09:00',
        availableTo: veterinarian.availableTo || '17:00',
        workingDays: veterinarian.workingDays || 'MON,TUE,WED,THU,FRI',
        isAvailable: veterinarian.isAvailable !== undefined ? veterinarian.isAvailable : true,
        rating: veterinarian.rating || 0,
        totalReviews: veterinarian.totalReviews || 0
      });
    }
  }, [veterinarian]);

  const handleInputChange = (e) => {
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

  const handleWorkingDaysChange = (dayValue) => {
    const currentDays = formData.workingDays.split(',').filter(d => d.trim());
    const isSelected = currentDays.includes(dayValue);
    
    let newDays;
    if (isSelected) {
      newDays = currentDays.filter(d => d !== dayValue);
    } else {
      newDays = [...currentDays, dayValue];
    }
    
    setFormData(prev => ({
      ...prev,
      workingDays: newDays.join(',')
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userId) newErrors.userId = 'User ID is required';
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';
    if (!formData.specialization) newErrors.specialization = 'Specialization is required';
    if (!formData.consultationFee || parseFloat(formData.consultationFee) <= 0) {
      newErrors.consultationFee = 'Valid consultation fee is required';
    }
    if (!formData.yearsOfExperience || parseInt(formData.yearsOfExperience) < 0) {
      newErrors.yearsOfExperience = 'Valid years of experience is required';
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
      const veterinarianData = {
        ...formData,
        userId: parseInt(formData.userId),
        yearsOfExperience: parseInt(formData.yearsOfExperience),
        consultationFee: parseFloat(formData.consultationFee),
        rating: parseFloat(formData.rating),
        totalReviews: parseInt(formData.totalReviews)
      };

      await onSave(veterinarianData);
      toast.success(`Veterinarian ${veterinarian ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      toast.error(`Failed to ${veterinarian ? 'update' : 'create'} veterinarian`);
      console.error('Error saving veterinarian:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 transition-all duration-300 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 text-white bg-gradient-to-r from-violet-500 to-purple-600">
          <div className="flex items-center">
            <Stethoscope className="w-8 h-8 mr-3" />
            <h2 className="text-2xl font-bold">
              {veterinarian ? 'Edit Veterinarian' : 'Add New Veterinarian'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 transition-colors rounded-lg hover:bg-white/20"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            
            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  User ID *
                </label>
                <input
                  type="number"
                  name="userId"
                  value={formData.userId}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                    errors.userId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter user ID"
                />
                {errors.userId && <p className="mt-1 text-xs text-red-500">{errors.userId}</p>}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  License Number *
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                    errors.licenseNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter license number"
                />
                {errors.licenseNumber && <p className="mt-1 text-xs text-red-500">{errors.licenseNumber}</p>}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Specialization *
                </label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                    errors.specialization ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select specialization</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
                {errors.specialization && <p className="mt-1 text-xs text-red-500">{errors.specialization}</p>}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Years of Experience *
                </label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                    errors.yearsOfExperience ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter years of experience"
                />
                {errors.yearsOfExperience && <p className="mt-1 text-xs text-red-500">{errors.yearsOfExperience}</p>}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Consultation Fee *
                </label>
                <div className="relative">
                  <DollarSign className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="number"
                    name="consultationFee"
                    value={formData.consultationFee}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                      errors.consultationFee ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.consultationFee && <p className="mt-1 text-xs text-red-500">{errors.consultationFee}</p>}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Available From
                </label>
                <div className="relative">
                  <Clock className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="time"
                    name="availableFrom"
                    value={formData.availableFrom}
                    onChange={handleInputChange}
                    className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Available To
                </label>
                <div className="relative">
                  <Clock className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="time"
                    name="availableTo"
                    value={formData.availableTo}
                    onChange={handleInputChange}
                    className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>
            </div>

            {/* Working Days */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Working Days
              </label>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {workingDaysOptions.map(day => (
                  <label key={day.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.workingDays.includes(day.value)}
                      onChange={() => handleWorkingDaysChange(day.value)}
                      className="w-4 h-4 border-gray-300 rounded text-violet-600 focus:ring-violet-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{day.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Education
              </label>
              <textarea
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Enter educational background"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Enter veterinarian's bio"
              />
            </div>

            {/* Status */}
            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleInputChange}
                  className="w-4 h-4 border-gray-300 rounded text-violet-600 focus:ring-violet-500"
                />
                <span className="ml-2 text-sm text-gray-700">Available for appointments</span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end px-6 py-4 space-x-4 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-2 text-white transition-colors rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {veterinarian ? 'Update Veterinarian' : 'Create Veterinarian'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VeterinarianModal;