"use client"

import { useState, useEffect } from "react"

interface EcoAction {
  id: number
  type: string
  description: string
  amount: number
  unit: string
  co2Saved: number
  date: string
}

const TYPE_LABELS: Record<string, string> = {
  walking:          "Walking",
  cycling:          "Cycling",
  public_transport: "Public Transport",
  plant_based_meal: "Plant-based Meal",
  recycling:        "Recycling",
  home_energy:      "Home Energy Saving",
}

const TYPE_ICONS: Record<string, string> = {
  walking:          "directions_walk",
  cycling:          "directions_bike",
  public_transport: "directions_bus",
  plant_based_meal: "eco",
  recycling:        "recycling",
  home_energy:      "bolt",
}

const BAR_COLORS = [
  "bg-primary",
  "bg-secondary",
  "bg-tertiary",
  "bg-primary/60",
  "bg-secondary/60",
  "bg-tertiary/60",
]

function StatCard({
  label, value, unit, icon, sub,
}: {
  label: string; value: string | number; unit?: string; icon: string; sub?: string
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant/20 p-5 flex items-start gap-4">
      <div className="bg-primary-fixed/40 p-3 rounded-xl flex-shrink-0">
        <span
          className="material-symbols-outlined text-primary text-[22px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
      </div>
      <div>
        <p className="text-2xl font-bold text-primary tracking-tight">
          {value}
          {unit && <span className="text-base font-medium text-outline ml-1">{unit}</span>}
        </p>
        <p className="text-sm font-semibold text-on-surface mt-0.5">{label}</p>
        {sub && <p className="text-xs text-outline mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default function ImpactPage() {
  const [actions, setActions] = useState<EcoAction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/actions")
      .then((r) => r.json())
      .then((data) => setActions(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const totalCO2 = actions.reduce((s, a) => s + a.co2Saved, 0)
  const totalActions = actions.length

  // CO₂ by type
  const byType: Record<string, { co2: number; count: number }> = {}
  for (const a of actions) {
    if (!byType[a.type]) byType[a.type] = { co2: 0, count: 0 }
    byType[a.type].co2 += a.co2Saved
    byType[a.type].count += 1
  }
  const sortedTypes = Object.entries(byType).sort((a, b) => b[1].co2 - a[1].co2)
  const maxCO2 = sortedTypes[0]?.[1].co2 ?? 1

  // Monthly trend (last 6 months)
  const now = new Date()
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return {
      label: d.toLocaleString("en", { month: "short" }),
      year: d.getFullYear(),
      month: d.getMonth(),
      co2: 0,
    }
  })
  for (const a of actions) {
    const d = new Date(a.date)
    const bucket = months.find(
      (m) => m.year === d.getFullYear() && m.month === d.getMonth()
    )
    if (bucket) bucket.co2 += a.co2Saved
  }
  const maxMonthCO2 = Math.max(...months.map((m) => m.co2), 1)

  // Equivalents
  const treeDays = Math.round(totalCO2 / 0.022)
  const kmDriven = Math.round(totalCO2 / 0.21)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-surface-container-low rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-surface-container-low rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-stack-lg">

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-bold text-on-surface tracking-tight">My Impact</h1>
        <p className="text-base text-outline mt-2 leading-relaxed">
          See your cumulative environmental impact from all logged eco actions.
        </p>
      </div>

      {totalActions === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 py-20 flex flex-col items-center text-center gap-4">
          <div className="bg-surface-container p-4 rounded-full">
            <span
              className="material-symbols-outlined text-outline text-[48px]"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              bar_chart
            </span>
          </div>
          <div>
            <p className="text-xl font-semibold text-on-surface">No data yet</p>
            <p className="text-sm text-outline mt-1">
              Log your first eco action to start tracking your impact.
            </p>
          </div>
          <a
            href="/log"
            className="mt-2 bg-primary text-on-primary px-6 py-3 rounded-full font-semibold text-sm hover:bg-on-primary-fixed-variant transition-colors shadow-primary"
          >
            Go to My Eco Log
          </a>
        </div>
      ) : (
        <>
          {/* ── Summary stat cards ──────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
            <StatCard
              label="Total CO₂ Saved"
              value={Math.round(totalCO2 * 100) / 100}
              unit="kg"
              icon="co2"
              sub="Across all actions"
            />
            <StatCard
              label="Actions Logged"
              value={totalActions}
              icon="task_alt"
              sub="Eco-friendly choices"
            />
            <StatCard
              label="Tree Equivalent"
              value={treeDays}
              unit="days"
              icon="park"
              sub="Of a tree absorbing CO₂"
            />
          </div>

          {/* ── Real-world equivalents ─────────────────────────────── */}
          <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant/20 p-6">
            <h2 className="text-sm font-semibold text-outline uppercase tracking-widest mb-5">
              Real-world Equivalents
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 bg-surface-container p-4 rounded-xl">
                <span
                  className="material-symbols-outlined text-primary text-[32px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  directions_car
                </span>
                <div>
                  <p className="text-xl font-bold text-on-surface">{kmDriven} km</p>
                  <p className="text-xs text-outline mt-0.5">Equivalent car distance avoided</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-surface-container p-4 rounded-xl">
                <span
                  className="material-symbols-outlined text-primary text-[32px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  flight
                </span>
                <div>
                  <p className="text-xl font-bold text-on-surface">
                    {Math.round((totalCO2 / 255) * 100) / 100}×
                  </p>
                  <p className="text-xs text-outline mt-0.5">Bangkok–Singapore flights offset</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Monthly trend ─────────────────────────────────────── */}
          <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant/20 p-6">
            <h2 className="text-sm font-semibold text-outline uppercase tracking-widest mb-5">
              Monthly CO₂ Savings (kg)
            </h2>
            <div className="flex items-end gap-3 h-36">
              {months.map((m) => (
                <div key={`${m.year}-${m.month}`} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-xs font-semibold text-primary">
                    {m.co2 > 0 ? Math.round(m.co2 * 10) / 10 : ""}
                  </span>
                  <div className="w-full flex-1 flex items-end">
                    <div
                      className="w-full bg-primary/20 rounded-t-md transition-all duration-500"
                      style={{ height: m.co2 === 0 ? "4px" : `${Math.max(8, (m.co2 / maxMonthCO2) * 100)}%` }}
                    >
                      <div
                        className="w-full bg-primary rounded-t-md h-full"
                        style={{ opacity: m.co2 === 0 ? 0.15 : 1 }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-outline">{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Breakdown by type ─────────────────────────────────── */}
          <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant/20 p-6">
            <h2 className="text-sm font-semibold text-outline uppercase tracking-widest mb-5">
              Breakdown by Action Type
            </h2>
            {sortedTypes.length === 0 ? (
              <p className="text-sm text-outline">No data available.</p>
            ) : (
              <div className="space-y-4">
                {sortedTypes.map(([type, { co2, count }], i) => (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">
                          {TYPE_ICONS[type] ?? "task_alt"}
                        </span>
                        <span className="text-sm font-medium text-on-surface">
                          {TYPE_LABELS[type] ?? type}
                        </span>
                        <span className="text-xs text-outline">({count} action{count !== 1 ? "s" : ""})</span>
                      </div>
                      <span className="text-sm font-bold text-primary">
                        {Math.round(co2 * 100) / 100} kg
                      </span>
                    </div>
                    <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${BAR_COLORS[i % BAR_COLORS.length]}`}
                        style={{ width: `${(co2 / maxCO2) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
