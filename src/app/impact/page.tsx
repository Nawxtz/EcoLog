"use client"

import { useState, useEffect } from "react"
import ImpactChart from "@/components/impact/ImpactChart"

interface EcoAction {
  id: number
  date: string
  co2Saved: number
  type: string
}

export default function ImpactPage() {
  const [actions, setActions] = useState<EcoAction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/actions")
      .then((res) => res.json())
      .then((data) => setActions(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const totalCO2 = actions.reduce((sum, a) => sum + a.co2Saved, 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Impact</h1>
        <p className="text-gray-500 mt-1">See how your eco-actions are making a difference over time.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-green-700">{totalCO2.toFixed(2)} kg</p>
          <p className="text-gray-500 text-sm mt-1">Total CO₂ Saved</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
          <p className="text-3xl font-bold text-gray-800">{actions.length}</p>
          <p className="text-gray-500 text-sm mt-1">Total Actions Logged</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        {loading ? (
          <p className="text-gray-400 text-sm animate-pulse">Loading chart...</p>
        ) : (
          <ImpactChart actions={actions} />
        )}
      </div>
    </div>
  )
}
