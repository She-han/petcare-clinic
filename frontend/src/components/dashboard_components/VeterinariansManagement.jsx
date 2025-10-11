import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Star, Stethoscope, Clock, DollarSign, User } from 'lucide-react';
import toast from 'react-hot-toast';
import apiService from '../../services/api';
import VeterinarianModal from './VeterinarianModal';
import ConfirmModal from './ConfirmModal';

const VeterinariansManagement = () => {
  const [veterinarians, setVeterinarians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedVeterinarian, setSelectedVeterinarian] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [veterinarianToDelete, setVeterinarianToDelete] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');

  // Fetch veterinarians from API
  useEffect(() => {
    fetchVeterinarians();
    fetchSpecializations();
  }, []);

  const fetchVeterinarians = async () => {
    try {
      setLoading(true);
      const response = await apiService.veterinarians.getAll();
      setVeterinarians(response.data);
    } catch (error) {
      toast.error('Failed to fetch veterinarians');
      console.error('Error fetching veterinarians:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const response = await apiService.veterinarians.getSpecializations();
      setSpecializations(response.data);
    } catch (error) {
      console.error('Error fetching specializations:', error);
    }
  };

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchVeterinarians();
      return;
    }
    
    try {
      setLoading(true);
      const response = await apiService.veterinarians.search(searchTerm);
      setVeterinarians(response.data);
    } catch (error) {
      toast.error('Search failed');
      console.error('Error searching veterinarians:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle create veterinarian
  const handleCreateVeterinarian = () => {
    setSelectedVeterinarian(null);
    setShowModal(true);
  };

  // Handle edit veterinarian
  const handleEditVeterinarian = (veterinarian) => {
    setSelectedVeterinarian(veterinarian);
    setShowModal(true);
  };

  // Handle delete veterinarian
  const handleDeleteVeterinarian = (veterinarian) => {
    setVeterinarianToDelete(veterinarian);
    setShowConfirmModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      await apiService.veterinarians.delete(veterinarianToDelete.id);
      toast.success('Veterinarian deleted successfully');
      fetchVeterinarians();
      setShowConfirmModal(false);
      setVeterinarianToDelete(null);
    } catch (error) {
      toast.error('Failed to delete veterinarian');
      console.error('Error deleting veterinarian:', error);
    }
  };

  // Handle save veterinarian (create or update)
  const handleSaveVeterinarian = async (veterinarianData) => {
    try {
      if (selectedVeterinarian) {
        // Update existing veterinarian
        await apiService.veterinarians.update(selectedVeterinarian.id, veterinarianData);
        toast.success('Veterinarian updated successfully');
      } else {
        // Create new veterinarian
        await apiService.veterinarians.create(veterinarianData);
        toast.success('Veterinarian created successfully');
      }
      setShowModal(false);
      fetchVeterinarians();
    } catch (error) {
      toast.error(selectedVeterinarian ? 'Failed to update veterinarian' : 'Failed to create veterinarian');
      console.error('Error saving veterinarian:', error);
    }
  };

  // Filter veterinarians by specialization
  const filteredVeterinarians = selectedSpecialization 
    ? veterinarians.filter(vet => vet.specialization === selectedSpecialization)
    : veterinarians;

  // Get status badge color
  const getStatusBadgeColor = (isAvailable) => {
    return isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  // Get specialization badge color
  const getSpecializationBadgeColor = (specialization) => {
    const colors = {
      'General Practice': 'bg-blue-100 text-blue-800',
      'Surgery': 'bg-red-100 text-red-800',
      'Dermatology': 'bg-green-100 text-green-800',
      'Cardiology': 'bg-purple-100 text-purple-800',
      'Orthopedics': 'bg-yellow-100 text-yellow-800',
      'Oncology': 'bg-pink-100 text-pink-800',
      'Neurology': 'bg-indigo-100 text-indigo-800',
      'Dentistry': 'bg-teal-100 text-teal-800',
      'Emergency Medicine': 'bg-orange-100 text-orange-800',
      'Internal Medicine': 'bg-cyan-100 text-cyan-800',
      'Ophthalmology': 'bg-violet-100 text-violet-800',
      'Radiology': 'bg-gray-100 text-gray-800',
    };
    return colors[specialization] || 'bg-gray-100 text-gray-800';
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Veterinarians Management</h1>
         
        </div>
        <button
          onClick={handleCreateVeterinarian}
          className="inline-flex items-center px-4 py-2 text-white transition-colors rounded-lg shadow-lg bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-violet-500/25"
        >
          <Plus size={16} className="mr-2" />
          Add New Veterinarian
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200">
              <Stethoscope className="w-6 h-6 text-blue-800" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Veterinarians</p>
              <p className="text-2xl font-bold text-gray-900">{veterinarians.length}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-100 to-emerald-200">
              <Clock className="w-6 h-6 text-emerald-800" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Now</p>
              <p className="text-2xl font-bold text-gray-900">
                {veterinarians.filter(v => v.isAvailable).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gradient-to-r from-amber-100 to-amber-200">
              <Star className="w-6 h-6 text-amber-800" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {veterinarians.length > 0 
                  ? (veterinarians.reduce((acc, v) => acc + (parseFloat(v.rating) || 0), 0) / veterinarians.length).toFixed(1)
                  : '0.0'
                }
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-100 to-purple-200">
              <DollarSign className="w-6 h-6 text-purple-800" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Consultation Fee</p>
              <p className="text-2xl font-bold text-gray-900">
                ${veterinarians.length > 0 
                  ? (veterinarians.reduce((acc, v) => acc + (parseFloat(v.consultationFee) || 0), 0) / veterinarians.length).toFixed(0)
                  : '0'
                }
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
                placeholder="Search veterinarians by name, specialization, or license number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
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
                setSelectedSpecialization('');
                fetchVeterinarians();
              }}
              className="px-6 py-3 text-gray-600 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Veterinarians Table */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Veterinarian
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Specialization
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Experience
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Consultation Fee
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Rating
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVeterinarians.map((veterinarian) => (
                <tr key={veterinarian.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-16 h-16 overflow-hidden bg-gray-100 rounded-xl">
                        {veterinarian.imageUrl ? (
                          <img
                            src={veterinarian.imageUrl}
                            alt={`Dr. Veterinarian #${veterinarian.id}`}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <User className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-4">
                       <div className="text-sm font-semibold text-gray-900">
                        {veterinarian.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {veterinarian.email}
                      </div>
                      <div className="text-xs text-gray-400">
                        {veterinarian.phoneNumber}
                      </div>
                        <div className="text-sm text-gray-500">
                          License: {veterinarian.licenseNumber}
                        </div>
                    
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getSpecializationBadgeColor(veterinarian.specialization)}`}>
                      {veterinarian.specialization || 'General Practice'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {veterinarian.yearsOfExperience || 0} years
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      ${veterinarian.consultationFee || '0.00'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">
                        {veterinarian.rating || 0} ({veterinarian.totalReviews || 0})
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(veterinarian.isAvailable)}`}>
                      {veterinarian.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEditVeterinarian(veterinarian)}
                        className="p-2 text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                        title="Edit Veterinarian"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteVeterinarian(veterinarian)}
                        className="p-2 text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        title="Delete Veterinarian"
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
        
        {filteredVeterinarians.length === 0 && (
          <div className="py-12 text-center">
            <Stethoscope className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No veterinarians found</p>
          </div>
        )}
      </div>

      {/* Veterinarian Modal */}
      {showModal && (
        <VeterinarianModal
          veterinarian={selectedVeterinarian}
          onClose={() => setShowModal(false)}
          onSave={handleSaveVeterinarian}
        />
      )}

      {/* Confirm Delete Modal */}
      {showConfirmModal && (
        <ConfirmModal
          title="Delete Veterinarian"
          message={`Are you sure you want to delete veterinarian with license "${veterinarianToDelete?.licenseNumber}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};

export default VeterinariansManagement;