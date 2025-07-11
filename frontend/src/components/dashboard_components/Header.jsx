import React from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';

const Header = ({ setSidebarOpen }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-400 rounded-md lg:hidden hover:text-gray-600 hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
          
          <div className="ml-4 text-gray-600 lg:ml-0">
                   <div>
            <h1 className="mb-2 text-2xl font-bold">Welcome back, She-han! 👋</h1>
            <p className="text-xs text-primary-100">
              Here's what's happening with your pet care business today.
            </p>
          </div>
            
          </div>
        </div>
        
        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={16} />
            <input
              type="text"
              placeholder="Search..."
              className="py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          {/* Notifications */}
          <button className="p-2 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100">
            <Bell size={20} />
          </button>
          
          {/* User Profile */}
          <button className="flex items-center p-2 space-x-2 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100">
            <User size={20} />
            <span className="hidden text-sm font-medium text-gray-700 md:block">She-han</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;