"use client"

import { useState } from "react"

interface GeoResult {
  id: number
  name: string
  country: string
  country_code: string
  latitude: number
  longitude: number
}

interface AQIData {
  european_aqi: number
  pm2_5: number
  pm10: number
  ozone: number
  nitrogen_dioxide: number
}

export default function CitySearchForm() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<GeoResult[]>([])
  const [selectedCity, setSelectedCity] = useState<GeoResult | null>(null)
  const [aqiData, setAqiData] = useState<AQIData | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [aqiLoading, setAqiLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [searchError, setSearchError] = useState("")
  const [saveMessage, setSaveMessage] = useState("")
  const [queryError, setQueryError] = useState("")

  async function handleSearch() {
    setQueryError("")
    if (query.trim().length < 2) {
      setQueryError("Search term must be at least 2 characters")
      return
    }
    setSearchLoading(true)
    setResults([])
    setSelectedCity(null)
    setAqiData(null)
    setSearchError("")
    try {
      const res = await fetch(`/api/geocode?name=${encodeURIComponent(query.trim())}`)
      const data = await res.json()
      if (!res.ok) {
        setSearchError(data.error?.name?.[0] ?? "Search failed")
        return
      }
      setResults(data)
      if (data.length === 0) setSearchError("No cities found. Try a different name.")
    } catch {
      setSearchError("Network error. Please try again.")
    } finally {
      setSearchLoading(false)
    }
  }

  async function handleSelectCity(city: GeoResult) {
    setSelectedCity(city)
    setAqiData(null)
    setSaveMessage("")
    setAqiLoading(true)
    try {
      const res = await fetch(`/api/air-quality?lat=${city.latitude}&lng=${city.longitude}`)
      const data = await res.json()
      if (res.ok) setAqiData(data)
    } catch {
      setAqiData(null)
    } finally {
      setAqiLoading(false)
    }
  }

  async function handleSaveCity() {
    if (!selectedCity) return
    setSaveLoading(true)
    setSaveMessage("")
    try {
      const res = await fetch("/api/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedCity.name,
          country: selectedCity.country,
          countryCode: selectedCity.country_code,
          latitude: selectedCity.latitude,
          longitude: selectedCity.longitude,
        }),
      })
      if (res.status === 201) setSaveMessage("✅ City saved to your dashboard!")
      else if (res.status === 409) setSaveMessage("ℹ️ This city is already saved.")
      else setSaveMessage("❌ Failed to save city.")
    } catch {
      setSaveMessage("❌ Network error.")
    } finally {
      setSaveLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search for a city (e.g. Bangkok, Paris, New York)"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {queryError && <p className="text-red-500 text-sm mt-1">{queryError}</p>}
        </div>
        <button
          onClick={handleSearch}
          disabled={searchLoading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 transition-colors"
        >
          {searchLoading ? "Searching..." : "Search"}
        </button>
      </div>

      {searchError && <p className="text-red-500 text-sm">{searchError}</p>}

      {/* Results List */}
      {results.length > 0 && (
        <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 overflow-hidden">
          {results.map((city) => (
            <button
              key={city.id}
              onClick={() => handleSelectCity(city)}
              className={`w-full text-left px-4 py-3 hover:bg-green-50 transition-colors ${
                selectedCity?.id === city.id ? "bg-green-50 font-medium" : ""
              }`}
            >
              <span className="font-medium">{city.name}</span>
              <span className="text-gray-500 text-sm ml-2">{city.country} ({city.country_code})</span>
            </button>
          ))}
        </div>
      )}

      {/* Selected City AQI Panel */}
      {selectedCity && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-start flex-wrap gap-3">
            <div>
              <h3 className="text-lg font-bold text-gray-800">{selectedCity.name}</h3>
              <p className="text-gray-500 text-sm">{selectedCity.country}</p>
            </div>
            <button
              onClick={handleSaveCity}
              disabled={saveLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
            >
              {saveLoading ? "Saving..." : "Save to Dashboard"}
            </button>
          </div>
          {saveMessage && <p className="text-sm font-medium">{saveMessage}</p>}

          {aqiLoading ? (
            <p className="text-gray-400 text-sm animate-pulse">Loading air quality data...</p>
          ) : aqiData ? (
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">European AQI</p>
                <span className="text-2xl font-bold text-gray-800">{aqiData.european_aqi}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                <div>PM2.5: <strong>{aqiData.pm2_5} μg/m³</strong></div>
                <div>PM10: <strong>{aqiData.pm10} μg/m³</strong></div>
                <div>Ozone: <strong>{aqiData.ozone} μg/m³</strong></div>
                <div>NO₂: <strong>{aqiData.nitrogen_dioxide} μg/m³</strong></div>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Air quality data not available for this location.</p>
          )}
        </div>
      )}
    </div>
  )
}
