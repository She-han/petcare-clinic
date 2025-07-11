import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Package, 
  Stethoscope, 
  Calendar, 
  MessageSquare, 
  ShoppingCart,
  X,
  ChevronRight
} from 'lucide-react';

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Veterinarians', href: '/admin/veterinarians', icon: Stethoscope },
    { name: 'Appointments', href: '/admin/appointments', icon: Calendar },
    { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  ];

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 transition-opacity duration-300 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-all duration-300 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
        border-r border-gray-100
      `}>
        {/* Header */}
        <div className="relative flex items-center justify-between h-20 px-6 overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-800/90"></div>
          <div className="relative z-10">
            <h1 className="text-2xl font-bold tracking-tight text-white">PetCare</h1>
            <p className="text-sm font-medium text-blue-100">Admin Panel</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="relative z-10 p-2 text-blue-100 transition-all duration-200 rounded-lg lg:hidden hover:text-white hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 mt-8 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/admin'}
              className={({ isActive }) => `
                group flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 relative
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
              onClick={() => setSidebarOpen(false)}
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute top-0 bottom-0 left-0 w-1 rounded-r-full bg-gradient-to-b from-blue-500 to-indigo-600"></div>
                  )}
                  
                  {/* Icon */}
                  <div className={`
                    p-2 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-400 group-hover:text-gray-600 group-hover:bg-gray-100'
                    }
                  `}>
                    <item.icon size={18} />
                  </div>
                  
                  {/* Text */}
                  <span className="ml-3 font-medium tracking-wide">
                    {item.name}
                  </span>
                  
                  {/* Chevron for active state */}
                  {isActive && (
                    <ChevronRight size={16} className="ml-auto text-blue-500" />
                  )}
                  
                  {/* Hover effect */}
                  {!isActive && (
                    <div className="ml-auto transition-opacity duration-200 opacity-0 group-hover:opacity-100">
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
              <span className="text-sm font-bold text-white">S</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">She-han</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;