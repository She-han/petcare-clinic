import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import UserProfile from './components/UserProfile';
import Home from "./pages/Home";
import Appointments from "./pages/Appointments";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        
        <div className="min-h-screen pt-20 bg-light">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/products" element={<Products />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/profile" element={<UserProfile />} />
            
          </Routes>
        </div>
        
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;