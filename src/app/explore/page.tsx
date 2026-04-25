"use client"

import CitySearchForm from "@/components/cities/CitySearchForm"

export default function ExplorePage() {
  return (
    <div className="space-y-8">

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="flex justify-between items-end border-b border-outline-variant pb-4">
        <div>
          <h1 className="text-[32px] font-semibold text-on-surface tracking-tighter leading-[1.2]">
            Station Search
          </h1>
          <p className="text-[16px] text-on-surface-variant mt-2 leading-[1.6]">
            Query any global node by city name — retrieve live air-quality telemetry.
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <div
            className="uppercase tracking-widest text-on-surface-variant mb-1"
            style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em" }}
          >
            Source
          </div>
          <div
            className="text-on-surface-variant flex items-center justify-end gap-1.5"
            style={{ fontSize: "12px", fontWeight: 500 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
              satellite_alt
            </span>
            Open-Meteo API
          </div>
        </div>
      </div>

      {/* ── Search panel ────────────────────────────────────────────── */}
      <div className="border border-outline bg-background">

        {/* Panel header */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-outline-variant bg-surface-container-low">
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "16px" }}>
            search
          </span>
          <span
            className="uppercase tracking-widest text-on-surface-variant"
            style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em" }}
          >
            City Query Interface
          </span>
        </div>

        {/* Form body */}
        <div className="p-6">
          <CitySearchForm />
        </div>
      </div>

      {/* ── Instruction footnote ─────────────────────────────────────── */}
      <div className="flex items-start gap-3 border-l-2 border-outline-variant pl-4">
        <span className="material-symbols-outlined text-on-surface-variant mt-0.5" style={{ fontSize: "14px" }}>
          info
        </span>
        <p
          className="text-on-surface-variant leading-[1.6]"
          style={{ fontSize: "12px", fontWeight: 500 }}
        >
          Data sourced from the Open-Meteo Air Quality API (European AQI standard).
          Select a result to fetch live telemetry, then register it as a monitored node on your dashboard.
        </p>
      </div>
    </div>
  )
}
