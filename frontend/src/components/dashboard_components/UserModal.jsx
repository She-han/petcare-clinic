import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const UserModal = ({ user, onClose, onSave }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);

  // Set default values when editing
  useEffect(() => {
    if (user) {
      reset({
        username: user.username || '',
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
        country: user.country || 'USA',
        role: user.role || 'USER',
        isActive: user.isActive !== undefined ? user.isActive : true,
        emailVerified: user.emailVerified !== undefined ? user.emailVerified : false,
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
      });
    }
  }, [user, reset]);

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await onSave(data);
      toast.success(user ? 'User updated successfully!' : 'User created successfully!');
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user');
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
      

      <div className="bg-white z-50 rounded-2xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 text-white bg-gradient-to-r from-violet-500 to-purple-600">
          <h2 className="text-xl font-semibold">
            {user ? 'Edit User' : 'Create New User'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-200 transition-colors hover:text-gray-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Personal Information */}
            <div className="md:col-span-2">
              <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h3>
            </div>

            {/* Username */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Username *
              </label>
              <input
                type="text"
                {...register('username', { required: 'Username is required' })}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter username"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                <Mail className="inline w-4 h-4 mr-1" />
                Email *
              </label>
              <input
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address'
                  }
                })}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* First Name */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                First Name *
              </label>
              <input
                type="text"
                {...register('firstName', { required: 'First name is required' })}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Last Name *
              </label>
              <input
                type="text"
                {...register('lastName', { required: 'Last name is required' })}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>

            {/* Contact Information */}
            <div className="md:col-span-2">
              <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                <Phone className="w-5 h-5 mr-2" />
                Contact Information
              </h3>
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                {...register('phone')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Enter phone number"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                <Calendar className="inline w-4 h-4 mr-1" />
                Date of Birth
              </label>
              <input
                type="date"
                {...register('dateOfBirth')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {/* Location Information */}
            <div className="md:col-span-2">
              <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                <MapPin className="w-5 h-5 mr-2" />
                Location Information
              </h3>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                {...register('address')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Enter full address"
              />
            </div>

            {/* City */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                {...register('city')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Enter city"
              />
            </div>

            {/* State */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                {...register('state')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Enter state"
              />
            </div>

            {/* Zip Code */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Zip Code
              </label>
              <input
                type="text"
                {...register('zipCode')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Enter zip code"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                {...register('country')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Enter country"
              />
            </div>

            {/* Account Settings */}
            <div className="md:col-span-2">
              <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                <Shield className="w-5 h-5 mr-2" />
                Account Settings
              </h3>
            </div>

            {/* Role */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Role *
              </label>
              <select
                {...register('role', { required: 'Role is required' })}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                  errors.role ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
                <option value="VETERINARIAN">Veterinarian</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>



            {/* Status Checkboxes */}
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('isActive')}
                    className="w-5 h-5 border-gray-300 rounded text-violet-600 focus:ring-2 focus:ring-violet-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Active User
                  </span>
                </label>
                <p className="mt-1 ml-8 text-xs text-gray-500">
                  Allow user to access the system
                </p>
              </div>

              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('emailVerified')}
                    className="w-5 h-5 border-gray-300 rounded text-violet-600 focus:ring-2 focus:ring-violet-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Email Verified
                  </span>
                </label>
                <p className="mt-1 ml-8 text-xs text-gray-500">
                  Mark email as verified
                </p>
              </div>
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
              {loading ? 'Saving...' : (user ? 'Update User' : 'Create User')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;