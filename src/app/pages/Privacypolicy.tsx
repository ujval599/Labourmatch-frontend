// src/app/pages/PrivacyPolicy.tsx
import { Shield, Eye, Lock, Database, Bell, Mail, Phone, ChevronRight } from "lucide-react";

const sections = [
  {
    icon: Database,
    title: "Information We Collect",
    content: [
      {
        subtitle: "Personal Information",
        text: "When you register on LabourMatch, we collect your name, phone number, email address, and location. This information is necessary to create your account and provide our services."
      },
      {
        subtitle: "Contractor Information",
        text: "Contractors additionally provide business details including work category, pricing, experience, and profile photos/videos to help users find the right match."
      },
      {
        subtitle: "Usage Data",
        text: "We automatically collect information about how you use our platform, including pages visited, search queries, and interactions with contractor profiles."
      }
    ]
  },
  {
    icon: Eye,
    title: "How We Use Your Information",
    content: [
      {
        subtitle: "Service Delivery",
        text: "We use your information to connect users with contractors, process bookings, enable messaging between parties, and provide customer support."
      },
      {
        subtitle: "Verification & Safety",
        text: "Contractor information is used to verify identities, ensure platform safety, and maintain the quality of services offered on LabourMatch."
      },
      {
        subtitle: "Communications",
        text: "We may send you OTP messages, booking confirmations, and important service updates via SMS or email. You can manage notification preferences in your account settings."
      },
      {
        subtitle: "Platform Improvement",
        text: "Aggregated usage data helps us improve our search algorithms, user interface, and overall platform experience."
      }
    ]
  },
  {
    icon: Lock,
    title: "Data Security",
    content: [
      {
        subtitle: "Encryption",
        text: "All sensitive data including passwords are encrypted using industry-standard bcrypt hashing. Data transmission is secured via HTTPS encryption."
      },
      {
        subtitle: "Access Controls",
        text: "Access to personal data is strictly limited to authorized personnel on a need-to-know basis. We regularly audit access logs and permissions."
      },
      {
        subtitle: "Data Retention",
        text: "We retain your data as long as your account is active. Upon account deletion, your personal data is permanently removed within 30 days, except where retention is required by law."
      }
    ]
  },
  {
    icon: Bell,
    title: "Sharing of Information",
    content: [
      {
        subtitle: "With Contractors/Users",
        text: "To facilitate bookings and communications, relevant contact information is shared between users and contractors. Contractors' public profiles including name, phone, and work details are visible to all users."
      },
      {
        subtitle: "Third-Party Services",
        text: "We use trusted third-party services for OTP delivery (SMS), email notifications, and payment processing. These partners are bound by strict data protection agreements."
      },
      {
        subtitle: "Legal Requirements",
        text: "We may disclose information if required by law, court order, or government authority, or to protect the rights and safety of LabourMatch users."
      }
    ]
  },
  {
    icon: Shield,
    title: "Your Rights",
    content: [
      {
        subtitle: "Access & Correction",
        text: "You have the right to access and correct your personal information at any time through your account settings or by contacting our support team."
      },
      {
        subtitle: "Data Deletion",
        text: "You can request deletion of your account and associated data by contacting us. We will process deletion requests within 30 days."
      },
      {
        subtitle: "Opt-Out",
        text: "You may opt out of promotional communications at any time. Note that service-related communications (OTPs, booking confirmations) cannot be disabled as they are essential for platform functionality."
      }
    ]
  }
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary via-primary/90 to-secondary py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Your privacy matters to us. This policy explains how LabourMatch collects, uses, and protects your personal information.
          </p>
          <p className="text-white/60 text-sm mt-4">Last updated: April 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Intro */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm">
          <p className="text-gray-600 leading-relaxed">
            Welcome to <strong>LabourMatch</strong>. We are committed to protecting your personal information and your right to privacy.
            This Privacy Policy describes how we collect, use, and share information about you when you use our platform to find or offer labour contractor services across India.
            By using LabourMatch, you agree to the collection and use of information in accordance with this policy.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              {/* Section Header */}
              <div className="flex items-center gap-4 p-6 border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <section.icon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">{idx + 1}. {section.title}</h2>
              </div>

              {/* Section Content */}
              <div className="p-6 space-y-5">
                {section.content.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <ChevronRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-1">{item.subtitle}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Cookies */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">6. Cookies & Tracking</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            LabourMatch uses session tokens (JWT) for authentication purposes. We do not use tracking cookies for advertising.
            Local storage is used to maintain your login session and role preferences. You can clear this data through your browser settings,
            though doing so will log you out of the platform.
          </p>
        </div>

        {/* Children */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">7. Children's Privacy</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            LabourMatch is not intended for use by individuals under the age of 18. We do not knowingly collect personal information
            from minors. If you believe we have collected information from a minor, please contact us immediately and we will take
            steps to delete such information.
          </p>
        </div>

        {/* Changes */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">8. Changes to This Policy</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new
            policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-2xl p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Us</h2>
          <p className="text-gray-600 text-sm mb-4">
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Mail className="h-4 w-4 text-primary" />
              <span>privacy@labourmatch.in</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Phone className="h-4 w-4 text-primary" />
              <span>+91 8128860779</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}