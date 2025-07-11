import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Appointments from "./pages/Appointments";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      
      <div className="min-h-screen pt-20 bg-light">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          {/* Admin routes - note the /* at the end */}
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </div>
      
    </BrowserRouter>
  );
}

export default App;