import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/dashboard_components/Sidebar';
import Header from '../components/dashboard_components/Header';
import Dashboard from '../components/dashboard_components/Dashboard';
import UsersManagement from '../components/dashboard_components/UsersManagement';
import ProductsManagement from '../components/dashboard_components/ProductsManagement';
// Import other components
// import VeterinariansManagement from '../components/dashboard_components/VeterinariansManagement';
// import AppointmentsManagement from '../components/dashboard_components/AppointmentsManagement';
// import TestimonialsManagement from '../components/dashboard_components/TestimonialsManagement';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="fixed inset-0 flex h-screen bg-gray-100 ">
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
              {/* These paths are now relative to /admin */}
              <Route index element={<Dashboard />} />
              <Route path="users" element={<UsersManagement />} />
              <Route path="products" element={<ProductsManagement />} />
              {/* Uncomment when components are ready */}
              {/* <Route path="veterinarians" element={<VeterinariansManagement />} />
              <Route path="appointments" element={<AppointmentsManagement />} />
              <Route path="testimonials" element={<TestimonialsManagement />} /> */}
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;