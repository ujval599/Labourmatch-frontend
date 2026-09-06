// src/app/pages/PremiumPlans.tsx
import { useState } from "react";
import { Crown, Check, Zap, Star, Shield, TrendingUp, Phone, Mail, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { useAuth } from "../../context/AuthContext";

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: 699,
    duration: "1 Month",
    durationShort: "/month",
    color: "from-primary/70 to-secondary/70",
    borderColor: "border-primary/15",
    badgeColor: "bg-primary/8 text-primary",
    icon: <Zap className="h-6 w-6 text-white" />,
    razorpayLink: "https://rzp.io/rzp/QmmbkdkO",
    popular: false,
    savings: null,
    benefits: [
      "Enhanced profile visibility",
      "Priority opportunity alerts",
      "Premium badge on profile",
      "More visibility to users",
      "Up to 5 relevant lead opportunities/month",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    price: 1499,
    duration: "3 Months",
    durationShort: "/3 months",
    color: "from-primary to-secondary",
    borderColor: "border-primary/30",
    badgeColor: "bg-primary/10 text-primary",
    icon: <Star className="h-6 w-6 text-white" />,
    razorpayLink: "https://rzp.io/rzp/EQ7AL1X",
    popular: true,
    savings: "Save ₹597 vs monthly",
    benefits: [
      "Enhanced profile visibility",
      "Higher priority opportunity alerts",
      "Premium badge on profile",
      "More portfolio/work showcase",
      "Up to 15 relevant lead opportunities/3 months",
      "Save ₹597 vs monthly",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 4999,
    duration: "1 Year",
    durationShort: "/year",
    color: "from-primary to-secondary",
    borderColor: "border-primary/20",
    badgeColor: "bg-primary/10 text-primary",
    icon: <Crown className="h-6 w-6 text-white" />,
    razorpayLink: "https://rzp.io/rzp/sj6i6jmB",
    popular: false,
    savings: "Save ₹3,389 vs monthly",
    benefits: [
      "Maximum visibility",
      "Highest priority opportunity alerts",
      "Premium badge on profile",
      "Featured contractor status",
      "Advanced business insights",
      "Up to 50 relevant lead opportunities/year",
      "Save ₹3,389 vs monthly",
    ],
  },
];

export default function PremiumPlans() {
  const { isContractor, isAdmin } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<typeof PLANS[0] | null>(null);

  const handleSelectPlan = (plan: typeof PLANS[0]) => {
    setCurrentPlan(plan);
    setSelectedPlan(plan.id);
    setShowConfirm(true);
  };

  const handleProceed = () => {
    if (currentPlan) {
      window.open(currentPlan.razorpayLink, "_blank");
      setShowConfirm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary/95 to-secondary text-white py-14 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
            <Crown className="h-4 w-4" /> Provider Subscription Plans
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
            Grow Your Business with LabourMatch
          </h1>
          <p className="text-lg opacity-85 max-w-2xl mx-auto">
            Get enhanced visibility, priority opportunity alerts and more lead opportunities to grow your service business.
          </p>

          {/* Verification Note */}
          <div className="mt-6 inline-flex items-start gap-2 bg-white/15 border border-white/25 rounded-xl px-5 py-3 text-sm text-white/90 max-w-xl mx-auto">
            <Shield className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span><strong>Verification is required</strong> for listing and is not a paid feature. All professionals must be verified before being listed on LabourMatch.</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {PLANS.map((plan) => (
            <div key={plan.id} className={`relative ${plan.popular ? "md:-mt-4" : ""}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                  <span className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                    ⭐ Most Popular
                  </span>
                </div>
              )}
              <Card className={`border-2 ${plan.popular ? plan.borderColor + " shadow-xl" : plan.borderColor} h-full flex flex-col transition-all hover:shadow-lg`}>
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 shadow-md`}>
                    {plan.icon}
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xl font-extrabold text-gray-800">{plan.name}</h3>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${plan.badgeColor}`}>
                      {plan.duration}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-gray-900">₹{plan.price.toLocaleString()}</span>
                    <span className="text-gray-400 text-sm">{plan.durationShort}</span>
                  </div>
                  {plan.savings && (
                    <p className="text-xs font-semibold text-primary mt-1">🎉 {plan.savings}</p>
                  )}
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {plan.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSelectPlan(plan)}
                    className={`w-full font-bold py-3 ${plan.popular ? "bg-gradient-to-r from-primary to-secondary hover:opacity-90" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Get {plan.name} Plan
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Lead Opportunities Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800 mb-1">About Lead Opportunities</p>
            <p className="text-sm text-amber-700">
              Lead opportunities are subject to customer demand, location and service relevance. <strong>No guaranteed bookings.</strong> Subscription provides enhanced visibility and access to more potential leads — actual results may vary.
            </p>
          </div>
        </div>

        {/* Verification Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-10 flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-800 mb-1">Verification Policy</p>
            <p className="text-sm text-blue-700">
              Verification is required for listing and is <strong>not a paid feature</strong>. All professionals must complete verification before their profile is listed on LabourMatch. Subscription plans provide additional visibility and tools only — they do not bypass verification.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-10">
          <h3 className="text-xl font-bold text-center text-gray-800 mb-6">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Choose a Plan", desc: "Select the plan that fits your business needs and budget." },
              { step: "2", title: "Make Payment", desc: "Pay securely via Razorpay. You'll receive a payment confirmation." },
              { step: "3", title: "Get Activated", desc: "Share your payment screenshot with us. We'll activate your plan within 24 hours." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-black text-lg">{s.step}</span>
                </div>
                <p className="font-bold text-gray-800 mb-1">{s.title}</p>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="text-center bg-primary/5 border border-primary/20 rounded-2xl p-8">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Need Help Choosing?</h3>
          <p className="text-gray-500 text-sm mb-5">Contact us and we'll help you pick the right plan for your business.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:+918128860779" className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-all">
              <Phone className="h-4 w-4" /> +91 8128860779
            </a>
            <a href="mailto:labourmatch91@gmail.com" className="flex items-center gap-2 border-2 border-primary text-primary px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary/5 transition-all">
              <Mail className="h-4 w-4" /> labourmatch91@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && currentPlan && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4"
          onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${currentPlan.color} flex items-center justify-center mx-auto mb-4`}>
              {currentPlan.icon}
            </div>
            <h3 className="text-xl font-bold text-center text-gray-800 mb-1">{currentPlan.name} Plan</h3>
            <p className="text-center text-gray-500 text-sm mb-5">
              ₹{currentPlan.price.toLocaleString()} for {currentPlan.duration}
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2 text-sm text-gray-600">
              <p>✅ You'll be redirected to Razorpay for secure payment</p>
              <p>✅ After payment, share screenshot on WhatsApp or email</p>
              <p>✅ Plan will be activated within 24 hours</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowConfirm(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleProceed} className="flex-1 bg-gradient-to-r from-primary to-secondary">
                Proceed to Pay
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}