export function getAQILabel(aqi: number): string {
  if (aqi <= 20) return "Good"
  if (aqi <= 40) return "Fair"
  if (aqi <= 60) return "Moderate"
  if (aqi <= 80) return "Poor"
  if (aqi <= 100) return "Very Poor"
  return "Extremely Poor"
}

/**
 * Returns Tailwind classes for the AQI pill badge.
 * Uses design-system color tokens from DESIGN.md / tailwind.config.js.
 * All badges are pill-shaped (rounded-full) — border class is included here
 * so the component only needs to add sizing classes.
 */
export function getAQIBadgeClasses(aqi: number): string {
  // Good — soft emerald (secondary-container palette)
  if (aqi <= 20) return "bg-secondary-container text-on-secondary-container border border-secondary-fixed-dim/30"
  // Fair — primary-fixed light tint
  if (aqi <= 40) return "bg-primary-fixed text-on-primary-fixed border border-primary-fixed-dim/40"
  // Moderate — neutral surface variant
  if (aqi <= 60) return "bg-surface-variant text-on-surface-variant border border-outline-variant/50"
  // Poor — tertiary (sky blue tint)
  if (aqi <= 80) return "bg-tertiary-fixed text-on-tertiary-fixed border border-tertiary-fixed-dim/40"
  // Very Poor / Extremely Poor — error palette
  return "bg-error-container text-on-error-container border border-error/20"
}
