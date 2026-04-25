// app/page.tsx
import { prisma } from "@/lib/prisma"
import DashboardClient from "./_components/DashboardClient"

// Helper: fetch AQI for a single city
async function fetchAQI(lat: number, lng: number) {
  const res = await fetch(
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=pm10,pm2_5,ozone,nitrogen_dioxide,european_aqi&timezone=auto`,
    { cache: "no-store" }
  )
  if (!res.ok) throw new Error("AQI fetch failed")
  const data = await res.json()
  if (!data.current) throw new Error("No AQI data")
  return data.current
}

export default async function DashboardPage() {
  // Fetch saved cities from DB
  const cities = await prisma.savedCity.findMany({ orderBy: { createdAt: "desc" } })

  // Promise.allSettled: if one city's AQI fails, the page does NOT crash.
  const aqiResults = await Promise.allSettled(
    cities.map((city) => fetchAQI(city.latitude, city.longitude))
  )

  const citiesWithAQI = cities.map((city, i) => ({
    ...city,
    aqi: aqiResults[i].status === "fulfilled" ? aqiResults[i].value : null,
  }))

  // Summary stats
  const actions = await prisma.ecoAction.findMany()
  const totalCO2 = actions.reduce((sum, a) => sum + a.co2Saved, 0)

  return (
    <DashboardClient
      cities={citiesWithAQI}
      totalActions={actions.length}
      totalCO2={Math.round(totalCO2 * 100) / 100}
    />
  )
}
