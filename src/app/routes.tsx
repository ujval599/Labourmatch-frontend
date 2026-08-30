import { createBrowserRouter, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import MyBookings from "./pages/MyBookings";
import PremiumPlans from "./pages/PremiumPlans";
import AdminDashboard from "./pages/AdminDashboard";
import Root from "./Root";
import Home from "./pages/Home";
import ContractorListing from "./pages/ContractorListing";
import ContractorDetail from "./pages/ContractorDetail";
import ContractorProfile from "./pages/ContractorProfile";
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative"
        onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold">✕</button>
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Pehle Login Karo! 🔐</h2>
        <p className="text-center text-gray-500 mb-7 text-base leading-relaxed">
          Yeh feature use karne ke liye pehle login ya register karo. Sirf 1 minute lagega!
        </p>
        <div className="flex flex-col gap-3">
          <button onClick={onLogin}
            className="w-full py-3.5 rounded-xl font-semibold text-white text-base transition-all shadow-md hover:opacity-90 bg-primary">
            Login / Sign Up
          </button>
          <button onClick={onClose}
            className="w-full py-3 rounded-xl font-medium text-gray-500 text-sm border border-gray-200 hover:bg-gray-50">
            Baad Mein
          </button>
        </div>
      </div>
    </div>
  );
}

// ✅ Login Required Route — page dikh ta hai, 60 sec baad popup
function LoginRoute({ children }: { children: React.ReactNode }) {
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

  const handleLogin = () => { setShowModal(false); navigate("/auth"); };
  const handleClose = () => { setShowModal(false); navigate(-1); };

  if (!token) {
    return (
      <>
        {/* ✅ Page dikh ta hai — blur nahi */}
        {children}
        {showModal && <LoginRequiredModal onClose={handleClose} onLogin={handleLogin} />}
      </>
    );
  }

  return <>{children}</>;
}

// ✅ Admin Only Route — sirf admin dekh sakta hai
function AdminRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [showModal, setShowModal] = useState(false);

  let isAdmin = false;
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    isAdmin = user?.role === "ADMIN";
  } catch {}

  useEffect(() => {
    if (!token || !isAdmin) setShowModal(true);
  }, [token, isAdmin]);

  const handleLogin = () => { setShowModal(false); navigate("/auth"); };
  const handleClose = () => { setShowModal(false); navigate("/"); };

  if (!token || !isAdmin) {
    return (
      <>
        <div style={{ filter: "blur(3px)", pointerEvents: "none", minHeight: "80vh", background: "#f3f4f6" }} />
        {showModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-red-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied! 🚫</h2>
              <p className="text-gray-500 mb-7">Yeh page sirf Admin ke liye hai.</p>
              <div className="flex flex-col gap-3">
                {!token && (
                  <button onClick={handleLogin}
                    className="w-full py-3.5 rounded-xl font-semibold text-white bg-primary hover:opacity-90">
                    Admin Login
                  </button>
                )}
                <button onClick={handleClose}
                  className="w-full py-3 rounded-xl font-medium text-gray-500 text-sm border border-gray-200 hover:bg-gray-50">
                  Go to Home
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
}

// ✅ Global 60 sec popup — bina login ke koi bhi page pe
function GlobalSignupReminder() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!token) {
      const timer = setTimeout(() => setShowModal(true), 60000);
      return () => clearTimeout(timer);
    }
  }, [token]);

  if (!showModal || token) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
      onClick={() => setShowModal(false)}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative"
        onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setShowModal(false)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold">✕</button>
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">LabourMatch Join Karo! 🎉</h2>
        <p className="text-center text-gray-500 mb-7 text-base leading-relaxed">
          Hazaaron contractors aur customers already LabourMatch use kar rahe hain. Aap bhi join karo — bilkul FREE!
        </p>
        <div className="flex flex-col gap-3">
          <button onClick={() => { setShowModal(false); navigate("/auth"); }}
            className="w-full py-3.5 rounded-xl font-semibold text-white text-base transition-all shadow-md hover:opacity-90 bg-primary">
            Sign Up — Free Mein
          </button>
          <button onClick={() => setShowModal(false)}
            className="w-full py-3 rounded-xl font-medium text-gray-500 text-sm border border-gray-200 hover:bg-gray-50">
            Baad Mein
          </button>
        </div>
      </div>
    </div>
  );
}

// ✅ Root wrapper with global popup
function RootWithPopup() {
  return (
    <>
      <Root />
      <GlobalSignupReminder />
    </>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootWithPopup,
    children: [
      // ✅ PUBLIC — auth pages
      { path: "auth", Component: Auth },
      { path: "privacy-policy", Component: PrivacyPolicy },
      { path: "terms-and-conditions", Component: TermsAndConditions },
      { path: "forgot-password", Component: ForgotPassword },
      { path: "*", Component: NotFound },

      // ✅ PUBLIC — bina login ke sab dikh ta hai
      { index: true, Component: Home },
      { path: "contractors", Component: ContractorListing },
      { path: "contractor/:id", Component: ContractorDetail },
      { path: "about", Component: About },
      { path: "contact", Component: Contact },
      { path: "register-contractor", Component: RegisterContractor },
      { path: "premium", Component: PremiumPlans },

      // ✅ LOGIN REQUIRED — popup aayega
      { path: "my-bookings", element: <LoginRoute><MyBookings /></LoginRoute> },
      { path: "my-profile", element: <LoginRoute><ContractorProfile /></LoginRoute> },

      // ✅ ADMIN ONLY — sirf admin dekh sakta hai
      { path: "admin", element: <AdminRoute><AdminDashboard /></AdminRoute> },
    ],
  },
]);