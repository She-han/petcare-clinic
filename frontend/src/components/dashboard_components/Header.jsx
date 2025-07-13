import React from 'react';
import { Menu, Bell, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ setSidebarOpen }) => {
  const { user, isAuthenticated, logout } = useAuth();

  // Get the display name - use first name or username as fallback
  const getDisplayName = () => {
    if (!user) return 'Admin';
    return user.firstName || user.username || 'Admin';
  };

    const getCurrentDateTime = () => {
    const now = new Date();
    return {
      date: now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const { date, time } = getCurrentDateTime();
  
  const getFullName = () => {
    if (!user) return 'Admin';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.username || 'Admin';
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/'; // Redirect to home page
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
  <div className="flex items-center justify-between px-6 py-0 md:py-2">
    {/* Left side */}
    <div className="flex items-center flex-1">
      <div className="px-2 py-4 mt-2 text-gray-600 md:mt-0 md:ml-4 lg:ml-0 lg:mb-2 md:p-0">
        <div>
          <h1 className="mb-2 text-xl font-bold md:text-2xl ">
            Welcome back, {getDisplayName()}! 👋
          </h1>
          <p className="hidden text-xs text-primary-100 md:block">
            Here's what's happening with your pet care business today.
          </p>
        </div>
      </div>
    </div>
    
    {/* Right side */}
    <div className="flex items-center space-x-4">
      {/* Date and Time - Only visible on medium screens and up */}
      <div className="hidden mt-4 text-right text-gray-500 md:block md:mt-0">
        <p className="text-xl font-semibold">{date}</p>
        <p className="text-primary-100">{time}</p>
      </div>
      
      {/* Menu button - Only visible on mobile/tablet */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="p-2 text-gray-400 transition-colors duration-200 rounded-md lg:hidden hover:text-gray-600 hover:bg-gray-100"
      >
        <Menu size={30} />
      </button>
    </div>
  </div>
</header>
  );
};

export default Header;