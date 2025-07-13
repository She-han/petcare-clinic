import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Box,
} from '@mui/material'
import {
  Pets as PetsIcon,
} from '@mui/icons-material'
import { 
  Home, 
  Users, 
  Package, 
  Stethoscope, 
  Calendar, 
  MessageSquare, 
  ShoppingCart,
  X,
  Settings,
  LogOut,
  Bell,
  Search,
  MoreHorizontal
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext'; // Import the auth context
import toast from 'react-hot-toast';

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const { user, logout } = useAuth(); // Get user and logout function
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home, color: 'from-violet-500 to-purple-600' },
    { name: 'Users', href: '/admin/users', icon: Users, color: 'from-blue-500 to-cyan-600' },
    { name: 'Products', href: '/admin/products', icon: Package, color: 'from-emerald-500 to-teal-600' },
    { name: 'Veterinarians', href: '/admin/veterinarians', icon: Stethoscope, color: 'from-rose-500 to-pink-600' },
    { name: 'Appointments', href: '/admin/appointments', icon: Calendar, color: 'from-orange-500 to-amber-600' },
    { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare, color: 'from-indigo-500 to-blue-600' },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart, color: 'from-green-500 to-emerald-600' },
    { name: 'Activity Log', href: '/admin/activity', icon: Calendar, color: 'from-orange-500 to-amber-600' },
  ];

  // Get display name and initials
  const getDisplayName = () => {
    if (!user) return 'Admin';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.firstName || user.username || 'Admin';
  };

  const getInitials = () => {
    if (!user) return 'A';
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    if (user.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'A';
  };

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function from context
      toast.success('Logged out successfully!');
      navigate('/'); // Navigate to home page
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 transition-all duration-300 bg-black/60 backdrop-blur-md lg:hidden"
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 h-screen left-0 z-50 w-80 bg-white/95 backdrop-blur-xl shadow-2xl transform transition-all duration-500 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
        border-r border-gray-200/50 h-screen
      `}>
        
        {/* Header Section */}
        <div className="relative h-20 overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
          
          {/* Header Content */}
          <div className="relative z-10 flex items-center justify-between h-full px-6">
            <div className="flex items-center space-x-3">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PetsIcon sx={{ fontSize: 40, color: '#2ECC71' }} />
              </Box>
              <div>
                <h1 className="text-xl font-bold text-white">Petcare Pro</h1>
                <p className="text-xs font-medium text-purple-200">Admin Console</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 transition-all duration-200 rounded-lg lg:hidden text-white/80 hover:text-white hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navigation.map((item, index) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/admin'}
              onMouseEnter={() => setHoveredItem(index)}
              onMouseLeave={() => setHoveredItem(null)}
              className={({ isActive }) => `
                group relative flex items-center px-3 py-2 text-sm font-normal rounded-2xl transition-all duration-300 overflow-hidden
                ${isActive 
                  ? 'bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 shadow-lg shadow-violet-500/20' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
              onClick={() => setSidebarOpen(false)}
            >
              {({ isActive }) => (
                <>
                  {/* Active background effect */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-2xl"></div>
                  )}
                  
                  {/* Hover effect */}
                  {hoveredItem === index && !isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-100 rounded-2xl"></div>
                  )}
                  
                  {/* Icon container */}
                  <div className={`
                    relative z-10 flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300
                    ${isActive 
                      ? `bg-gradient-to-br ${item.color} shadow-lg shadow-violet-500/30` 
                      : hoveredItem === index
                        ? `bg-gradient-to-br ${item.color} shadow-md`
                        : 'bg-gray-100 text-gray-500'
                    }
                  `}>
                    <item.icon 
                      size={18} 
                      className={isActive || hoveredItem === index ? 'text-white' : 'text-gray-600'} 
                    />
                  </div>
                  
                  {/* Text */}
                  <span className="relative z-10 ml-4 font-semibold tracking-wide">
                    {item.name}
                  </span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute w-2 h-2 rounded-full right-3 bg-gradient-to-br from-violet-500 to-purple-600"></div>
                  )}
                  
                  {/* Ripple effect */}
                  {hoveredItem === index && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent animate-ping"></div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center p-3 space-x-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
            <div className="relative">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="object-cover w-12 h-12 rounded-full shadow-lg"
                />
              ) : (
                <div className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg bg-gradient-to-br from-violet-500 to-purple-600">
                  <span className="text-lg font-bold text-white">{getInitials()}</span>
                </div>
              )}
              <div className="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full -top-1 -right-1"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{getDisplayName()}</p>
             
              <p className="text-xs text-gray-400">Online</p>
            </div>
            <button className="p-2 text-gray-400 transition-all duration-200 rounded-lg hover:text-gray-600 hover:bg-white/50">
              <MoreHorizontal size={16} />
            </button>
          </div>
          
          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="w-full mt-3 flex items-center justify-center px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-200 hover:shadow-md"
          >
            <LogOut size={16} className="mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;