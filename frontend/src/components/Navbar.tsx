import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PetsIcon from "@mui/icons-material/Pets";
import clsx from "clsx";

const navLinks = [
  { name: "Appointments", to: "/appointments" },
  { name: "Products", to: "/products" },
  { name: "About", to: "/about" },
  { name: "Contact", to: "/contact" },
];

function Navbar() {
  const [show, setShow] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currScroll = window.scrollY;
          setShow(currScroll < lastScroll || currScroll < 80);
          setLastScroll(currScroll);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  return (
    <nav
      className={clsx(
        "fixed top-0 left-0 w-full bg-white/90 shadow-lg backdrop-blur-sm z-50 transition-transform duration-300",
        show ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <PetsIcon sx={{ color: "#2ECC71", fontSize: 32 }} />
          <span className="text-xl font-heading font-bold text-accent tracking-tight">
            PAWs
          </span>
        </Link>
        <div className="flex gap-6">
          {navLinks.map(link => (
            <Link
              key={link.name}
              to={link.to}
              className={clsx(
                "font-body text-lg transition-colors",
                location.pathname === link.to
                  ? "text-primary font-semibold"
                  : "text-dark hover:text-blue2"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;