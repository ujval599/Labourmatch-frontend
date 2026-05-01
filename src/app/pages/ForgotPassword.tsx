// src/app/pages/ForgotPassword.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Mail, Shield, Lock, Loader2, CheckCircle2, ArrowLeft, Eye, EyeOff } from "lucide-react";

const BASE_URL = "http://localhost:5000";

type Step = "email" | "otp" | "password" | "done";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Step 1: Email submit karo — OTP bhejo
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(data.message);
        if (data.otp) setOtp(data.otp); // Dev mode
        setStep("otp");
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch { setError("Connection failed. Please try again."); }
    finally { setLoading(false); }
  };

  // Step 2: OTP verify karo
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) { setError("Please enter 6 digit OTP."); return; }
    setError("");
    setStep("password");
  };

  // Step 3: Naya password set karo
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (newPassword !== confirmPassword) { setError("Passwords don't match."); return; }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("done");
      } else {
        setError(data.message || "Something went wrong.");
        if (data.message?.includes("OTP")) setStep("otp"); // OTP galat — wapas OTP step
      }
    } catch { setError("Connection failed. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-secondary flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <span className="text-primary font-bold text-2xl">LM</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Forgot Password</h1>
          <p className="text-white/70 text-sm">Reset your LabourMatch password</p>
        </div>

        {/* Progress */}
        {step !== "done" && (
          <div className="flex items-center gap-2 mb-6">
            {["email", "otp", "password"].map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                  step === s ? "bg-white text-primary" :
                  ["email", "otp", "password"].indexOf(step) > i ? "bg-green-400 text-white" :
                  "bg-white/20 text-white/50"
                }`}>
                  {["email", "otp", "password"].indexOf(step) > i ? "✓" : i + 1}
                </div>
                {i < 2 && <div className={`flex-1 h-0.5 mx-1 ${["email", "otp", "password"].indexOf(step) > i ? "bg-green-400" : "bg-white/20"}`} />}
              </div>
            ))}
          </div>
        )}

        {/* Error / Success */}
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">{error}</div>}
        {success && step === "otp" && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm text-center">{success}</div>}

        {/* ── Step 1: Email ── */}
        {step === "email" && (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800">Enter Your Email</h2>
                  <p className="text-xs text-gray-500">We'll send you a reset OTP</p>
                </div>
              </div>
            </div>
            <form onSubmit={handleSendOTP} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Email Address</label>
                <input
                  type="email" required
                  placeholder="yourname@gmail.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 h-12 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-primary hover:opacity-90 disabled:opacity-50 text-white h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                Send Reset OTP
              </button>
              <Link to="/auth" className="flex items-center justify-center gap-1 text-sm text-gray-400 hover:text-gray-600">
                <ArrowLeft className="h-4 w-4" /> Back to Login
              </Link>
            </form>
          </div>
        )}

        {/* ── Step 2: OTP ── */}
        {step === "otp" && (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800">Enter OTP</h2>
                  <p className="text-xs text-gray-500">Sent to {email}</p>
                </div>
              </div>
            </div>
            <form onSubmit={handleVerifyOTP} className="p-6 space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-center">
                <p className="text-sm text-orange-700 font-medium">OTP sent to your email</p>
                <p className="text-xs text-orange-500 mt-0.5">Check spam folder too • Valid for 5 minutes</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">6-Digit OTP</label>
                <input
                  type="text" required
                  placeholder="• • • • • •"
                  value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  className="w-full border border-gray-200 rounded-xl px-4 h-14 text-center text-3xl font-bold tracking-widest focus:outline-none focus:border-primary"
                />
              </div>
              <button type="submit" disabled={otp.length !== 6}
                className="w-full bg-primary hover:opacity-90 disabled:opacity-50 text-white h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                <Shield className="h-4 w-4" /> Verify OTP
              </button>
              <button type="button" onClick={() => { setStep("email"); setOtp(""); setError(""); setSuccess(""); }}
                className="w-full text-sm text-gray-400 hover:text-gray-600 py-1">
                ← Change Email
              </button>
              <button type="button" onClick={handleSendOTP} disabled={loading}
                className="w-full text-sm text-primary hover:underline py-1">
                Resend OTP
              </button>
            </form>
          </div>
        )}

        {/* ── Step 3: New Password ── */}
        {step === "password" && (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800">Set New Password</h2>
                  <p className="text-xs text-gray-500">Choose a strong password</p>
                </div>
              </div>
            </div>
            <form onSubmit={handleResetPassword} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} required
                    placeholder="Min 6 characters"
                    value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 pr-12 h-12 text-sm focus:outline-none focus:border-primary"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"} required
                  placeholder="Re-enter password"
                  value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  className={`w-full border rounded-xl px-4 h-12 text-sm focus:outline-none ${
                    confirmPassword && newPassword !== confirmPassword ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-primary"
                  }`}
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
                )}
              </div>
              <button type="submit" disabled={loading || newPassword !== confirmPassword || newPassword.length < 6}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                Reset Password
              </button>
            </form>
          </div>
        )}

        {/* ── Step 4: Done ── */}
        {step === "done" && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Reset! ✅</h2>
            <p className="text-gray-500 text-sm mb-6">
              Your password has been successfully reset. You can now login with your new password.
            </p>
            <button onClick={() => navigate("/auth")}
              className="w-full bg-primary text-white h-12 rounded-xl font-semibold text-sm hover:opacity-90">
              Go to Login
            </button>
          </div>
        )}

      </div>
    </div>
  );
}