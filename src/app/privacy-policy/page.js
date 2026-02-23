"use client";

import { 
  FaUserCheck, 
  FaIdCard, 
  FaFileUpload, 
  FaShareAlt, 
  FaUserShield, 
  FaUsers, 
  FaMoneyBillWave,
  FaBalanceScale,
  FaExclamationTriangle,
  FaClipboardCheck,
  FaGavel,
  FaShieldAlt
} from "react-icons/fa";

export default function PrivacyPolicyRules() {
  const rules = [
    {
      id: 1,
      title: "Membership Eligibility",
      icon: FaUserCheck,
      color: "bg-green-100 text-green-700",
      points: [
        "Age 18+ years is mandatory",
        "Submission of Aadhaar card and recent photograph required",
        "Digital membership form completion on official website",
        "Must follow beliefs of Ahl-e-Sunnat wal Jama'at",
        "Good character with no criminal or extremist involvement"
      ]
    },
    {
      id: 2,
      title: "Member Duties & Responsibilities",
      icon: FaUserShield,
      color: "bg-blue-100 text-blue-700",
      points: [
        "Uphold dignity, discipline, and honesty at all times",
        "Remain prepared for the mission of Namoos-e-Risalat",
        "Immediate legal action response to blasphemy/disrespect cases",
        "Zero tolerance for excuses, delays, or negligence",
        "Membership termination for groupism, hatred, or damaging trust reputation"
      ]
    },
    {
      id: 3,
      title: "Official Materials Usage",
      icon: FaIdCard,
      color: "bg-purple-100 text-purple-700",
      points: [
        "Trust registration number usage by authorized persons only",
        "Niti Aayog ID, logo, ID cards, seal, letterhead restricted to authorized use",
        "Misuse, personal use, or unauthorized use leads to suspension",
        "Legal action against violators"
      ]
    },
    {
      id: 4,
      title: "Reporting System",
      icon: FaFileUpload,
      color: "bg-amber-100 text-amber-700",
      points: [
        "No direct uploads by branches/members on website",
        "All written/scanned reports must be sent to Website Hosting Admin",
        "Admin handles all system uploads",
        "Centralized reporting mechanism"
      ]
    },
    {
      id: 5,
      title: "Social Media & Public Conduct",
      icon: FaShareAlt,
      color: "bg-red-100 text-red-700",
      points: [
        "Strict prohibition of fake news and false reports",
        "No political statements or threatening messages",
        "Misuse of Trust's name strictly prohibited",
        "Cyber actions handled only by TNRAT Cyber Ummah Wing"
      ]
    },
    {
      id: 6,
      title: "Sensitive Matters Protocol",
      icon: FaExclamationTriangle,
      color: "bg-orange-100 text-orange-700",
      points: [
        "BLT issues require proper verification before sharing",
        "Missing person cases need verification",
        "Communal tension matters handled carefully",
        "Anti-Islamic content sharing only after verification",
        "Immediate membership cancellation for fabricated cases or rumors"
      ]
    },
    {
      id: 7,
      title: "Meetings & Leadership",
      icon: FaUsers,
      color: "bg-cyan-100 text-cyan-700",
      points: [
        "Monthly meetings mandatory for every incharge",
        "Meeting reports sent to Website Hosting Admin",
        "Automatic suspension for failure to send reports",
        "Indiscipline for disobeying senior officials' instructions"
      ]
    },
    {
      id: 8,
      title: "Membership Fees & Payments",
      icon: FaMoneyBillWave,
      color: "bg-emerald-100 text-emerald-700",
      points: [
        "Registration fee: ₹30 monthly ($1 per day)",
        "Annual renewal fee mandatory",
        "Two consecutive months non-payment leads to automatic termination",
        "Payments valid only through official Trust bank accounts"
      ]
    },
    {
      id: 9,
      title: "Constitutional & Legal Adherence",
      icon: FaBalanceScale,
      color: "bg-indigo-100 text-indigo-700",
      points: [
        "Works within TNRAT Constitution framework",
        "Compliance with Republic of India laws",
        "No support or engagement in illegal activities",
        "Immediate removal of members involved in unlawful actions",
        "Full cooperation with law authorities when required"
      ]
    }
  ];

  const privacyPolicy = [
    {
      title: "Data Collection",
      content: "We collect personal information including name, age, Aadhaar number, photograph, and contact details through our digital membership forms. This information is used solely for membership verification and Trust operations."
    },
    {
      title: "Data Usage",
      content: "Your personal data is used for membership management, communication, legal compliance, and service delivery. We do not share your data with third parties without consent, except as required by law."
    },
    {
      title: "Data Protection",
      content: "We implement security measures to protect your personal information. Access to your data is restricted to authorized personnel only, and we maintain strict confidentiality protocols."
    },
    {
      title: "Membership Termination",
      content: "Membership may be terminated for violations of Trust rules, non-payment of fees, or involvement in unlawful activities. Upon termination, access to Trust resources and data will be revoked."
    },
    {
      title: "Complaints & Grievances",
      content: "Members can report concerns through official channels. All complaints are handled confidentially and investigated promptly according to Trust procedures and legal requirements."
    }
  ];

  return (
    <section className="min-h-screen bg-gradient-to-b from-green-50 to-white py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <FaShieldAlt className="w-8 h-8 text-green-700" />
          </div>
          <h1 className="text-xl md:text-4xl font-bold text-green-900 mb-3">
            TNRAT Rules, Regulations & Privacy Policy
          </h1>
          <p className="text-sm md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Official guidelines and privacy terms governing membership and operations of Tahaffuz-e-Namoos-e-Risalat Action Trust
          </p>
          <div className="mt-4 text-xs md:text-sm text-green-700 font-medium">
            Last Updated: 2025 | © TNRAT. All Rights Reserved
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Important Notice */}
          <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
            <div className="flex items-start gap-3">
              <FaClipboardCheck className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-sm md:text-lg font-semibold text-yellow-800 mb-2">
                  Important Notice
                </h3>
                <p className="text-sm md:text-lg text-yellow-700">
                  TNRAT operates strictly within the constitutional framework of India. All activities are lawful, ethical, transparent, and responsible. Any violation of these rules may result in immediate membership termination and legal action.
                </p>
              </div>
            </div>
          </div>

          {/* Rules & Regulations Grid */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FaGavel className="w-5 h-5 text-green-700" />
              </div>
              <h2 className="text-xl md:text-2xl md:text-3xl font-bold text-green-900">
                Rules & Regulations
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rules.map((rule) => {
                const Icon = rule.icon;
                return (
                  <div
                    key={rule.id}
                    className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`${rule.color} w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center`}>
                        <Icon className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <h3 className="text-md md:text-lg font-bold text-gray-800">
                        {rule.title}
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {rule.points.map((point, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-600">
                          <span className="text-green-500 mt-1">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                      Rule {rule.id}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Privacy Policy Section */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaShieldAlt className="w-5 h-5 text-blue-700" />
              </div>
              <h2 className="text-xl md:text-3xl font-bold text-blue-900">
                Privacy Policy
              </h2>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
                <h3 className="text-lg md:text-xl font-bold">
                  Data Protection & Privacy Commitment
                </h3>
                <p className="text-green-100 mt-2">
                  We are committed to protecting your personal information and maintaining transparency in data handling.
                </p>
              </div>

              <div className="p-3 md:p-6 md:p-8">
                <div className="space-y-6">
                  {privacyPolicy.map((item, index) => (
                    <div
                      key={index}
                      className="pb-6 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-700 font-bold">{index + 1}</span>
                        </div>
                        <h4 className="text-md md:text-lg font-semibold text-gray-800">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-sm md:text-md text-gray-600 pl-11">
                        {item.content}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Additional Privacy Points */}
                <div className="mt-8 bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Additional Privacy Points:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                        <span className="text-green-700 text-sm">✓</span>
                      </div>
                      <p className="text-sm text-gray-600">All data collection is consent-based</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                        <span className="text-green-700 text-sm">✓</span>
                      </div>
                      <p className="text-sm text-gray-600">Regular data security audits conducted</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                        <span className="text-green-700 text-sm">✓</span>
                      </div>
                      <p className="text-sm text-gray-600">Data retention period: 7 years after membership ends</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                        <span className="text-green-700 text-sm">✓</span>
                      </div>
                      <p className="text-sm text-gray-600">Right to access and correct your personal information</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div className="mt-12 bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <FaBalanceScale className="w-6 h-6 text-green-700 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-md md:text-lg font-semibold text-green-900 mb-2">
                  Legal Disclaimer
                </h4>
                <p className="text-sm md:text-md text-gray-700 mb-3">
                  TNRAT functions strictly within the framework of the Constitution of India and all applicable laws. The Trust does not promote or support any kind of unlawful activity. Every initiative, activity, and service remains fully lawful, ethical, transparent, and responsible.
                </p>
                <p className="text-gray-700">
                  In case of any member's involvement in unlawful actions, the Trust will fully cooperate with law enforcement authorities and take immediate disciplinary action.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p className="mt-2">
              © 2018 Tahaffuz-e-Namoos-e-Risalat Action Trust. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}