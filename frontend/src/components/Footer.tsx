import { Link } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";

export default function Footer() {
  return (
    <footer className="bg-dark text-light pt-12 pb-6 mt-16">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-start gap-8">
        <div>
          <h3 className="font-heading text-2xl text-primary mb-3">Petcare Clinic</h3>
          <p className="max-w-xs text-sm text-light/90 mb-4">
            Modern veterinary care for your beloved pets. Compassion. Expertise. Trust.
          </p>
          <div className="flex gap-4">
            <a href="https://facebook.com" aria-label="Facebook" className="hover:text-primary">
              <FacebookIcon />
            </a>
            <a href="https://instagram.com" aria-label="Instagram" className="hover:text-primary">
              <InstagramIcon />
            </a>
            <a href="https://twitter.com" aria-label="Twitter" className="hover:text-primary">
              <XIcon />
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-2 text-blue2">Quick Links</h4>
          <ul className="space-y-1 text-light/80">
            <li>
              <Link to="/appointments" className="hover:text-primary">Appointments</Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-primary">Products</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-primary">About</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary">Contact</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-2 text-blue2">Contact</h4>
          <p className="text-light/90 text-sm">1234 Happy Pets Rd<br />Pet City, PC 12345<br />Email: info@petcare.com</p>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 border-t border-light/20 pt-4 text-center text-xs text-light/70">
        &copy; {new Date().getFullYear()} Petcare Clinic. All rights reserved.
      </div>
    </footer>
  );
}