"use client";

import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaFacebook, FaTwitter, FaWhatsapp, FaInstagram } from 'react-icons/fa'

export default function ContactUs() {

  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');

  const getSocialLinks = async () => {
    try {
      const res = await axios.get('/api/global');

      const result = res?.data;

      if (result?.status === true) {
        setFacebook(result?.global?.facebook || '');
        setInstagram(result?.global?.instagram || '');
        setTwitter(result?.global?.twitter || '');
      }
    } catch (error) {
      console.error('Error fetching current platform fee:', error);
    }
  };

  useEffect(() => {
    getSocialLinks();
  }, []);


  const contactMethods = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: "Head Office",
      details: "Malihabad, Lucknow, Uttar Pradesh",
      description: "Our main office location"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: "Sub Head Office",
      details: "Mouharpara, Manendragarh, District MCB, Chhattisgarh",
      description: "Our second office location"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: "Call Us",
      details: "+91 6386097118",
      description: "Head Office Phone"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: "Call Us",
      details: "+91 8827010771",
      description: "Sub Head Office Phone"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Email Us",
      details: "info@tnrat.org",
      description: "Send us your query anytime"
    }
  ];

  const faqs = [
    {
      question: "How can I volunteer with TNRAT?",
      answer: "You can fill out our volunteer form on the Become Member page or contact us directly for current opportunities."
    },
    {
      question: "Where does my contribution go?",
      answer: "100% of your contribution directly supports our programs in education, healthcare, and community development."
    },
    {
      question: "How can I track my contribution impact?",
      answer: "We send quarterly impact reports to all our donors showing how their contributions are making a difference."
    }
  ];

  return (
    <div className="min-h-screen bg-green-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h1>
          <div className="w-24 h-1 bg-green-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Get in touch with us. We're here to help and answer any questions you might have.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 border border-green-300 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>

              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-lg text-green-600 flex-shrink-0">
                      {method.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{method.title}</h3>
                      <p className="text-gray-700 font-medium">{method.details}</p>
                      <p className="text-gray-500 text-sm">{method.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Media */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href={facebook} target="_blank" className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-green-100 hover:text-green-600 transition duration-300">
                    <FaFacebook />
                  </a>
                  <a href={instagram} target="_blank" className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-green-100 hover:text-green-600 transition duration-300">
                    <FaInstagram />
                  </a>
                  <a href={twitter} target="_blank" className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-green-100 hover:text-green-600 transition duration-300">
                    <FaTwitter />
                  </a>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-2xl p-8 border border-green-300 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                    <h3 className="font-semibold text-gray-800 mb-2 text-lg">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 border border-green-300 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Find Our Offices</h2>

              {/* Head Office Map */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  Head Office Location
                </h3>
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="font-medium">Malihabad, Lucknow</p>
                    <p className="text-sm">Uttar Pradesh, India</p>
                  </div>
                </div>
              </div>

              {/* Sub Head Office Map */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  Sub Head Office Location
                </h3>
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="font-medium">Mouharpara, Manendragarh</p>
                    <p className="text-sm">District MCB, Chhattisgarh, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-white rounded-2xl p-8 border border-green-300 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Operating Hours</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-700">Monday - Thursday</span>
                  <span className="font-semibold text-gray-800">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-700">Friday</span>
                  <span className="font-semibold text-gray-800">Closed</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-700">Saturday - Sunday</span>
                  <span className="font-semibold text-gray-800">9:00 AM - 6:00 PM</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}