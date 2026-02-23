"use client";

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CiGlobe } from "react-icons/ci";

import GoogleTranslate from './GoogleTranslate';

export default function Header({ announcements = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const pathname = usePathname()


  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/become-member", label: "Become Member" },
    { href: "/contact", label: "Contact" },
    { href: "/post", label: "Activities" },
    { href: "/team", label: "Team" },
  ]

  const isActive = (path) => {
    if (path === '/') {
      return pathname === path
    }
    return pathname.startsWith(path)
  }

  return (
    <header className={`bg-white shadow-lg sticky ${announcements ? 'top-10 md:top-12' : 'top-0'} z-50 md:px-16`}>

      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-green-600 flex items-center">
            <img src="/tnrat-logo.jpeg" alt="Organization Logo" className="h-8 inline-block mr-2" />
            <span style={{ color: 'green', fontFamily: 'Roboto' }}>TNRAT</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition duration-300 ${isActive(item.href)
                  ? 'text-green-600'
                  : 'text-gray-700 hover:text-green-600'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="relative group">
            <GoogleTranslate />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className={`w-6 h-0.5 bg-gray-700 mb-1.5 transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}></div>
            <div className={`w-6 h-0.5 bg-gray-700 mb-1.5 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''
              }`}></div>
            <div className={`w-6 h-0.5 bg-gray-700 transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}></div>
          </button>

        </div>


        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-3 px-4 transition duration-300 rounded-lg ${isActive(item.href)
                  ? 'text-green-600 font-semibold bg-green-50 border-l-4 border-green-600'
                  : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header >
  )
}