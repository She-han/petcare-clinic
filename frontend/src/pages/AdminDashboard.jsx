import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from '..components/dashboard_components/Header';
import Dashboard from './Dashboard';
import UsersManagement from './UsersManagement';
import ProductsManagement from './ProductsManagement';
import VeterinariansManagement from './VeterinariansManagement';
import AppointmentsManagement from './AppointmentsManagement';
import TestimonialsManagement from './TestimonialsManagement';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header setSidebarOpen={setSidebarOpen} />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container px-6 py-8 mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<UsersManagement />} />
              <Route path="/products" element={<ProductsManagement />} />
              <Route path="/veterinarians" element={<VeterinariansManagement />} />
              <Route path="/appointments" element={<AppointmentsManagement />} />
              <Route path="/testimonials" element={<TestimonialsManagement />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;