"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface EcoAction {
  id: number
  date: string
  co2Saved: number
}

interface ImpactChartProps {
  actions: EcoAction[]
}

export default function ImpactChart({ actions }: ImpactChartProps) {
  // Generate ALL 30 date slots, then left-join with actual data.
  // Without this, the chart only shows days where actions were logged (sparse/disconnected).
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i)) // day 0 = 30 days ago, day 29 = today
    return d.toISOString().split("T")[0] // format: "YYYY-MM-DD"
  })

  // Sum CO₂ per day from actual actions
  const co2ByDate: Record<string, number> = {}
  for (const action of actions) {
    co2ByDate[action.date] = (co2ByDate[action.date] ?? 0) + action.co2Saved
  }

  // Merge: every day gets a slot; days with no actions get 0
  const chartData = last30Days.map((date) => ({
    date: date.slice(5), // display as "MM-DD" for readability
    co2: co2ByDate[date] ?? 0,
  }))

  const totalCO2 = actions.reduce((sum, a) => sum + a.co2Saved, 0)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-700">📈 Last 30 Days — CO₂ Saved</h2>
        <span className="text-green-700 font-bold">{totalCO2.toFixed(2)} kg total</span>
      </div>

      {actions.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">📊</p>
          <p className="font-medium">No data yet</p>
          <p className="text-sm">Log eco-actions to see your impact chart.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="co2Gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#16a34a" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={4} />
            <YAxis tick={{ fontSize: 11 }} unit=" kg" />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(2)} kg`, "CO₂ Saved"]}
            />
            <Area
              type="monotone"
              dataKey="co2"
              stroke="#16a34a"
              strokeWidth={2}
              fill="url(#co2Gradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
