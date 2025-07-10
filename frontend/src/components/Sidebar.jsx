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
  X
} from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Veterinarians', href: '/veterinarians', icon: Stethoscope },
    { name: 'Appointments', href: '/appointments', icon: Calendar },
    { name: 'Testimonials', href: '/testimonials', icon: MessageSquare },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
  ];

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-primary to-secondary">
          <h1 className="text-xl font-bold text-white">PetCare Admin</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white lg:hidden hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="mt-8">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors ${
                  isActive ? 'bg-primary bg-opacity-10 text-primary border-r-4 border-primary' : ''
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} className="mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;