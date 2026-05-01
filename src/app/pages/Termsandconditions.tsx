// src/app/pages/TermsAndConditions.tsx
import { FileText, Users, HardHat, AlertTriangle, CreditCard, Scale, Phone, Mail, ChevronRight } from "lucide-react";

const sections = [
  {
    icon: Users,
    title: "User Accounts & Registration",
    items: [
      "You must be at least 18 years of age to create an account on LabourMatch.",
      "You are responsible for maintaining the confidentiality of your account credentials.",
      "You agree to provide accurate, current, and complete information during registration.",
      "You must notify us immediately of any unauthorized use of your account.",
      "One person may not maintain more than one active user account.",
      "LabourMatch reserves the right to suspend or terminate accounts that violate these terms."
    ]
  },
  {
    icon: HardHat,
    title: "Contractor Registration & Services",
    items: [
      "Contractors must provide accurate information about their services, experience, and pricing.",
      "All contractor profiles are subject to review and verification by LabourMatch administrators.",
      "Contractors are responsible for the quality and safety of services they provide.",
      "Profile activation may take 24-48 hours after registration for verification purposes.",
      "Contractors must maintain valid identification and necessary licenses for their work category.",
      "Premium listings and sponsored placements are available through our premium plans.",
      "LabourMatch reserves the right to remove contractor profiles that receive consistent negative feedback."
    ]
  },
  {
    icon: Scale,
    title: "Platform Usage Rules",
    items: [
      "You agree not to use LabourMatch for any unlawful or prohibited activities.",
      "You must not post false, misleading, or fraudulent information on the platform.",
      "Harassment, abuse, or threatening behavior toward other users is strictly prohibited.",
      "You must not attempt to bypass or manipulate the platform's rating and review system.",
      "Scraping, crawling, or automated access to the platform without permission is prohibited.",
      "You must not use the platform to spam other users with unsolicited communications.",
      "Any attempt to hack, reverse engineer, or compromise platform security will result in immediate termination."
    ]
  },
  {
    icon: CreditCard,
    title: "Payments & Premium Plans",
    items: [
      "Premium plan fees are non-refundable once the service period has commenced.",
      "Contractors are responsible for providing proof of payment for premium plan activation.",
      "LabourMatch does not process direct payments between users and contractors.",
      "All financial transactions between users and contractors are independent of LabourMatch.",
      "Premium plan pricing is subject to change with 30 days advance notice.",
      "Disputes regarding payments to contractors must be resolved directly between the parties."
    ]
  },
  {
    icon: AlertTriangle,
    title: "Disclaimer & Limitation of Liability",
    items: [
      "LabourMatch is a marketplace platform and does not directly employ any contractors.",
      "We do not guarantee the quality, safety, or legality of services offered by contractors.",
      "LabourMatch is not liable for any disputes, damages, or losses arising from contractor-user interactions.",
      "The platform is provided 'as is' without warranties of any kind, express or implied.",
      "We are not responsible for any loss of data, revenue, or business opportunities.",
      "Our maximum liability to you shall not exceed the amount paid by you to LabourMatch in the past 12 months.",
      "We reserve the right to modify or discontinue services without prior notice."
    ]
  },
  {
    icon: FileText,
    title: "Reviews & Content",
    items: [
      "By submitting reviews, you grant LabourMatch a non-exclusive license to display your content.",
      "Reviews must be honest, based on actual experiences, and free from defamatory content.",
      "LabourMatch reserves the right to remove reviews that violate our content guidelines.",
      "You are solely responsible for the content you post on the platform.",
      "Fake reviews, whether positive or negative, are strictly prohibited and may result in account suspension.",
      "Profile photos and work media uploaded must be your own original content."
    ]
  }
];

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary via-primary/90 to-secondary py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Terms & Conditions</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Please read these terms carefully before using LabourMatch. By accessing our platform, you agree to be bound by these terms.
          </p>
          <p className="text-white/50 text-sm mt-4">Last updated: April 2026 • Effective immediately</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Agreement Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 flex items-start gap-4">
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-amber-700 text-sm leading-relaxed">
            <strong>Important:</strong> By creating an account or using LabourMatch services, you acknowledge that you have read,
            understood, and agree to be bound by these Terms & Conditions and our Privacy Policy. If you do not agree,
            please do not use our platform.
          </p>
        </div>

        {/* Intro */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm">
          <p className="text-gray-600 leading-relaxed">
            These Terms & Conditions ("Terms") govern your use of the <strong>LabourMatch</strong> platform, including our website,
            mobile application, and all related services. LabourMatch operates as an online marketplace connecting individuals
            seeking labour services ("Users") with skilled contractors ("Contractors") across India.
            These Terms constitute a legally binding agreement between you and LabourMatch.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="flex items-center gap-4 p-6 border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white">
                <div className="w-10 h-10 bg-gray-800/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <section.icon className="h-5 w-5 text-gray-700" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">{idx + 1}. {section.title}</h2>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <ChevronRight className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-500 text-sm leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Governing Law */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">7. Governing Law & Disputes</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-3">
            These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these
            Terms or your use of LabourMatch shall be subject to the exclusive jurisdiction of the courts in Gujarat, India.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            We encourage you to first contact our support team to resolve any disputes amicably before pursuing legal action.
          </p>
        </div>

        {/* Termination */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">8. Termination</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            LabourMatch reserves the right to terminate or suspend your account at any time, with or without notice, for conduct
            that we believe violates these Terms or is harmful to other users, LabourMatch, third parties, or for any other reason
            at our sole discretion. Upon termination, your right to use the platform will immediately cease.
          </p>
        </div>

        {/* Changes */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">9. Changes to Terms</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            We reserve the right to modify these Terms at any time. We will provide notice of significant changes by updating
            the date at the top of this page. Your continued use of LabourMatch after changes constitutes acceptance of the
            revised Terms. We recommend reviewing these Terms periodically.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-br from-primary via-primary/90 to-secondary py-16 px-4">
          <h2 className="text-xl font-bold mb-4">Contact & Support</h2>
          <p className="text-white/70 text-sm mb-4">
            For questions about these Terms & Conditions, please contact our legal team:
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-white/80">
              <Mail className="h-4 w-4 text-white/60" />
              <span>legal@labourmatch.in</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/80">
              <Phone className="h-4 w-4 text-white/60" />
              <span>+91 8128860779</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}