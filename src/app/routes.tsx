import { createBrowserRouter, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import MyBookings from "./pages/MyBookings";
import PremiumPlans from "./pages/PremiumPlans";
import AdminDashboard from "./pages/AdminDashboard";
import Root from "./Root";
import Home from "./pages/Home";
import ContractorListing from "./pages/ContractorListing";
import ContractorDetail from "./pages/ContractorDetail";
import RegisterContractor from "./pages/RegisterContractor";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/Privacypolicy";
import TermsAndConditions from "./pages/Termsandconditions";
import ForgotPassword from "./pages/ForgotPassword";

// ✅ Login Required Popup
function LoginRequiredModal({ onClose, onLogin }: { onClose: () => void; onLogin: () => void }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-all font-bold"
        >
          ✕
        </button>
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-primary" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Pehle Login Karo! 🔐
        </h2>
        <p className="text-center text-gray-500 mb-7 text-base leading-relaxed">
          Yeh page dekhne ke liye pehle login ya register karo. Sirf 1 minute lagega!
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onLogin}
            className="w-full py-3.5 rounded-xl font-semibold text-white text-base transition-all shadow-md hover:opacity-90 active:scale-95 bg-primary"
          >
            Login / Sign Up
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-medium text-gray-500 text-sm border border-gray-200 hover:bg-gray-50 transition-all"
          >
            Baad Mein
          </button>
        </div>
      </div>
    </div>
  );
}

// ✅ Protected Route — popup dikhao, redirect nahi
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!token) {
      // ✅ 60 seconds baad popup dikhao
      const timer = setTimeout(() => setShowModal(true), 60000);
      return () => clearTimeout(timer);
    }
  }, [token]);

  const handleLogin = () => {
    setShowModal(false);
    navigate("/auth");
  };

  const handleClose = () => {
    setShowModal(false);
    navigate(-1);
  };

  if (!token) {
    return (
      <>
        <div style={{ filter: "blur(3px)", pointerEvents: "none", minHeight: "80vh", background: "#f3f4f6" }} />
        {showModal && <LoginRequiredModal onClose={handleClose} onLogin={handleLogin} />}
      </>
    );
  }

  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      // ✅ Public — bina login ke
      { path: "auth", Component: Auth },
      { path: "privacy-policy", Component: PrivacyPolicy },
      { path: "terms-and-conditions", Component: TermsAndConditions },
      { path: "forgot-password", Component: ForgotPassword },
      { path: "*", Component: NotFound },

      // ✅ Protected — popup aayega
      { index: true, element: <ProtectedRoute><Home /></ProtectedRoute> },
      { path: "contractors", element: <ProtectedRoute><ContractorListing /></ProtectedRoute> },
      { path: "contractor/:id", element: <ProtectedRoute><ContractorDetail /></ProtectedRoute> },
      { path: "register-contractor", element: <ProtectedRoute><RegisterContractor /></ProtectedRoute> },
      { path: "my-bookings", element: <ProtectedRoute><MyBookings /></ProtectedRoute> },
      { path: "premium", element: <ProtectedRoute><PremiumPlans /></ProtectedRoute> },
      { path: "admin", element: <ProtectedRoute><AdminDashboard /></ProtectedRoute> },
      { path: "about", element: <ProtectedRoute><About /></ProtectedRoute> },
      { path: "contact", element: <ProtectedRoute><Contact /></ProtectedRoute> },
      { path: "my-profile", element: <ProtectedRoute><div>My Profile</div></ProtectedRoute> },
    ],
  },
]);