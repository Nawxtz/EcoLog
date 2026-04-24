export function getAQILabel(aqi: number): string {
  if (aqi <= 20) return "Good"
  if (aqi <= 40) return "Fair"
  if (aqi <= 60) return "Moderate"
  if (aqi <= 80) return "Poor"
  if (aqi <= 100) return "Very Poor"
  return "Extremely Poor"
}

export function getAQIBadgeClasses(aqi: number): string {
  if (aqi <= 20) return "bg-green-100 text-green-800 border-green-300"
  if (aqi <= 40) return "bg-lime-100 text-lime-800 border-lime-300"
  if (aqi <= 60) return "bg-yellow-100 text-yellow-800 border-yellow-300"
  if (aqi <= 80) return "bg-orange-100 text-orange-800 border-orange-300"
  if (aqi <= 100) return "bg-red-100 text-red-800 border-red-300"
  return "bg-purple-100 text-purple-800 border-purple-300"
}