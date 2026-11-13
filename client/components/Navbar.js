"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-teal-600">
          Dr. Nitin Dental
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <li><a href="#services" className="hover:text-teal-600">Services</a></li>
          <li><a href="#book" className="hover:text-teal-600">Book Appointment</a></li>
          <li>
            <Link href="/admin" className="text-teal-600 font-medium hover:underline">
              Admin
            </Link>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-3 text-sm text-gray-600">
          <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#book" onClick={() => setMenuOpen(false)}>Book Appointment</a>
          <Link href="/admin" onClick={() => setMenuOpen(false)} className="text-teal-600 font-medium">
            Admin
          </Link>
        </div>
      )}
    </nav>
  );
}
