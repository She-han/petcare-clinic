import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import UserProfile from './components/UserProfile';
import Home from "./pages/Home";
import Appointments from "./pages/Appointments";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import Checkout from './pages/Checkout';

function App() {
  console.log('App component rendering...');
  
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-light">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/products" element={<Products />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/checkout" element={<Checkout />} />
            
            
            {/* Admin Routes */}
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;