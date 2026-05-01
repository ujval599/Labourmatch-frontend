// src/app/pages/PremiumPlans.tsx
import { useState } from "react";
import {
  Crown, Check, Loader2, CreditCard, ExternalLink,
  LogIn, AlertCircle, Zap, CheckCircle2, Clock
} from "lucide-react";
import { useNavigate } from "react-router";
import api from "../../services/api";

const PLANS = [
  {
    id: "basic",
    label: "Basic",
    duration: "1 Month",
    amount: 699,
    popular: false,
    razorpayLink: "https://rzp.io/rzp/SCxo4M3",
    features: [
      "Profile listed at top for 1 month",
      "Priority in search results",
      "Premium badge on profile",
      "More visibility to users",
    ],
  },
  {
    id: "standard",
    label: "Standard",
    duration: "3 Months",
    amount: 1499,
    popular: true,
    razorpayLink: "https://rzp.io/rzp/GIVvzg6F",
    features: [
      "Profile listed at top for 3 months",
      "Priority in search results",
      "Premium badge on profile",
      "More visibility to users",
      "Save ₹597 vs monthly",
    ],
  },
  {
    id: "premium",
    label: "Premium",
    duration: "1 Year",
    amount: 4999,
    popular: false,
    razorpayLink: "https://rzp.io/rzp/NPApJvv",
    features: [
      "Profile listed at top for 1 year",
      "Highest priority in search results",
      "Premium badge on profile",
      "Maximum visibility to users",
      "Save ₹3395 vs monthly",
      "Featured contractor status",
    ],
  },
];

function getCurrentUser(): { id: string; name: string; phone: string } | null {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

type Step = "select" | "pay" | "confirm" | "done";

export default function PremiumPlans() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("standard");
  const [step, setStep] = useState<Step>("select");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentUser = getCurrentUser();
  const isLoggedIn = !!currentUser;
  const selected = PLANS.find(p => p.id === selectedPlan)!;

  // Step 1: Razorpay link kholo
  const handleOpenRazorpay = () => {
    if (!isLoggedIn) { navigate("/auth"); return; }
    window.open(selected.razorpayLink, "_blank");
    setStep("confirm");
  };

  // Step 2: User ne payment confirm kari — ab request bhejo
  const handleConfirmPayment = async () => {
    setLoading(true); setError("");
    try {
      const { data } = await api.post("/premium/request", {
        contractorPhone: currentUser!.phone,
        plan: selectedPlan,
      });
      if (data.success) {
        setStep("done");
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── DONE Screen ────────────────────────────────────────────────
  if (step === "done") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Request Submitted! 🎉</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your premium request has been sent to the admin for verification.
          </p>

          {/* Plan Summary */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-5 text-left">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Plan:</span>
              <span className="font-bold text-gray-800">{selected.label} — {selected.duration}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Amount:</span>
              <span className="font-bold text-green-700 text-lg">₹{selected.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Account:</span>
              <span className="font-semibold text-gray-800">{currentUser?.phone}</span>
            </div>
          </div>

          {/* Steps */}
          <div className="bg-gray-50 rounded-xl p-4 mb-5 text-left space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <Check className="h-4 w-4 text-white" />
              </div>
              <p className="text-sm text-gray-700">Payment done on Razorpay</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <Check className="h-4 w-4 text-white" />
              </div>
              <p className="text-sm text-gray-700">Request sent to admin</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <p className="text-sm text-gray-700 font-medium">Admin verifying payment — within 24 hours</p>
            </div>
          </div>

          <p className="text-xs text-gray-400">
            Once verified, your profile will appear <strong>FIRST</strong> in search results automatically.
          </p>

          <button onClick={() => navigate("/")}
            className="mt-5 w-full bg-primary text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // ── CONFIRM Screen ─────────────────────────────────────────────
  if (step === "confirm") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white text-center">
            <Crown className="h-10 w-10 mx-auto mb-2 opacity-90" />
            <h2 className="text-xl font-bold">Complete Your Payment</h2>
            <p className="text-white/80 text-sm mt-1">Razorpay payment page has opened in a new tab</p>
          </div>

          <div className="p-6">
            {/* Plan Summary */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Selected Plan</p>
                  <p className="font-bold text-gray-800">{selected.label} — {selected.duration}</p>
                </div>
                <p className="text-2xl font-black text-yellow-600">₹{selected.amount.toLocaleString()}</p>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Step 1: Pay on Razorpay</p>
                  <p className="text-xs text-gray-500">Complete your payment in the opened tab</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white font-bold text-xs">2</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Step 2: Confirm below</p>
                  <p className="text-xs text-gray-500">After payment, click the confirm button below</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-gray-500 font-bold text-xs">3</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-400">Step 3: Admin verifies</p>
                  <p className="text-xs text-gray-400">Your profile goes FIRST within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Reopen Razorpay */}
            <a href={selected.razorpayLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 py-3 rounded-xl font-semibold text-sm transition-colors mb-3">
              <ExternalLink className="h-4 w-4" />
              Reopen Razorpay Payment Page
            </a>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-3 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* ✅ Confirm Button — yahan click karne ke baad request jati hai */}
            <button
              onClick={handleConfirmPayment}
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-4 rounded-xl font-bold text-base transition-colors shadow-md"
            >
              {loading ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Submitting request...</>
              ) : (
                <><CheckCircle2 className="h-5 w-5" /> Maine Payment Kar Di ✓</>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              ⚠️ Only click after completing payment on Razorpay
            </p>

            {/* Back */}
            <button onClick={() => setStep("select")}
              className="w-full text-gray-400 text-sm py-2 hover:text-gray-600 transition-colors mt-2">
              ← Go back & change plan
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── SELECT PLAN (Main Page) ────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-br from-yellow-500 via-yellow-500 to-orange-500 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-sm mb-5">
            <Zap className="h-4 w-4" /> Get More Customers
          </div>
          <Crown className="h-14 w-14 mx-auto mb-4 opacity-90" />
          <h1 className="text-4xl font-bold mb-3">Premium Listing</h1>
          <p className="text-lg opacity-90 max-w-xl mx-auto">
            Appear at the top of search results — get more visibility, more calls, more work!
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Login warning */}
        {!isLoggedIn && (
          <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-8">
            <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-orange-700 text-sm font-medium">Login required to purchase premium.</p>
              <p className="text-orange-500 text-xs">Login with your contractor account first.</p>
            </div>
            <button onClick={() => navigate("/auth")}
              className="flex items-center gap-1.5 bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 whitespace-nowrap">
              <LogIn className="h-4 w-4" /> Login
            </button>
          </div>
        )}

        {/* Logged in user */}
        {isLoggedIn && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl p-4 mb-8">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              {currentUser!.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-green-800 text-sm">{currentUser!.name}</p>
              <p className="text-green-600 text-xs">📞 {currentUser!.phone} — Premium will be activated for this account</p>
            </div>
          </div>
        )}

        {/* Plans */}
        <h2 className="text-2xl font-bold text-center mb-8">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {PLANS.map((plan) => (
            <div key={plan.id} onClick={() => setSelectedPlan(plan.id)}
              className={`cursor-pointer rounded-2xl border-2 p-6 transition-all relative ${
                selectedPlan === plan.id
                  ? "border-yellow-500 bg-yellow-50 shadow-lg scale-[1.02]"
                  : "border-gray-200 bg-white hover:border-yellow-300 hover:shadow-md"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-500 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    ⭐ Most Popular
                  </span>
                </div>
              )}
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">{plan.label}</h3>
                <p className="text-gray-500 text-sm">{plan.duration}</p>
                <p className="text-3xl font-black text-yellow-600 mt-2">₹{plan.amount.toLocaleString()}</p>
                <p className="text-xs text-gray-400">one time payment</p>
              </div>
              <ul className="space-y-2 mb-4">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{f}</span>
                  </li>
                ))}
              </ul>
              {selectedPlan === plan.id && (
                <div className="text-center text-yellow-600 font-semibold text-sm border-t border-yellow-200 pt-3">
                  ✓ Selected
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Payment Box */}
        <div className="max-w-md mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

            {/* Selected Plan Summary */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Selected Plan</p>
                  <p className="font-bold text-gray-800">{selected.label} — {selected.duration}</p>
                </div>
                <p className="text-2xl font-black text-yellow-600">₹{selected.amount.toLocaleString()}</p>
              </div>
            </div>

            {/* How it works */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5">
              <p className="text-xs font-semibold text-blue-700 mb-2">How it works:</p>
              <div className="space-y-1.5">
                <p className="text-xs text-blue-600">1️⃣ Click "Pay via Razorpay" — payment page opens</p>
                <p className="text-xs text-blue-600">2️⃣ Complete payment on Razorpay</p>
                <p className="text-xs text-blue-600">3️⃣ Come back & confirm payment done</p>
                <p className="text-xs text-blue-600">4️⃣ Admin verifies → Profile goes FIRST in 24hrs ✅</p>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-4 w-4 text-blue-500" />
              <p className="text-sm font-medium text-gray-700">Secure payment via Razorpay</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-5">
              {["UPI", "Credit Card", "Debit Card", "Net Banking", "Wallets"].map(m => (
                <span key={m} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{m}</span>
              ))}
            </div>

            {/* ✅ Pay Button — sirf Razorpay kholta hai, request nahi bhejta */}
            <button
              onClick={handleOpenRazorpay}
              className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-base transition-colors shadow-md"
            >
              <CreditCard className="h-5 w-5" />
              Pay ₹{selected.amount.toLocaleString()} via Razorpay
              <ExternalLink className="h-4 w-4" />
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              🔒 100% Secure payment powered by Razorpay
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-center mb-6">How It Works?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: "1", title: "Select Plan", desc: "Choose 1 month, 3 months, or 1 year" },
              { step: "2", title: "Pay via Razorpay", desc: "UPI, Card, Net Banking all accepted" },
              { step: "3", title: "Confirm Payment", desc: "Come back & confirm your payment" },
              { step: "4", title: "Go Live!", desc: "Profile appears FIRST in 24 hours" },
            ].map((item) => (
              <div key={item.step} className="text-center p-4 bg-white rounded-2xl border border-gray-100">
                <div className="w-12 h-12 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-1 text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}