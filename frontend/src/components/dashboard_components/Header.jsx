import React from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';

const Header = ({ setSidebarOpen }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
          
          <div className="ml-4 lg:ml-0">
            <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
            <p className="text-sm text-gray-600">Welcome back, She-han!</p>
          </div>
        </div>
        
        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
            <Bell size={20} />
          </button>
          
          {/* User Profile */}
          <button className="flex items-center space-x-2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
            <User size={20} />
            <span className="hidden md:block text-sm font-medium text-gray-700">She-han</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;