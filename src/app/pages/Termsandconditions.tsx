// src/app/pages/Termsandconditions.tsx
import { Shield, AlertTriangle, FileText, Users, Scale, Clock, CheckCircle } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-secondary text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Terms & Conditions</h1>
          <p className="opacity-85 text-lg">Please read these terms carefully before using LabourMatch.</p>
          <p className="opacity-70 text-sm mt-2">Last updated: January 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">

        {/* 1. Acceptance */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">1. Acceptance of Terms</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            By accessing or using LabourMatch ("the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services. These terms apply to all users including customers, service providers (contractors), and visitors.
          </p>
        </div>

        {/* 2. About LabourMatch */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">2. About LabourMatch</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            LabourMatch is a marketplace platform that connects customers with verified service providers (contractors) including construction workers, plumbers, electricians, carpenters, interior designers, and other skilled professionals. LabourMatch acts as an intermediary and is not directly responsible for the quality or outcome of services provided.
          </p>
        </div>

        {/* 3. Service Provider Terms */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Scale className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">3. Service Provider Terms</h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-4">
            By registering as a service provider on LabourMatch, you agree to the following terms:
          </p>
          <div className="space-y-4">

            {/* Commission */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span className="text-primary">💼</span> Commission Policy
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                For every project or booking received through LabourMatch, service providers agree to pay <strong>8% commission</strong> to LabourMatch on the total project value. This commission applies to all work leads and bookings facilitated through the platform. The commission is due upon project completion or as agreed with the LabourMatch team.
              </p>
            </div>

            {/* Work Completion */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span>⚠️</span> Work Completion Obligation
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Once a service provider accepts a project or booking through LabourMatch, they are <strong>obligated to complete the work</strong>. Abandoning a project midway is strictly prohibited. If a service provider has accepted a project, they must see it through to completion. Repeated abandonment of projects may result in suspension or permanent removal from the platform.
              </p>
            </div>

            {/* Verification */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span>✅</span> Verification Requirement
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                All service providers must complete LabourMatch's verification process before their profile is listed on the platform. Verification is <strong>mandatory for all professionals</strong> and is not a paid feature. Subscription plans provide additional visibility only — they do not replace or bypass verification.
              </p>
            </div>

            {/* Professional Conduct */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span>👷</span> Professional Conduct
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Service providers must maintain professional conduct at all times, provide accurate information about their services, qualifications and experience, and treat customers with respect. Any fraudulent, misleading or unprofessional behavior may result in immediate removal from the platform.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Customer Protection */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">4. Customer Protection Policy</h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-4">
            LabourMatch is committed to protecting customers. The following measures are in place:
          </p>
          <div className="space-y-3">
            {[
              {
                title: "Professional Verification",
                desc: "LabourMatch verifies all service providers before listing them on the platform to ensure customers connect with legitimate professionals.",
              },
              {
                title: "Project Record Keeping",
                desc: "When a customer initiates a project through LabourMatch, important details are recorded — including the professional's name, scope of work, quotation amount and project progress.",
              },
              {
                title: "Dispute Resolution",
                desc: "If any problem arises during a project, customers can raise a complaint or dispute on LabourMatch. Our team will review the matter based on available information and project records.",
              },
              {
                title: "Professional Accountability",
                desc: "If a professional receives repeated serious or genuine complaints, LabourMatch reserves the right to suspend or permanently remove them from the platform.",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                  <p className="text-gray-500 text-sm mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Important Disclaimer */}
          <div className="mt-5 bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-700 text-sm mb-1">Important Notice</p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  LabourMatch does not guarantee automatic refunds or financial compensation if something goes wrong. Our commitment is to provide verification, project records, a dispute mechanism and professional accountability — and to continue strengthening these protections over time.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Subscription Plans */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">5. Subscription Plans</h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-3">
            LabourMatch offers optional subscription plans (Basic, Standard, Premium) for service providers who wish to increase their visibility and access more lead opportunities.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /><span>Subscription plans provide <strong>enhanced visibility and lead opportunities</strong> — they do not guarantee bookings or a top ranking in search results.</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /><span>Lead opportunities are subject to customer demand, location and service relevance.</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /><span>Subscription payments are non-refundable once activated.</span></li>
            <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /><span>Verification remains mandatory for all professionals and cannot be purchased.</span></li>
          </ul>
        </div>

        {/* 6. User Responsibilities */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">6. User Responsibilities</h2>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            {[
              "Provide accurate and truthful information when registering or creating a profile.",
              "Do not use the platform for any fraudulent, illegal or misleading activity.",
              "Respect other users — both customers and service providers.",
              "Do not share your account credentials with others.",
              "Report any suspicious activity or policy violations to LabourMatch.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 7. Limitation of Liability */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">7. Limitation of Liability</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            LabourMatch is a marketplace platform and acts as an intermediary between customers and service providers. We are not liable for the quality, safety or outcome of services rendered by professionals listed on our platform. While we take steps to verify professionals and maintain records, final responsibility for the service delivery lies with the service provider.
          </p>
        </div>

        {/* 8. Changes to Terms */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">8. Changes to Terms</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            LabourMatch reserves the right to update or modify these Terms and Conditions at any time. Continued use of the platform after changes are posted constitutes acceptance of the updated terms. We recommend checking this page periodically for updates.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-800 mb-2">Questions about our Terms?</h3>
          <p className="text-gray-500 text-sm mb-4">Contact us and we'll be happy to help.</p>
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