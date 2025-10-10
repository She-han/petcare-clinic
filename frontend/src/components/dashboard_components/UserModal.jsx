import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';

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
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit User
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Username */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Username *
              </label>
              <input
                type="text"
                {...register('username', { required: 'Username is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                {...register('phone')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                {...register('dateOfBirth')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                {...register('address')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Role *
              </label>
              <select
                {...register('role', { required: 'Role is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
                <option value="VETERINARIAN">Veterinarian</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>



            {/* Checkboxes */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  {...register('isActive')}
                  className="w-4 h-4 border-gray-300 rounded text-primary focus:ring-primary"
                />
                <label htmlFor="isActive" className="block ml-2 text-sm text-gray-900">
                  Active User
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailVerified"
                  {...register('emailVerified')}
                  className="w-4 h-4 border-gray-300 rounded text-primary focus:ring-primary"
                />
                <label htmlFor="emailVerified" className="block ml-2 text-sm text-gray-900">
                  Email Verified
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-6 mt-6 space-x-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white transition-colors rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;