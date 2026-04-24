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
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>
        <Header />
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
