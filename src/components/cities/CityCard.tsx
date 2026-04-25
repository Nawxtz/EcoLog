import AQIBadge from "./AQIBadge"

interface AQIData {
  european_aqi: number
  pm2_5: number
  pm10: number
  ozone: number
  nitrogen_dioxide: number
}

interface CityCardProps {
  id: number
  name: string
  country: string
  countryCode: string
  aqi: AQIData | null
  isLoading: boolean
  onDelete: (id: number) => void
}

/** Progress bar width as a percentage, capped at 100% */
function aqiPercent(aqi: number): string {
  return `${Math.min(100, Math.round(aqi))}%`
}

/** Inner bar color based on AQI severity */
function aqiBarColor(aqi: number): string {
  if (aqi <= 40)  return "bg-primary"          // Good / Fair — emerald
  if (aqi <= 60)  return "bg-secondary"        // Moderate — sage
  if (aqi <= 80)  return "bg-tertiary"         // Poor — sky blue
  return "bg-error"                             // Very Poor+ — red
}

export default function CityCard({
  id, name, country, countryCode,
  aqi, isLoading, onDelete,
}: CityCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant/20 p-5 flex flex-col gap-4 hover:border-primary/30 transition-colors">

      {/* ── Card header: city name + remove button ─────────────────── */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-on-surface tracking-tight">
            {name}
          </h3>
          <p className="text-sm text-outline flex items-center gap-1 mt-0.5">
            <span className="material-symbols-outlined text-[14px]">location_on</span>
            {country}
            <span className="bg-surface-container text-on-surface-variant text-[10px] font-semibold px-1.5 py-0.5 rounded ml-1">
              {countryCode}
            </span>
          </p>
        </div>

        <button
          onClick={() => onDelete(id)}
          disabled={isLoading}
          aria-label={`Remove ${name}`}
          className="p-1.5 text-outline hover:text-error hover:bg-error-container/30 rounded-lg transition-colors disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isLoading ? "hourglass_empty" : "delete_outline"}
          </span>
        </button>
      </div>

      {/* ── Air quality content ─────────────────────────────────────── */}
      {isLoading ? (
        /* Loading skeleton */
        <div className="space-y-3 animate-pulse">
          <div className="h-8 bg-surface-container rounded-lg w-32" />
          <div className="h-2 bg-surface-container rounded-full" />
          <div className="grid grid-cols-2 gap-2">
            {[1,2,3,4].map((i) => (
              <div key={i} className="h-12 bg-surface-container rounded-lg" />
            ))}
          </div>
        </div>
      ) : aqi ? (
        <>
          {/* AQI hero — large number + badge */}
          <div className="flex items-center justify-between bg-surface p-4 rounded-xl border border-outline-variant/10">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-primary tracking-tighter leading-none">
                {aqi.european_aqi}
              </span>
              <span className="text-base text-outline font-medium">AQI</span>
            </div>
            <AQIBadge aqi={aqi.european_aqi} />
          </div>

          {/* Progress bar — shows severity at a glance */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-xs font-semibold text-outline">Air quality level</span>
              <span className="text-xs text-outline">100 = health threshold</span>
            </div>
            <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${aqiBarColor(aqi.european_aqi)}`}
                style={{ width: aqiPercent(aqi.european_aqi) }}
              />
            </div>
          </div>

          {/* 2×2 secondary metrics grid */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: "air",        label: "PM2.5", value: aqi.pm2_5,            unit: "μg/m³" },
              { icon: "grain",      label: "PM10",  value: aqi.pm10,             unit: "μg/m³" },
              { icon: "wb_sunny",   label: "Ozone", value: aqi.ozone,            unit: "μg/m³" },
              { icon: "co2",        label: "NO₂",   value: aqi.nitrogen_dioxide, unit: "μg/m³" },
            ].map(({ icon, label, value, unit }) => (
              <div
                key={label}
                className="bg-surface-container-lowest border border-outline-variant/20 p-3 rounded-lg hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-1 text-outline mb-1">
                  <span className="material-symbols-outlined text-[14px]">{icon}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span>
                </div>
                <div className="text-base font-semibold text-on-surface">
                  {value}{" "}
                  <span className="text-xs text-outline font-normal">{unit}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* No data state */
        <div className="flex items-start gap-3 bg-error-container/30 border border-error-container/60 rounded-xl p-4">
          <div className="bg-on-error-container/10 p-2 rounded-full mt-0.5">
            <span
              className="material-symbols-outlined text-on-error-container text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              sensors_off
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-on-error-container">Data unavailable</p>
            <p className="text-xs text-on-error-container/80 mt-0.5">
              Air quality readings could not be retrieved for this location.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
