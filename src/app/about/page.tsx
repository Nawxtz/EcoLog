export default function AboutPage() {
  return (
    <div className="space-y-stack-lg max-w-2xl">

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-bold text-on-surface tracking-tight">About EcoLog</h1>
        <p className="text-base text-outline mt-2 leading-relaxed">
          A personal sustainability tracker — monitor air quality and log eco-actions to understand your environmental impact.
        </p>
      </div>

      {/* ── What is EcoLog ─────────────────────────────────────────── */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant/20 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary-fixed/40 p-2.5 rounded-xl">
            <span
              className="material-symbols-outlined text-primary text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              eco
            </span>
          </div>
          <h2 className="text-lg font-bold text-on-surface">What is EcoLog?</h2>
        </div>
        <p className="text-sm text-on-surface leading-relaxed">
          EcoLog helps you understand your personal environmental footprint in two ways: by
          tracking real-time air quality data for cities you care about, and by logging everyday
          eco-friendly actions so you can see the cumulative CO₂ you&apos;re saving over time.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {[
            { icon: "location_city", label: "Monitor Cities", desc: "Save any city and track live AQI" },
            { icon: "task_alt",      label: "Log Actions",    desc: "Record eco-friendly daily choices" },
            { icon: "bar_chart",     label: "See Impact",     desc: "Visualize your CO₂ savings over time" },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="bg-surface-container p-4 rounded-xl flex flex-col gap-2">
              <span
                className="material-symbols-outlined text-primary text-[22px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {icon}
              </span>
              <p className="text-sm font-semibold text-on-surface">{label}</p>
              <p className="text-xs text-outline leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Data sources ──────────────────────────────────────────────── */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant/20 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary-fixed/40 p-2.5 rounded-xl">
            <span
              className="material-symbols-outlined text-primary text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              satellite_alt
            </span>
          </div>
          <h2 className="text-lg font-bold text-on-surface">Data Sources</h2>
        </div>
        <div className="space-y-3">
          {[
            {
              name: "Open-Meteo Air Quality API",
              url: "https://open-meteo.com",
              desc: "Provides real-time PM2.5, PM10, ozone, and nitrogen dioxide readings based on European AQI standard. Free and open-source.",
              icon: "air",
            },
            {
              name: "Open-Meteo Geocoding API",
              url: "https://open-meteo.com/en/docs/geocoding-api",
              desc: "City name lookup and coordinate resolution used for locating monitoring stations.",
              icon: "search",
            },
          ].map(({ name, url, desc, icon }) => (
            <div key={name} className="flex items-start gap-3 p-4 bg-surface-container rounded-xl">
              <span className="material-symbols-outlined text-primary text-[20px] mt-0.5 flex-shrink-0">
                {icon}
              </span>
              <div>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  {name} ↗
                </a>
                <p className="text-xs text-outline mt-1 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CO₂ calculation method ───────────────────────────────────── */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant/20 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary-fixed/40 p-2.5 rounded-xl">
            <span
              className="material-symbols-outlined text-primary text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              calculate
            </span>
          </div>
          <h2 className="text-lg font-bold text-on-surface">CO₂ Calculation</h2>
        </div>
        <p className="text-sm text-on-surface leading-relaxed">
          CO₂ savings are estimated using established emission factors. Each action type has a
          factor (kg CO₂ per unit) — the saved amount is{" "}
          <code className="bg-surface-container px-1.5 py-0.5 rounded text-xs font-mono">
            amount × factor
          </code>
          .
        </p>
        <div className="overflow-hidden rounded-xl border border-outline-variant/20">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/20">
                <th className="text-left px-4 py-3 text-xs font-semibold text-outline uppercase tracking-widest">Action</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-outline uppercase tracking-widest">Factor</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-outline uppercase tracking-widest">Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {[
                { label: "Walking",             factor: "0.21", unit: "kg CO₂ / km" },
                { label: "Cycling",             factor: "0.21", unit: "kg CO₂ / km" },
                { label: "Public Transport",    factor: "0.089", unit: "kg CO₂ / km" },
                { label: "Plant-based Meal",    factor: "1.5",  unit: "kg CO₂ / meal" },
                { label: "Recycling",           factor: "0.5",  unit: "kg CO₂ / kg" },
                { label: "Home Energy Saving",  factor: "0.233", unit: "kg CO₂ / kWh" },
              ].map(({ label, factor, unit }) => (
                <tr key={label} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-4 py-3 text-on-surface font-medium">{label}</td>
                  <td className="px-4 py-3 text-primary font-bold text-right">{factor}</td>
                  <td className="px-4 py-3 text-outline text-right text-xs">{unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-outline leading-relaxed">
          Factors are conservative estimates based on lifecycle analysis averages. Actual savings
          may vary by region, energy mix, and other factors.
        </p>
      </div>

      {/* ── Tech stack ──────────────────────────────────────────────── */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant/20 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary-fixed/40 p-2.5 rounded-xl">
            <span
              className="material-symbols-outlined text-primary text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              code
            </span>
          </div>
          <h2 className="text-lg font-bold text-on-surface">Tech Stack</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: "Next.js 14",    desc: "App Router & RSC"   },
            { name: "TypeScript",    desc: "Type safety"        },
            { name: "Tailwind CSS",  desc: "Utility-first CSS"  },
            { name: "Prisma + SQLite", desc: "Local database"   },
          ].map(({ name, desc }) => (
            <div key={name} className="bg-surface-container p-3 rounded-xl">
              <p className="text-sm font-semibold text-on-surface">{name}</p>
              <p className="text-xs text-outline mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer note ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 p-4 bg-surface-container rounded-xl border border-outline-variant/10">
        <span
          className="material-symbols-outlined text-primary text-[20px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          favorite
        </span>
        <p className="text-sm text-outline leading-relaxed">
          EcoLog is a personal project built to make environmental tracking simple and accessible.
          All data is stored locally — nothing is sent to external servers.
        </p>
      </div>
    </div>
  )
}
