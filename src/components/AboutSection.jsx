import Leadership from "./LeaderShip";

export default function AboutSection() {
  const objectives = [
    {
      id: 1,
      icon: (
        <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      description: "To promote and spread the teachings of Maslak-e-Aala Hazrat."
    },
    {
      id: 2,
      icon: (
        <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      description: "To protect and uphold the honor and dignity of Prophets, Companions, and Saints (Awliya)."
    },
    {
      id: 3,
      icon: (
        <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      description: "To construct, maintain, and protect Mosques, Madrasas, Eidgahs, and Shrines of Awliya."
    },
    {
      id: 4,
      icon: (
        <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      description: "To provide religious and modern education to poor children."
    },
    {
      id: 5,
      icon: (
        <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      description: "To impart social knowledge to students studying in Madrasas."
    },
    {
      id: 6,
      icon: (
        <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      description: "To provide free medical services to the poor and needy and support their families financially and otherwise."
    },
    {
      id: 7,
      icon: (
        <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Protection of Values",
      description: "To safeguard the lives, property, and honor of Muslims."
    },
    {
      id: 8,
      icon: (
        <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Protection of Values",
      description: "To take legal action against those who harass or harm Muslims without reason."
    },
    {
      id: 9,
      icon: (
        <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      description: "To unite and awaken awareness among the Muslim community."
    }
  ];

  const values = [
    {
      id: 1,
      icon: (
        <svg className="w-5 h-5 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "Compassion",
      description: "We lead with empathy and understanding in all our endeavors."
    },
    {
      id: 2,
      icon: (
        <svg className="w-5 h-5 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Integrity",
      description: "Honesty and ethical conduct guide every decision we make."
    },
    {
      id: 3,
      icon: (
        <svg className="w-5 h-5 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Unity",
      description: "Together we achieve more through collaboration and mutual support."
    },
    {
      id: 4,
      icon: (
        <svg className="w-5 h-5 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Excellence",
      description: "We strive for the highest standards in all our activities and programs."
    }
  ];

  const team = [
    {
      id: 1,
      name: "Zeeshan Mirza Qadri",
      role: "National President & Founder",
      description: "Leading the organization with vision and strategic direction."
    },
    {
      id: 2,
      name: "Muhammad Sabir Razvi",
      role: "National vice president ",
      description: "Managing daily operations and organizational coordination."
    },
    {
      id: 3,
      name: "Sibghtullah Qadri",
      role: "National General secretary",
      description: "Overseeing financial management and resource allocation."
    },
    {
      id: 4,
      name: "Abdul Wahid Siddiqui ",
      role: "National Incharge",
      description: "Overseeing financial management and resource allocation."
    },
    {
      id: 5,
      name: "Gulam Nabi Raza",
      role: "National Organization minister",
      description: "National Organization minister."
    }
  ];

  return (
    <section id="about" className="bg-green-50 py-20">
      <div className="container mx-auto px-2 md:px-4">
        {/* Header */}
        <div className="text-center mb-16">
          {/* <div className="flex justify-center mb-4">
            {/* <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              L
            </div> 
          </div> */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">About TNRAT</h2>
          <h1 className="text-lg md:text-4xl font-medium text-green-900 mb-4 max-w-5xl mx-auto">
            Tahaffuz-e-Namoos-e-Risalat Action Trust (TNRAT)
          </h1>
          <h1 className="text-lg md:text-4xl font-medium text-green-900 mb-4 max-w-2xl mx-auto">
            Trust Registration No. : IV/56/2025
          </h1>
          <h3 className="text-lg md:text-2xl font-medium text-green-900 mb-4 max-w-2xl mx-auto">
            NGO Darpan (NITI Aayog) UID: UP/2025/0912337
          </h3>
          {/* Tagline */}
          <p className="text-sm md:text-lg text-black-700 mb-2 max-w-xl mx-auto">
            (Registered under Indian Trusts Act, 1882)
          </p>

          <p className="text-sm md:text-lg text-black-700 mb-2 max-w-xl mx-auto">
            Head Office: Malihabad, Lucknow (U.P.)
          </p>
          <div className="text-sm md:text-lg text-black-700 mb-8 max-w-xl mx-auto">
            To Protect the Namoos-e-Risalat <span className="text-2xl">ﷺ </span> and serving the community with Islamic values.
          </div>
        </div>

        {/* Purpose & Objective Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20 max-w-5xl mx-auto">
          {/* Our Purpose */}
          <div className="bg-white rounded-lg p-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Our Purpose</h3>
            <p className="text-sm md:text-xl text-gray-600 leading-relaxed">
              We are committed to creating a lasting impact in our community through dedicated service, educational initiatives, and welfare activities. Our purpose is to address today’s challenges with compassion, integrity, and a forward-thinking approach, working towards a better and brighter future.
            </p>
            <br />
            <p className="text-sm md:text-xl text-gray-600 leading-relaxed">
              TNRAT functions strictly within the framework of the Constitution of India and all applicable laws. We do not promote or support any kind of unlawful activity. Every initiative, activity, and service we undertake remains fully lawful, ethical, transparent, and responsible.
            </p>
          </div>

          {/* Our Objective */}
          <div className="bg-white rounded-lg p-5 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Our Objective</h3>
            <div className="space-y-6">
              {objectives?.map((objective) => (
                <div key={objective.id} className="flex items-start space-x-4">
                  <div className="bg-green-100 p-2 md:p-3 rounded-lg text-green-600 flex-shrink-0">
                    {objective.icon}
                  </div>
                  <div>
                    {/* <h4 className="text-lg font-semibold text-gray-800 mb-1">
                      {objective.title}
                    </h4> */}
                    <p className="text-gray-600 text-xs md:text-sm">
                      {objective.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-20 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Our Values</h3>
            <div className="w-20 h-1 bg-green-600 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values?.map((value) => (
              <div key={value.id} className="bg-white rounded-lg p-4 md:p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-2 rounded-lg text-green-600 flex-shrink-0">
                    {value.icon}
                  </div>
                  <div>
                    <h4 className="text-md md:text-lg font-semibold text-gray-800 mb-2">
                      {value.title}
                    </h4>
                    <p className="text-gray-600 text-xs md:text-sm">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Leadership />
      </div>
    </section>
  );
}