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

  const statCards = [
    {
      label: "Cities Monitored",
      value: cities.length,
      unit: "",
      icon: "location_city",
      color: "text-primary",
      bg: "bg-surface-container-low",
    },
    {
      label: "Eco Actions Logged",
      value: totalActions,
      unit: "",
      icon: "task_alt",
      color: "text-secondary",
      bg: "bg-secondary-container/30",
    },
    {
      label: "CO₂ Saved",
      value: totalCO2,
      unit: "kg",
      icon: "eco",
      color: "text-primary",
      bg: "bg-primary-fixed/40",
    },
  ]

  return (
    <div className="space-y-stack-lg">

      {/* ── Page header ─────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-bold text-on-surface tracking-tight">
          Your Environmental Dashboard
        </h1>
        <p className="text-base text-outline mt-2 leading-relaxed">
          Monitor air quality across your saved cities and track your eco-actions in one place.
        </p>
      </div>

      {/* ── Summary stat cards ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
        {statCards.map(({ label, value, unit, icon, color, bg }) => (
          <div
            key={label}
            className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant/20 p-6 flex items-center gap-4"
          >
            <div className={`${bg} p-3 rounded-xl flex-shrink-0`}>
              <span className={`material-symbols-outlined ${color} text-[24px]`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {icon}
              </span>
            </div>
            <div>
              <p className={`text-3xl font-bold tracking-tight ${color}`}>
                {value}
                {unit && <span className="text-lg font-medium text-outline ml-1">{unit}</span>}
              </p>
              <p className="text-sm text-outline mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Cities section ──────────────────────────────────────── */}
      {cities.length === 0 ? (
        /* Empty state */
        <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant/20 py-16 flex flex-col items-center text-center gap-4">
          <div className="bg-surface-container p-4 rounded-full">
            <span
              className="material-symbols-outlined text-outline text-[48px]"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              travel_explore
            </span>
          </div>
          <div>
            <p className="text-xl font-semibold text-on-surface">No cities saved yet.</p>
            <p className="text-sm text-outline mt-1">
              Search for a city to start monitoring air quality.
            </p>
          </div>
          <Link
            href="/explore"
            className="mt-2 bg-primary text-on-primary px-6 py-3 rounded-full font-semibold text-sm hover:bg-on-primary-fixed-variant transition-colors shadow-primary"
          >
            Explore Cities
          </Link>
        </div>
      ) : (
        <>
          {/* Section header */}
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-outline uppercase tracking-widest">
              Monitored Locations — {cities.length} saved
            </h2>
            <Link
              href="/explore"
              className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Add City
            </Link>
          </div>

          {/* City cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
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
