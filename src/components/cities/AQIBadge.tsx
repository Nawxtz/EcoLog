import { getAQILabel, getAQIBadgeClasses } from "@/lib/aqiHelpers"

interface AQIBadgeProps { aqi: number }

export default function AQIBadge({ aqi }: AQIBadgeProps) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getAQIBadgeClasses(aqi)}`}>
      {aqi} — {getAQILabel(aqi)}
    </span>
  )
}
