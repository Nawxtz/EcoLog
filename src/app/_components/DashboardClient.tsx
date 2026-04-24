"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import CityCard from "@/components/cities/CityCard"

interface CityWithAQI {
  id: number
  name: string
  country: string
  countryCode: string
  latitude: number
  longitude: number
  aqi: any | null
}

interface DashboardClientProps {
  cities: CityWithAQI[]
  totalActions: number
  totalCO2: number
}

export default function DashboardClient({ cities, totalActions, totalCO2 }: DashboardClientProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  async function handleDelete(id: number) {
    if (!window.confirm("Remove this city from your dashboard?")) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/cities/${id}`, { method: "DELETE" })
      if (res.ok) router.refresh()
    } catch {
      alert("Failed to remove city")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">🌿 Your Environmental Dashboard</h1>
        <p className="text-gray-500 mt-1">Monitor air quality and track your eco-actions in one place.</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-sm">
          <p className="text-3xl font-bold text-gray-800">{cities.length}</p>
          <p className="text-gray-500 text-sm mt-1">Cities Monitored</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-sm">
          <p className="text-3xl font-bold text-gray-800">{totalActions}</p>
          <p className="text-gray-500 text-sm mt-1">Eco Actions Logged</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-sm">
          <p className="text-3xl font-bold text-green-700">{totalCO2} kg</p>
          <p className="text-gray-500 text-sm mt-1">CO₂ Saved</p>
        </div>
      </div>

      {/* Cities */}
      {cities.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">🗺️</p>
          <p className="text-lg font-medium">No cities saved yet.</p>
          <p className="text-sm mb-6">Search for a city to start monitoring air quality.</p>
          <Link
            href="/explore"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Explore Cities
          </Link>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-700">Saved Cities</h2>
            <Link href="/explore" className="text-green-600 hover:text-green-800 text-sm font-medium">
              + Add More
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cities.map((city) => (
              <CityCard
                key={city.id}
                {...city}
                isLoading={deletingId === city.id}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}