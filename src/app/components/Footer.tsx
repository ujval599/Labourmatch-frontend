import { Link } from "react-router";
import { Mail, Phone, MapPin } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function Footer() {
  const { isContractor, isAdmin, user } = useAuth();

  // ✅ Sirf contractor, admin, ya non-logged-in ko dikhao
  const showBecomeContractor = !user || isContractor || isAdmin;

  return (
    <footer className="bg-gray-50 border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">LM</span>
              </div>
              <span className="font-bold text-xl">LabourMatch</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Connecting you with trusted labour contractors for all your construction and daily work needs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/contractors" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Find Contractors
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              {/* ✅ Sirf contractor/admin/not-logged-in ko dikhao */}
              {showBecomeContractor && (
                <li>
                  <Link to="/register-contractor" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    Become a Contractor
                  </Link>
                </li>
              )}
              <li>
                <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground text-sm">Construction</li>
              <li className="text-muted-foreground text-sm">Shifting & Moving</li>
              <li className="text-muted-foreground text-sm">Loading/Unloading</li>
              <li className="text-muted-foreground text-sm">Daily Helpers</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-muted-foreground text-sm">
                <Phone className="h-4 w-4" />
                <span>+91 8128860779</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground text-sm">
                <Mail className="h-4 w-4" />
                <span>labourmatch91@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4" />
                <span>India, Ahmedabad</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2026 LabourMatch. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}