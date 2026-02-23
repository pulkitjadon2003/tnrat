"use client";

import { useRouter } from "next/navigation";


export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="bg-green-50 py-16">
      <div className="container mx-auto px-4 text-center">
        <div className="rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
          <img
            src="/tnrat-logo.png"
            alt="TNRAT Logo"
            className="h-30 w-30 object-contain"
          />
        </div>

        {/* Organization Name */}
        <h2 className="text-3xl font-semibold text-green-800 mb-2">
          TNRAT
        </h2>

        {/* Main Heading */}
        <h1 className="text-2xl md:text-4xl font-medium text-green-900 mb-4 max-w-2xl mx-auto">
          Tahaffuz-e-Namoos-e-Risalat Action Trust
        </h1>

        {/* Tagline */}
        <div className="text-sm md:text-lg text-black-700 mb-8 max-w-xl mx-auto">
          
            To Protect the Namoos-e-Risalat ﷺ and serving the community with Islamic values.
          
        </div>

        {/* Buttons */}
        <div className="space-x-4">
          <button
            onClick={() => router.push("/become-member")}
            className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition duration-300 cursor-pointer w-full sm:w-auto mb-4 sm:mb-0"
          >
            Join Our Mission
          </button>

          <button
            onClick={() => router.push("/donate")}
            className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition duration-300 cursor-pointer w-full sm:w-auto"
          >
            Contribute Now
          </button>
        </div>
      </div>
    </section>
  );
}