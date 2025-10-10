import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Calendar, Clock, User, Phone, Mail, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import apiService from '../../services/api';
import AppointmentModal from './AppointmentModal';
import ConfirmModal from './ConfirmModal';

const AppointmentsManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [veterinarians, setVeterinarians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [statusOptions] = useState(['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);

  // Fetch appointments and veterinarians from API
  useEffect(() => {
    console.log('AppointmentsManagement mounted, fetching data...');
    fetchAppointments();
    fetchVeterinarians();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      console.log('Fetching appointments...');
      const response = await apiService.appointments.getAll();
      console.log('Appointments response:', response);
      setAppointments(response.data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to fetch appointments');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchVeterinarians = async () => {
    try {
      console.log('Fetching veterinarians...');
      const response = await apiService.veterinarians.getAll();
      console.log('Veterinarians response:', response);
      setVeterinarians(response.data || []);
    } catch (error) {
      console.error('Error fetching veterinarians:', error);
      setVeterinarians([]);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
    
    if (!searchTerm.trim()) {
      fetchAppointments();
      return;
    }
    
    const filtered = appointments.filter(appointment => 
      appointment.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.petName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.reasonForVisit?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    console.log('Filtered appointments:', filtered);
    setAppointments(filtered);
  };

  // Handle create appointment
  const handleCreateAppointment = () => {
    console.log('Create appointment clicked');
    setSelectedAppointment(null);
    setShowModal(true);
  };

  // Handle edit appointment
  const handleEditAppointment = (appointment) => {
    console.log('Edit appointment clicked:', appointment);
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  // Handle delete appointment
  const handleDeleteAppointment = (appointment) => {
    console.log('Delete appointment clicked:', appointment);
    setAppointmentToDelete(appointment);
    setShowConfirmModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      await apiService.appointments.delete(appointmentToDelete.id);
      toast.success('Appointment deleted successfully');
      fetchAppointments();
      setShowConfirmModal(false);
      setAppointmentToDelete(null);
    } catch (error) {
      toast.error('Failed to delete appointment');
      console.error('Error deleting appointment:', error);
    }
  };

  // Handle save appointment (create or update)
  const handleSaveAppointment = async (appointmentData) => {
    try {
      if (selectedAppointment) {
        // Update existing appointment
        await apiService.appointments.update(selectedAppointment.id, appointmentData);
        toast.success('Appointment updated successfully');
      } else {
        // Create new appointment
        await apiService.appointments.create(appointmentData);
        toast.success('Appointment created successfully');
      }
      setShowModal(false);
      fetchAppointments();
    } catch (error) {
      toast.error(selectedAppointment ? 'Failed to update appointment' : 'Failed to create appointment');
      console.error('Error saving appointment:', error);
    }
  };

  // Filter appointments
  const filteredAppointments = appointments.filter(appointment => {
    const matchesStatus = selectedStatus ? appointment.status === selectedStatus : true;
    const matchesDate = selectedDate ? appointment.appointmentDate === selectedDate : true;
    return matchesStatus && matchesDate;
  });

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'NO_SHOW':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get veterinarian name by ID
  const getVeterinarianName = (veterinarianId) => {
    const vet = veterinarians.find(v => v.id === veterinarianId);
    return vet ? vet.fullName : 'Unknown Veterinarian';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  console.log('Rendering AppointmentsManagement, loading:', loading, 'appointments:', appointments.length);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-violet-500"></div>
        <p className="ml-4 text-gray-600">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments Management</h1>
          
        </div>
        <button
          onClick={handleCreateAppointment}
          className="inline-flex items-center px-4 py-2 text-white transition-colors rounded-lg shadow-lg bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-violet-500/25"
        >
          <Plus size={16} className="mr-2" />
          Add New Appointment
        </button>
      </div>


      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(a => a.status === 'SCHEDULED').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(a => a.status === 'COMPLETED').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(a => a.appointmentDate === new Date().toISOString().split('T')[0]).length}
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
                placeholder="Search appointments by client name, pet name, or reason..."
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
              <option value="">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status.replace('_', ' ')}</option>
              ))}
            </select>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
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
                setSelectedDate('');
                fetchAppointments();
              }}
              className="px-6 py-3 text-gray-600 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Appointments Table */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Client & Pet
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Veterinarian
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Reason
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Contact
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {appointment.clientName || 'N/A'}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Heart className="w-4 h-4 mr-1" />
                          {appointment.petName || 'N/A'} ({appointment.petType || 'N/A'})
                        </div>
                        {appointment.petAge && (
                          <div className="text-xs text-gray-400">
                            Age: {appointment.petAge}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {getVeterinarianName(appointment.veterinarianId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                      {formatDate(appointment.appointmentDate)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1 text-gray-400" />
                      {formatTime(appointment.appointmentTime)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs text-sm text-gray-900 truncate">
                      {appointment.reasonForVisit || 'N/A'}
                    </div>
                    {appointment.additionalNotes && (
                      <div className="max-w-xs text-xs text-gray-500 truncate">
                        Notes: {appointment.additionalNotes}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(appointment.status)}`}>
                      {appointment.status?.replace('_', ' ') || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Mail className="w-4 h-4 mr-1 text-gray-400" />
                      <span className="truncate">{appointment.clientEmail || 'N/A'}</span>
                    </div>
                    {appointment.clientPhone && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="w-4 h-4 mr-1 text-gray-400" />
                        {appointment.clientPhone}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEditAppointment(appointment)}
                        className="p-2 text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                        title="Edit Appointment"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteAppointment(appointment)}
                        className="p-2 text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        title="Delete Appointment"
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
        
        {filteredAppointments.length === 0 && (
          <div className="py-12 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No appointments found</p>
            <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Appointment Modal */}
      {showModal && (
        <AppointmentModal
          appointment={selectedAppointment}
          veterinarians={veterinarians}
          onClose={() => setShowModal(false)}
          onSave={handleSaveAppointment}
        />
      )}

      {/* Confirm Delete Modal */}
      {showConfirmModal && (
        <ConfirmModal
          title="Delete Appointment"
          message={`Are you sure you want to delete the appointment for "${appointmentToDelete?.clientName}" with pet "${appointmentToDelete?.petName}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};

export default AppointmentsManagement;