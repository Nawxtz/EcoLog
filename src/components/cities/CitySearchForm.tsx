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

/**
 * AQI severity label — inline so CitySearchForm has no external dependency
 * when displayed in isolation (avoids coupling to aqiHelpers for this panel).
 */
function aqiLabel(aqi: number): string {
  if (aqi <= 20) return "GOOD"
  if (aqi <= 40) return "FAIR"
  if (aqi <= 60) return "MODERATE"
  if (aqi <= 80) return "POOR"
  return "VERY POOR"
}

function aqiBadgeClasses(aqi: number): string {
  if (aqi <= 20) return "border-primary text-primary"
  if (aqi <= 40) return "border-outline text-on-surface-variant"
  if (aqi <= 60) return "border-outline text-on-surface bg-surface-container"
  return "border-error text-error"
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
      setQueryError("Search term must be at least 2 characters.")
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
        setSearchError(data.error?.name?.[0] ?? "Search failed.")
        return
      }
      setResults(data)
      if (data.length === 0) setSearchError("No stations found. Try a different query.")
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
      if (res.status === 201) setSaveMessage("REGISTERED — Node added to your dashboard.")
      else if (res.status === 409) setSaveMessage("DUPLICATE — This node is already registered.")
      else setSaveMessage("ERROR — Registration failed. Try again.")
    } catch {
      setSaveMessage("ERROR — Network failure.")
    } finally {
      setSaveLoading(false)
    }
  }

  return (
    <div className="space-y-6">

      {/* ── Search input row ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-0">
        <div className="flex-1 flex flex-col">
          {/* Bottom-border input — "simple bottom-border or 1px box" per DESIGN.md */}
          <div className="relative flex-1">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant pointer-events-none"
              style={{ fontSize: "18px" }}
            >
              search
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Enter city name (e.g. Bangkok, Paris, New York)"
              className="
                w-full bg-transparent
                border border-outline-variant
                text-on-surface placeholder-on-surface-variant/50
                pl-10 pr-4 py-3
                focus:outline-none focus:border-primary
                transition-colors
                text-[14px] font-medium
              "
              style={{ borderRadius: 0 }}
            />
          </div>
          {queryError && (
            <p
              className="text-error mt-1 flex items-center gap-1"
              style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>warning</span>
              {queryError}
            </p>
          )}
        </div>

        {/* Search button — rectangular, 1px border */}
        <button
          onClick={handleSearch}
          disabled={searchLoading}
          className="
            border border-outline hover:border-primary
            bg-transparent hover:bg-surface-container
            text-on-surface hover:text-primary
            px-6 py-3 flex items-center justify-center gap-2
            transition-all disabled:opacity-40 disabled:cursor-not-allowed
            sm:border-l-0
          "
          style={{
            borderRadius: 0,
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            minWidth: "120px",
          }}
        >
          {searchLoading ? (
            <>
              <span className="material-symbols-outlined animate-spin" style={{ fontSize: "16px" }}>
                progress_activity
              </span>
              QUERYING
            </>
          ) : (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                travel_explore
              </span>
              SEARCH
            </>
          )}
        </button>
      </div>

      {/* Search-level error */}
      {searchError && (
        <div className="flex items-center gap-2 border border-error/50 bg-error-container/20 px-4 py-2">
          <span className="material-symbols-outlined text-error" style={{ fontSize: "14px" }}>
            error
          </span>
          <span
            className="text-error"
            style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.04em" }}
          >
            {searchError}
          </span>
        </div>
      )}

      {/* ── Results list ─────────────────────────────────────────────── */}
      {results.length > 0 && (
        <div className="border border-outline-variant divide-y divide-outline-variant">
          {/* List header */}
          <div className="px-4 py-2 bg-surface-container-low flex items-center gap-2">
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "13px" }}>
              list
            </span>
            <span
              className="uppercase tracking-widest text-on-surface-variant"
              style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.1em" }}
            >
              {results.length} result{results.length !== 1 ? "s" : ""} — select to retrieve telemetry
            </span>
          </div>
          {results.map((city) => {
            const isSelected = selectedCity?.id === city.id
            return (
              <button
                key={city.id}
                onClick={() => handleSelectCity(city)}
                className={`
                  w-full text-left px-4 py-3
                  flex items-center justify-between
                  transition-colors group
                  ${isSelected
                    ? "bg-surface-container border-l-2 border-primary"
                    : "hover:bg-surface-container/50"
                  }
                `}
              >
                <div className="flex items-baseline gap-2">
                  <span
                    className={`font-medium ${isSelected ? "text-primary" : "text-on-surface"}`}
                    style={{ fontSize: "14px" }}
                  >
                    {city.name}
                  </span>
                  <span
                    className="text-on-surface-variant"
                    style={{ fontSize: "12px", fontWeight: 500 }}
                  >
                    {city.country}
                  </span>
                  <span
                    className="border border-outline-variant text-on-surface-variant px-1"
                    style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.08em", borderRadius: 0 }}
                  >
                    {city.country_code}
                  </span>
                </div>
                <span
                  className={`material-symbols-outlined transition-colors ${
                    isSelected ? "text-primary" : "text-outline group-hover:text-on-surface-variant"
                  }`}
                  style={{ fontSize: "16px" }}
                >
                  {isSelected ? "sensors" : "chevron_right"}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* ── Selected city telemetry panel ────────────────────────────── */}
      {selectedCity && (
        <div className="border border-outline bg-background">

          {/* Panel header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-outline-variant bg-surface-container-low">
            <div className="flex items-center gap-3">
              <span
                className={`material-symbols-outlined ${aqiLoading ? "text-outline animate-pulse" : "text-primary"}`}
                style={{ fontSize: "16px" }}
              >
                {aqiLoading ? "sensors" : aqiData ? "sensors" : "sensors_off"}
              </span>
              <div>
                <span
                  className="uppercase tracking-widest text-on-surface-variant"
                  style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.1em" }}
                >
                  Live Telemetry
                </span>
                <div
                  className="text-on-surface font-medium"
                  style={{ fontSize: "14px" }}
                >
                  {selectedCity.name},{" "}
                  <span className="text-on-surface-variant">{selectedCity.country}</span>
                </div>
              </div>
            </div>

            {/* Register node button */}
            <button
              onClick={handleSaveCity}
              disabled={saveLoading}
              className="
                border border-primary text-primary
                hover:bg-primary hover:text-on-primary
                px-4 py-2 flex items-center gap-2
                transition-all disabled:opacity-40 disabled:cursor-not-allowed
              "
              style={{
                borderRadius: 0,
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                {saveLoading ? "hourglass_empty" : "add_location"}
              </span>
              {saveLoading ? "Saving..." : "Register Node"}
            </button>
          </div>

          {/* Save feedback */}
          {saveMessage && (
            <div
              className={`px-5 py-2 border-b border-outline-variant flex items-center gap-2 ${
                saveMessage.startsWith("REGISTERED")
                  ? "bg-primary/10 text-primary"
                  : saveMessage.startsWith("DUPLICATE")
                  ? "bg-surface-container text-on-surface-variant"
                  : "bg-error-container/20 text-error"
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                {saveMessage.startsWith("REGISTERED")
                  ? "check_circle"
                  : saveMessage.startsWith("DUPLICATE")
                  ? "info"
                  : "error"}
              </span>
              <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em" }}>
                {saveMessage}
              </span>
            </div>
          )}

          {/* Telemetry data */}
          <div className="p-5">
            {aqiLoading ? (
              <div className="flex items-center gap-3 py-4">
                <span
                  className="material-symbols-outlined text-on-surface-variant animate-pulse"
                  style={{ fontSize: "20px" }}
                >
                  progress_activity
                </span>
                <span
                  className="text-on-surface-variant animate-pulse"
                  style={{ fontSize: "12px", fontWeight: 500 }}
                >
                  Retrieving air-quality data…
                </span>
              </div>
            ) : aqiData ? (
              <div className="space-y-3">
                {/* AQI headline value */}
                <div className="flex items-end justify-between border-b border-outline-variant pb-4 mb-4">
                  <div>
                    <div
                      className="uppercase tracking-widest text-on-surface-variant mb-1"
                      style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em" }}
                    >
                      European AQI
                    </div>
                    <div className="text-[48px] font-semibold tabular-nums text-on-surface tracking-tighter leading-none">
                      {aqiData.european_aqi}
                    </div>
                  </div>
                  {/* Sharp AQI badge */}
                  <span
                    className={`border px-3 py-1.5 ${aqiBadgeClasses(aqiData.european_aqi)}`}
                    style={{
                      borderRadius: 0,
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {aqiLabel(aqiData.european_aqi)}
                  </span>
                </div>

                {/* Secondary data rows */}
                {[
                  { label: "PM2.5", value: `${aqiData.pm2_5} μg/m³` },
                  { label: "PM10",  value: `${aqiData.pm10} μg/m³`  },
                  { label: "Ozone", value: `${aqiData.ozone} μg/m³` },
                  { label: "NO₂",   value: `${aqiData.nitrogen_dioxide} μg/m³` },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between items-baseline">
                    <span
                      className="uppercase text-on-surface-variant"
                      style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em" }}
                    >
                      {row.label}
                    </span>
                    <span
                      className="tabular-nums text-on-surface"
                      style={{ fontSize: "14px", fontWeight: 500 }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3 py-4 opacity-50">
                <span className="material-symbols-outlined text-outline" style={{ fontSize: "20px" }}>
                  sensors_off
                </span>
                <span
                  className="text-on-surface-variant"
                  style={{ fontSize: "12px", fontWeight: 500 }}
                >
                  Air quality data not available for this location.
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
