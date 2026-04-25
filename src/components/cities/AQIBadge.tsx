import { getAQILabel, getAQIBadgeClasses } from "@/lib/aqiHelpers"

interface AQIBadgeProps {
  aqi: number
}

/**
 * Maps a European AQI value to design-system color tokens.
 * No border-radius. Strict 1px border. label-sm typography.
 * Matches DESIGN.md "Chips/Tags: small, sharp-edged boxes."
 */
function getAQITokenClasses(aqi: number): string {
  if (aqi <= 20) {
    // Good — primary sage green
    return "border-primary text-primary bg-transparent"
  }
  if (aqi <= 40) {
    // Fair — neutral outline
    return "border-outline text-on-surface-variant bg-transparent"
  }
  if (aqi <= 60) {
    // Moderate — elevated, on-surface
    return "border-outline text-on-surface bg-surface-container"
  }
  if (aqi <= 80) {
    // Poor — error accent
    return "border-error text-error bg-transparent"
  }
  // Very Poor — error fill
  return "border-error text-on-error bg-error-container"
}

export default function AQIBadge({ aqi }: AQIBadgeProps) {
  const colorClasses = getAQITokenClasses(aqi)

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        border px-2 py-0.5
        ${colorClasses}
      `}
      style={{
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.06em",
        lineHeight: 1,
        borderRadius: 0,       // enforce sharp corners even if global defaults change
        textTransform: "uppercase",
      }}
    >
      <span className="tabular-nums">{aqi}</span>
      <span
        className="opacity-70"
        style={{ fontSize: "9px", letterSpacing: "0.08em" }}
      >
        {getAQILabel(aqi)}
      </span>
    </span>
  )
}
