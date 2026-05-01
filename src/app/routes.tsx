import { createBrowserRouter, Navigate, useNavigate } from "react-router";
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
import ContractorProfile from "./pages/ContractorProfile"; // ✅ New

// ✅ Login Required Modal Component
function LoginRequiredModal({ onClose, onLogin }: { onClose: () => void; onLogin: () => void }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
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
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative"
        style={{ animation: "fadeInScale 0.2s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-all font-bold text-lg"
        >
          ✕
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-primary" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
        </div>

        {/* Text */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Login Required 🔐
        </h2>
        <p className="text-center text-gray-500 mb-7 text-base leading-relaxed">
          You need to login or register first to access this page. It only takes a minute!
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onLogin}
            className="w-full py-3 rounded-xl font-semibold text-white text-base transition-all shadow-md hover:shadow-lg hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, var(--primary, #16a34a), var(--secondary, #0d9488))" }}
          >
            Login / Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

// ✅ Protected Route — Shows popup instead of redirecting
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!token) {
      setShowModal(true);
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
        <div
          style={{
            filter: showModal ? "blur(2px)" : "none",
            pointerEvents: "none",
            minHeight: "60vh",
            background: "linear-gradient(135deg, #f0fdf4, #f0fdfa)",
          }}
        />
        {showModal && (
          <LoginRequiredModal onClose={handleClose} onLogin={handleLogin} />
        )}
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
      // ✅ Public routes — accessible without login
      { path: "auth", Component: Auth },
      { path: "privacy-policy", Component: PrivacyPolicy },
      { path: "terms-and-conditions", Component: TermsAndConditions },
      { path: "forgot-password", Component: ForgotPassword },
      { path: "*", Component: NotFound },

      // ✅ Protected routes — login required (popup shown)
      {
        index: true,
        element: <ProtectedRoute><Home /></ProtectedRoute>,
      },
      {
        path: "contractors",
        element: <ProtectedRoute><ContractorListing /></ProtectedRoute>,
      },
      {
        path: "contractor/:id",
        element: <ProtectedRoute><ContractorDetail /></ProtectedRoute>,
      },
      {
        path: "register-contractor",
        element: <ProtectedRoute><RegisterContractor /></ProtectedRoute>,
      },
      {
        path: "my-bookings",
        element: <ProtectedRoute><MyBookings /></ProtectedRoute>,
      },
      {
        path: "premium",
        element: <ProtectedRoute><PremiumPlans /></ProtectedRoute>,
      },
      {
        path: "admin",
        element: <ProtectedRoute><AdminDashboard /></ProtectedRoute>,
      },
      {
        path: "about",
        element: <ProtectedRoute><About /></ProtectedRoute>,
      },
      {
        path: "contact",
        element: <ProtectedRoute><Contact /></ProtectedRoute>,
      },
      // ✅ Contractor Profile Page — NEW
      {
        path: "my-profile",
        element: <ProtectedRoute><ContractorProfile /></ProtectedRoute>,
      },
    ],
  },
]);