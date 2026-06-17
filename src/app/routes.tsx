import { createBrowserRouter, Navigate, useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
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
import ContractorProfile from "./pages/ContractorProfile";

// ✅ Login Required Modal
function LoginRequiredModal({ onClose, onLogin, countdown }: {
  onClose: () => void;
  onLogin: () => void;
  countdown?: number;
}) {
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
      style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative"
        style={{ animation: "fadeInScale 0.3s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.92) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes countdown {
            from { stroke-dashoffset: 0; }
            to { stroke-dashoffset: 126; }
          }
        `}</style>

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: "linear-gradient(135deg, #16a34a, #0d9488)" }}>
            <span className="text-white font-black text-3xl">LM</span>
          </div>
        </div>

        {/* Text */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Join LabourMatch! 
        </h2>
        <p className="text-center text-gray-500 mb-2 text-sm leading-relaxed">
          You’ve seen our platform — now log in to get full access!
        </p>
        <p className="text-center text-gray-400 mb-6 text-xs">
         Find verified contractors • Book instantly • Chat directly.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onLogin}
            className="w-full py-3.5 rounded-xl font-bold text-white text-base transition-all shadow-md hover:shadow-lg hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #16a34a, #0d9488)" }}
          >
             Login / Sign Up 
          </button>
        </div>

        
      </div>
    </div>
  );
}

// ✅ 20 Second Timer Hook — shared across all pages
const TIMER_KEY = "lm_guest_start";
const SHOWN_KEY = "lm_popup_shown";
const DISMISSED_KEY = "lm_popup_dismissed";

function useGuestTimer() {
  const [showPopup, setShowPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) return; // Logged in — no timer needed

    // Already dismissed this session
    const dismissed = sessionStorage.getItem(DISMISSED_KEY);
    if (dismissed) return;

    // Already shown popup
    const shown = sessionStorage.getItem(SHOWN_KEY);
    if (shown) {
      setShowPopup(true);
      return;
    }

    // Start or resume timer
    const startTime = sessionStorage.getItem(TIMER_KEY);
    if (!startTime) {
      sessionStorage.setItem(TIMER_KEY, Date.now().toString());
    }

    intervalRef.current = setInterval(() => {
      const start = parseInt(sessionStorage.getItem(TIMER_KEY) || Date.now().toString());
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const remaining = Math.max(0, 20 - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(intervalRef.current!);
        sessionStorage.setItem(SHOWN_KEY, "true");
        setShowPopup(true);
      }
    }, 500);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(DISMISSED_KEY, "true");
    setShowPopup(false);
  };

  return { showPopup, timeLeft, dismiss };
}

// ✅ Guest Wrapper — 20 sec timer, then popup
function GuestTimerWrapper({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { showPopup, timeLeft, dismiss } = useGuestTimer();

  const handleLogin = () => {
    dismiss();
    navigate("/auth");
  };

  // Logged in — show content directly
  if (token) return <>{children}</>;

  return (
    <>
      {/* Content always visible */}
      <div style={{ filter: showPopup ? "blur(3px)" : "none", transition: "filter 0.3s" }}>
        {children}
      </div>

      {/* Popup after 20 seconds */}
      {showPopup && (
        <LoginRequiredModal
          onClose={dismiss}
          onLogin={handleLogin}
        />
      )}
    </>
  );
}

// ✅ Protected Route — Login required immediately (admin, profile, bookings)
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!token) setShowModal(true);
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
        <div style={{
          filter: showModal ? "blur(2px)" : "none",
          pointerEvents: "none",
          minHeight: "60vh",
          background: "linear-gradient(135deg, #f0fdf4, #f0fdfa)",
        }} />
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
      // ✅ Public routes — no timer
      { path: "auth", Component: Auth },
      { path: "privacy-policy", Component: PrivacyPolicy },
      { path: "terms-and-conditions", Component: TermsAndConditions },
      { path: "forgot-password", Component: ForgotPassword },
      { path: "*", Component: NotFound },

      // ✅ Guest routes — 20 sec free, then popup
      {
        index: true,
        element: <GuestTimerWrapper><Home /></GuestTimerWrapper>,
      },
      {
        path: "contractors",
        element: <GuestTimerWrapper><ContractorListing /></GuestTimerWrapper>,
      },
      {
        path: "contractor/:id",
        element: <GuestTimerWrapper><ContractorDetail /></GuestTimerWrapper>,
      },
      {
        path: "register-contractor",
        element: <GuestTimerWrapper><RegisterContractor /></GuestTimerWrapper>,
      },
      {
        path: "about",
        element: <GuestTimerWrapper><About /></GuestTimerWrapper>,
      },
      {
        path: "contact",
        element: <GuestTimerWrapper><Contact /></GuestTimerWrapper>,
      },

      // ✅ Protected routes — login required immediately
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
        path: "my-profile",
        element: <ProtectedRoute><ContractorProfile /></ProtectedRoute>,
      },
    ],
  },
]);