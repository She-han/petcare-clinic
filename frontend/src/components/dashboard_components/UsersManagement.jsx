import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Search, Users, UserCheck, Shield, Clock, User } from 'lucide-react';
import toast from 'react-hot-toast';
import apiService from '../../services/api';
import UserModal from './UserModal';
import ConfirmModal from './ConfirmModal';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [selectedRole, setSelectedRole] = useState('USER'); // Default to USER

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.users.getAll();
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchUsers();
      return;
    }
    
    try {
      setLoading(true);
      const response = await apiService.users.search(searchTerm);
      setUsers(response.data);
    } catch (error) {
      toast.error('Search failed');
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };



  // Handle edit user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // Handle delete user
  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowConfirmModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      await apiService.users.delete(userToDelete.id);
      toast.success('User deleted successfully');
      fetchUsers();
      setShowConfirmModal(false);
      setUserToDelete(null);
    } catch (error) {
      toast.error('Failed to delete user');
      console.error('Error deleting user:', error);
    }
  };

  // Handle save user (update only)
  const handleSaveUser = async (userData) => {
    try {
      if (selectedUser) {
        // Update existing user
        await apiService.users.update(selectedUser.id, userData);
        toast.success('User updated successfully');
        setShowModal(false);
        fetchUsers();
      }
    } catch (error) {
      toast.error('Failed to update user');
      console.error('Error saving user:', error);
    }
  };

  // Filter users by role (exclude veterinarians from the main list)
  const filteredUsers = selectedRole 
    ? users.filter(user => user.role === selectedRole && user.role !== 'VETERINARIAN')
    : users.filter(user => user.role !== 'VETERINARIAN');

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'VETERINARIAN':
        return 'bg-blue-100 text-blue-800';
      case 'USER':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (isActive) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
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
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-sm text-gray-600">Manage all users and administrators in the system</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.isActive).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Administrators</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'ADMIN').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recently Joined</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => {
                  const createdDate = new Date(u.createdAt);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return createdDate >= weekAgo;
                }).length}
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
                placeholder="Search users by name, email, or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Roles</option>
              <option value="USER">Regular Users</option>
              <option value="ADMIN">Administrators</option>
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
                setSelectedRole('');
                fetchUsers();
              }}
              className="px-6 py-3 text-gray-600 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  User
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Contact Information
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Location
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Role
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Last Login
                </th>
                <th className="px-6 py-4 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-16 h-16 overflow-hidden bg-gray-100 rounded-xl">
                        {user.profileImageUrl ? (
                          <img
                            src={user.profileImageUrl}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <User className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{user.username}
                        </div>
                        <div className="text-xs text-gray-400">
                          ID: #{user.id}
                        </div>
                        {user.dateOfBirth && (
                          <div className="text-xs text-gray-400">
                            DOB: {new Date(user.dateOfBirth).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.phone || 'No phone'}</div>
                    <div className="text-xs text-gray-400">
                      {user.emailVerified ? (
                        <span className="text-green-600">✓ Email verified</span>
                      ) : (
                        <span className="text-red-600">✗ Email not verified</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.city && user.state ? `${user.city}, ${user.state}` : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.country || 'N/A'}
                    </div>
                    {user.zipCode && (
                      <div className="text-xs text-gray-400">{user.zipCode}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(user.isActive)}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </div>
                    <div className="text-xs text-gray-500">
                      Created: {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-2 text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                        title="Edit User"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="p-2 text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        title="Delete User"
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
        
        {filteredUsers.length === 0 && (
          <div className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>

      {/* User Modal */}
      {showModal && (
        <UserModal
          user={selectedUser}
          onClose={() => setShowModal(false)}
          onSave={handleSaveUser}
        />
      )}

      {/* Confirm Delete Modal */}
      {showConfirmModal && (
        <ConfirmModal
          title="Delete User"
          message={`Are you sure you want to delete ${userToDelete?.firstName} ${userToDelete?.lastName} (@${userToDelete?.username})? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};

export default UsersManagement;