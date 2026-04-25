import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/layout/Header"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EcoLog — Track Your Environmental Impact",
  description: "Monitor air quality and log eco-actions to track your carbon footprint",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Material Symbols — required for all icons across the app */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className={`${inter.className} bg-background text-on-background antialiased`}>
        {/*
          Layout architecture:
          ┌──────────┬──────────────────────────────┐
          │  Sidebar │  Header (sticky)              │
          │  (lg)    │  Main content (scrolls)       │
          │          │  Footer                       │
          └──────────┴──────────────────────────────┘
          On mobile: sidebar is hidden, bottom nav bar appears instead.
          overflow-hidden on root + overflow-y-auto on the right column
          keeps the sidebar pinned while content scrolls independently.
        */}
        <div className="flex h-screen overflow-hidden">
          {/* Renders: fixed sidebar on lg, fixed bottom nav on mobile */}
          <Navbar />

          {/* Main scrollable column — offset by sidebar width on lg */}
          <div className="flex-1 flex flex-col lg:ml-64 h-screen overflow-y-auto">
            <Header />

            <main className="flex-1 p-8 max-w-[1440px] mx-auto w-full pb-24 lg:pb-8">
              {children}
            </main>

            {/* Footer — hidden on mobile (bottom nav takes its place) */}
            <div className="hidden lg:block">
              <Footer />
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
