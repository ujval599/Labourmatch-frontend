// src/app/pages/Privacypolicy.tsx
import { Shield, Eye, Lock, Bell, Users, FileText, CheckCircle, AlertTriangle } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-secondary text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Privacy Policy</h1>
          <p className="opacity-85 text-lg">Your privacy is important to us. Here is how we protect your data.</p>
          <p className="opacity-70 text-sm mt-2">Last updated: January 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">

        {/* 1. Introduction */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">1. Introduction</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            LabourMatch is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store and protect your personal information when you use our platform. By using LabourMatch, you agree to the practices described in this policy.
          </p>
        </div>

        {/* 2. Information We Collect */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">2. Information We Collect</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-gray-700 mb-2">For Customers:</p>
              <ul className="space-y-1.5 text-sm text-gray-600">
                {["Name, phone number and email address", "Location and project details", "Booking and communication history", "Reviews and ratings submitted"].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /><span>{item}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-2">For Service Providers:</p>
              <ul className="space-y-1.5 text-sm text-gray-600">
                {["Name, phone number, email and location", "Business details, category and experience", "Profile photos and work media", "Project records including quotations and progress", "Verification documents and status"].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /><span>{item}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 3. How We Use */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">3. How We Use Your Information</h2>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            {[
              "To create and manage your account on the platform.",
              "To connect customers with verified service providers.",
              "To process bookings and facilitate communication.",
              "To maintain project records for dispute resolution purposes.",
              "To verify service providers before listing them on the platform.",
              "To send important notifications about bookings, updates and account activity.",
              "To improve our platform, services and user experience.",
              "To ensure platform safety and prevent fraud.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 4. Project Records */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">4. Project Records & Customer Protection</h2>
          </div>
          <p className="text-gray-600 mb-4">To protect customers, LabourMatch maintains records of projects initiated through the platform:</p>
          <div className="space-y-3 mb-4">
            {[
              { title: "Professional Details", desc: "Name, verified status and contact information of the service provider." },
              { title: "Scope of Work", desc: "What service was agreed upon, quotation amount and project timeline." },
              { title: "Project Progress", desc: "Updates and status of the project as reported through the platform." },
              { title: "Complaint & Dispute Records", desc: "Any complaints raised by customers regarding a professional or project." },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-gray-500 text-sm leading-relaxed">
                These records are used solely for dispute resolution and platform safety. LabourMatch does not guarantee automatic refunds but commits to reviewing disputes fairly based on available information.
              </p>
            </div>
          </div>
        </div>

        {/* 5. Commission */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">5. Service Provider Commission & Obligations</h2>
          </div>
          <div className="space-y-4">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <p className="font-semibold text-gray-800 text-sm mb-1">8% Commission</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Service providers agree to pay 8% commission to LabourMatch on every project or booking received through the platform. This is agreed upon during registration.
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="font-semibold text-gray-800 text-sm mb-1">Work Completion Obligation</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Service providers who accept a project through LabourMatch are obligated to complete it. Abandoning accepted work midway is a violation of platform terms and may result in suspension or removal.
              </p>
            </div>
          </div>
        </div>

        {/* 6. Data Sharing */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">6. Data Sharing & Third Parties</h2>
          </div>
          <p className="text-gray-600 mb-3">We do not sell your personal data. We may share your information only in these cases:</p>
          <ul className="space-y-2 text-sm text-gray-600">
            {[
              "With service providers when you make a booking (contact details shared to facilitate the service).",
              "With payment processors (Razorpay) for secure payment handling.",
              "With cloud storage services (Cloudinary) for media storage.",
              "When required by law or to protect the rights and safety of our users.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 7. Security */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">7. Data Security</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            We implement appropriate technical and security measures to protect your personal data from unauthorized access, loss or misuse. Passwords are encrypted and stored securely. No method of transmission over the internet is 100% secure.
          </p>
        </div>

        {/* 8. Your Rights */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">8. Your Rights</h2>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            {[
              "Access and review the personal data we hold about you.",
              "Request correction of inaccurate information.",
              "Request deletion of your account and associated data.",
              "Opt out of non-essential communications.",
              "Raise a complaint or dispute regarding a project or service provider.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 9. Changes */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">9. Changes to This Policy</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            LabourMatch may update this Privacy Policy from time to time. We will notify users of significant changes. Continued use of the platform after changes constitutes acceptance of the updated policy.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-800 mb-2">Questions about your Privacy?</h3>
          <p className="text-gray-500 text-sm mb-4">Contact us and we will be happy to help.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm">
            <a href="mailto:labourmatch91@gmail.com" className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:opacity-90">
              labourmatch91@gmail.com
            </a>
            <a href="tel:+918128860779" className="flex items-center justify-center gap-2 border-2 border-primary text-primary px-5 py-2.5 rounded-xl font-semibold hover:bg-primary/5">
              +91 8128860779
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}