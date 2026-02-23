"use client";

import { FaTrophy, FaAward, FaHandsHelping, FaHeart } from "react-icons/fa";

export default function AchievementSection() {
  return (
    <section className="bg-green-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-black mb-3">
              International Recognition
            </h2>
            <p className="text-green-700 max-w-2xl mx-auto">
              Honoured for our humanitarian service and dedication
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-stretch"> {/* Changed to items-stretch */}
            {/* Left: Certificate Image - Equal height column */}
            <div className="lg:w-2/5 flex">
              <div className="relative bg-white p-6 rounded-2xl shadow-lg border border-green-200 w-full flex flex-col"> {/* Added flex flex-col */}
                <div className="flex-grow flex items-center justify-center"> {/* Center content vertically */}
                  <img
                    src="/achievement.jpeg"
                    alt="IHRC Certificate of Appreciation"
                    className="w-full h-auto max-h-[400px] object-contain rounded-lg shadow-md border border-green-100"
                  />
                </div>
                <div className="mt-4 text-center pt-4 border-t border-green-100"> {/* Added padding top and border */}
                  <div className="inline-flex items-center gap-2 text-black text-sm">
                    <FaAward className="w-4 h-4 text-yellow-500" />
                    <span>International Human Rights Commission</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Content - Equal height column */}
            <div className="lg:w-3/5 flex">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-green-100 w-full flex flex-col"> {/* Added flex flex-col */}
                {/* Title */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-yellow-50 rounded-full">
                      <FaTrophy className="w-5 h-5 text-yellow-500" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-green-900">
                      Awarded Certificate of Appreciation by IHRC
                    </h3>
                  </div>
                </div>

                {/* Content - This will expand to fill space */}
                <div className="space-y-4 text-gray-700 flex-grow">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-50 rounded-full mt-1">
                      <FaHandsHelping className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-justify">
                      <span className="font-semibold text-green-800">Tahaffuz-e-Namoos-e-Risalat Action Trust (TNRAT) – India</span> has been honoured with the Certificate of Appreciation by the <span className="font-semibold">International Human Rights Commission (IHRC)</span>.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-50 rounded-full mt-1">
                      <FaHeart className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-justify">
                      This prestigious recognition was awarded for TNRAT's remarkable <span className="font-semibold">service, devotion, and sacrifice during the COVID-19 pandemic</span> — especially for helping and protecting the less privileged in one of the most challenging times in recent history. This certificate was officially awarded on 16 May 2020.
                    </p>
                  </div>

                  <p className="text-justify pl-10">
                    TNRAT's humanitarian efforts, relief work, and commitment to serve the community without discrimination have earned appreciation at an international level.
                  </p>

                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600 my-4">
                    <p className="italic text-green-800 font-medium text-justify">
                      "This certificate stands as a strong testament to TNRAT's mission, sincerity, and unwavering dedication to the welfare of society."
                    </p>
                  </div>

                  <p className="text-justify font-bold text-green-900 text-center lg:text-left">
                    TNRAT — Committed to Justice, Peace, and Service to the Ummah.
                  </p>
                </div>

                {/* Optional: Add some bottom spacing if needed */}
                <div className="mt-4 pt-4 border-t border-green-100 text-center">
                  <span className="text-sm text-green-700">
                    🏆 Awarded for Excellence in Humanitarian Service
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}