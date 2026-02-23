import { FaFacebook, FaTwitter, FaWhatsapp, FaInstagram } from 'react-icons/fa'


export default function Footer({facebook, instagram, twitter}) {

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <img src="/tnrat-footer-logo.png" alt="Organization Logo" className="h-10 inline-block mr-2 rounded-full" />
              <span className="text-xl font-bold text-green-400" style={{ fontFamily: 'roboto' }}>TNRAT</span>
            </div>
            <p className="text-green-500 text-lg">
              Tahaffuz e Namoos e Risalat Action Trust
            </p>
            <p className="text-gray-400 mb-4">
              To Protect the Namoos-e-Risalat
              <span className="ml-1">ﷺ </span>
              and serving the community with Islamic values.
            </p>
            <div className="flex space-x-4">
              <a
                href={`https://wa.me/918827010771?text=${encodeURIComponent("Hello! I would like to know more about your services.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition duration-300"
              >
                <FaWhatsapp />
              </a>
              <a href={facebook} target="_blank" className="text-gray-400 hover:text-white transition duration-300">
                <FaFacebook />
              </a>
              <a href={instagram} target="_blank" className="text-gray-400 hover:text-white transition duration-300">
                <FaInstagram />
              </a>
              <a href={twitter} target="_blank" className="text-gray-400 hover:text-white transition duration-300">
                <FaTwitter />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white transition duration-300">Home</a></li>
              <li><a href="post" className="text-gray-400 hover:text-white transition duration-300">Activities</a></li>
              <li><a href="about" className="text-gray-400 hover:text-white transition duration-300">About Us</a></li>
              {/* <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Get Involved</a></li> */}
              <li><a href="contact" className="text-gray-400 hover:text-white transition duration-300">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-6">
              {/* Head Office */}
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-green-400 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Head Office
                </h4>
                <p className="text-gray-300 text-sm mb-2">
                  Malihabad, Lucknow, Uttar Pradesh
                </p>
                <div className="flex items-center text-gray-400 text-sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +91 6386097118
                </div>
              </div>

              {/* Sub Head Office */}
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-green-400 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Sub Head Office
                </h4>
                <p className="text-gray-300 text-sm mb-2">
                  Mouharpara, Manendragarh, District MCB, Chhattisgarh
                </p>
                <div className="flex items-center text-gray-400 text-sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +91 8827010771
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center text-gray-400">
                <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@tnrat.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2018 TNRAT. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="privacy-policy" className="text-gray-400 hover:text-white text-sm transition duration-300">Privacy Policy</a>
              {/* <a href="#" className="text-gray-400 hover:text-white text-sm transition duration-300">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition duration-300">Disclaimer</a> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}