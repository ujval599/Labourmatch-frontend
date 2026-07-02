import { Link } from "react-router";
import { Phone, Mail, MapPin, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">LM</span>
              </div>
              <span className="font-bold text-xl text-gray-900">LabourMatch</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Connecting you with trusted labour contractors for all your construction and daily work needs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/contractors", label: "Find Services" },
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact Us" },
                { to: "/register-contractor", label: "Register Your Services", highlight: true },
                { to: "/privacy-policy", label: "Privacy Policy" },
                { to: "/terms-and-conditions", label: "Terms & Conditions" },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to}
                    className={`text-sm transition-colors ${link.highlight ? "text-primary font-medium hover:text-primary/80" : "text-gray-500 hover:text-primary"}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
            <ul className="space-y-2">
              {["Construction", "Shifting & Moving", "Loading/Unloading", "Daily Helpers"].map(cat => (
                <li key={cat}>
                  <Link to="/contractors" className="text-sm text-gray-500 hover:text-primary transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                +91 8128860779
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                labourmatch91@gmail.com
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                India, Ahmedabad
              </li>
            </ul>

            {/* ✅ FIX: Social icons - contact ke niche, ek line mein */}
            <div className="flex items-center gap-3 mt-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-primary hover:text-white flex items-center justify-center text-gray-500 transition-all">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-primary hover:text-white flex items-center justify-center text-gray-500 transition-all">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 mt-10 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2026 LabourMatch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}