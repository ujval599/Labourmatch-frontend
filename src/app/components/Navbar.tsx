// src/app/components/Navbar.tsx
import { Link, useNavigate } from "react-router";
import { Menu, X, LogOut, User, HardHat, Users, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { useAuth } from "../../context/AuthContext";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isContractor, isAdmin, selectedRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const commonLinks = [
    { to: "/", label: "Home" },
    { to: "/contractors", label: "Find Contractors" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact" },
  ];

  const contractorLinks = [
    { to: "/register-contractor", label: "Become a Contractor" },
    { to: "/premium", label: "Premium Plans" },
  ];

  const showContractorLinks = isContractor || isAdmin;

  const navLinks = showContractorLinks
    ? [...commonLinks, ...contractorLinks]
    : commonLinks;

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all group-hover:scale-105">
              <span className="text-white font-bold text-xl">LM</span>
            </div>
            <span className="font-bold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              LabourMatch
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
                className="text-foreground hover:text-primary transition-colors font-medium text-sm">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                {/* Role Badge */}
                {selectedRole && (
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    isAdmin ? "bg-purple-100 text-purple-700" :
                    isContractor ? "bg-amber-100 text-amber-700" :
                    "bg-blue-100 text-blue-700"
                  }`}>
                    {isAdmin ? "Admin" : isContractor
                      ? <><HardHat className="h-3 w-3" /> Contractor</>
                      : <><Users className="h-3 w-3" /> User</>}
                  </div>
                )}

                {/* ✅ User Badge — Contractor ho to profile pe le jao */}
                <div
                  onClick={() => isContractor ? navigate("/my-profile") : navigate("/my-bookings")}
                  className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-3 py-2 rounded-xl cursor-pointer hover:bg-orange-100 transition-all"
                  title={isContractor ? "View My Profile" : "My Bookings"}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 max-w-[120px] truncate">
                    {user.name}
                  </span>
                </div>

              

                

                {/* Logout */}
                <Button onClick={handleLogout} variant="ghost"
                  className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 font-medium">
                  <LogOut className="h-4 w-4" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth"><Button variant="ghost" className="font-medium">Login</Button></Link>
                <Link to="/auth"><Button className="shadow-md hover:shadow-lg transition-all">Sign Up</Button></Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 space-y-4 border-t border-border animate-in slide-in-from-top-5">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
                className="block py-3 text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </Link>
            ))}

            {/* ✅ Mobile — Contractor Profile link */}
            {isContractor && (
              <Link to="/my-profile"
                className="block py-3 text-amber-600 hover:text-amber-700 transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}>
                🏗️ My Profile
              </Link>
            )}

            <div className="flex flex-col space-y-3 pt-4 border-t border-border">
              {user ? (
                <>
                  <div
                    onClick={() => { isContractor ? navigate("/my-profile") : navigate("/my-bookings"); setMobileMenuOpen(false); }}
                    className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-3 py-2.5 rounded-xl cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">
                        {isAdmin ? "Admin" : isContractor ? "Contractor" : "User"}
                      </p>
                      <p className="text-sm font-semibold text-gray-700">{user.name}</p>
                    </div>
                  </div>
                  <Button onClick={handleLogout} variant="outline"
                    className="w-full flex items-center justify-center gap-2 text-red-500 border-red-200 hover:bg-red-50">
                    <LogOut className="h-4 w-4" /> Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full shadow-md">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}