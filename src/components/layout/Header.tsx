"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header() {
  const pathname = usePathname()

  // Derive a readable page title for mobile breadcrumb
  const pageTitle: Record<string, string> = {
    "/":        "Dashboard",
    "/explore": "Explore",
    "/log":     "My Eco Log",
    "/impact":  "My Impact",
    "/about":   "About",
  }
  const currentTitle = pageTitle[pathname] ?? "EcoLog"

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-outline-variant/40 shadow-sm flex justify-between items-center w-full px-6 py-3 flex-shrink-0">

      {/* Left — mobile: logo + page title; desktop: status indicator */}
      <div className="flex items-center gap-2">
        {/* Mobile logo (hidden on large screens — sidebar has the brand) */}
        <Link href="/" className="lg:hidden flex items-center gap-2">
          <span
            className="material-symbols-outlined text-primary text-[28px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            eco
          </span>
          <span className="text-xl font-bold text-primary tracking-tight">
            EcoLog
          </span>
        </Link>

        {/* Desktop current-page label */}
        <span className="hidden lg:block text-sm text-outline">
          Global Network Status:{" "}
          <span className="text-primary font-semibold">Online</span>
        </span>

        {/* Mobile current page */}
        <span className="lg:hidden text-sm font-semibold text-on-surface ml-2">
          {currentTitle}
        </span>
      </div>

      {/* Right — intentionally empty: no dummy buttons per project rules */}
    </header>
  )
}
