"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/explore", label: "Explore" },
  { href: "/log", label: "My Eco Log" },
  { href: "/impact", label: "My Impact" },
  { href: "/about", label: "About" },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-green-800 text-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Desktop nav */}
        <div className="hidden md:flex gap-1 py-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-green-600 text-white"
                  : "text-green-200 hover:bg-green-700 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger button */}
        <div className="md:hidden flex items-center justify-between py-2">
          <span className="text-sm font-medium text-green-200">Menu</span>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded text-green-200 hover:bg-green-700 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile dropdown */}
        {isOpen && (
          <div className="md:hidden pb-2 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-green-600 text-white"
                    : "text-green-200 hover:bg-green-700 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
