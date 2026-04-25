"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

// All 5 routes from the project plan — all pages are real
const navLinks = [
  { href: "/",        label: "Dashboard",  icon: "dashboard",   mobileIcon: "home"        },
  { href: "/explore", label: "Explore",    icon: "explore",     mobileIcon: "search"      },
  { href: "/log",     label: "My Eco Log", icon: "eco",         mobileIcon: "eco"         },
  { href: "/impact",  label: "My Impact",  icon: "bar_chart",   mobileIcon: "bar_chart"   },
  { href: "/about",   label: "About",      icon: "info",        mobileIcon: "info"        },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <>
      {/* ── DESKTOP: Fixed left sidebar ────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-white border-r border-outline-variant/30 py-8 px-4 z-20">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 mb-10 px-4">
          <span
            className="material-symbols-outlined text-primary text-[32px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            eco
          </span>
          <div>
            <h1 className="text-lg font-black text-primary tracking-tight leading-none">
              EcoLog
            </h1>
            <p className="text-[10px] uppercase tracking-wider text-outline mt-0.5">
              Sustainability Suite
            </p>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="flex flex-col gap-1.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                  transition-colors duration-150
                  ${isActive
                    ? "bg-emerald-50 text-primary border-r-4 border-primary"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                  }
                `}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* ── MOBILE: Fixed bottom navigation bar ────────────────────────── */}
      {/*
        Shows the 4 primary routes. "About" is available via the sidebar on desktop;
        on mobile, users can reach it by navigating to /about directly.
        We show the 4 most-used routes to avoid crowding the bar.
      */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 bg-white/90 backdrop-blur-lg border-t border-outline-variant/40 shadow-top rounded-t-2xl flex justify-around items-center px-4 pb-6 pt-3">
        {navLinks.slice(0, 4).map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex flex-col items-center justify-center rounded-lg p-2 min-w-[56px]
                transition-colors duration-150
                ${isActive
                  ? "text-primary scale-110"
                  : "text-outline hover:text-on-surface"
                }
              `}
            >
              <span
                className="material-symbols-outlined text-[24px] mb-0.5"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {link.mobileIcon}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
                {link.label.split(" ")[0]}
              </span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
