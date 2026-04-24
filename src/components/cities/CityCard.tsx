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

export default function CityCard({ id, name, country, countryCode, aqi, isLoading, onDelete }: CityCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{name}</h3>
          <p className="text-gray-500 text-sm">{country} ({countryCode})</p>
        </div>
        <button
          onClick={() => onDelete(id)}
          className="text-red-400 hover:text-red-600 text-xs border border-red-200 rounded px-2 py-1 hover:bg-red-50 transition-colors"
        >
          Remove
        </button>
      </div>

      {isLoading ? (
        <div className="text-gray-400 text-sm animate-pulse">Loading air quality...</div>
      ) : aqi ? (
        <div className="space-y-2">
          <AQIBadge aqi={aqi.european_aqi} />
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mt-2">
            <span>PM2.5: <strong>{aqi.pm2_5} μg/m³</strong></span>
            <span>PM10: <strong>{aqi.pm10} μg/m³</strong></span>
            <span>Ozone: <strong>{aqi.ozone} μg/m³</strong></span>
            <span>NO₂: <strong>{aqi.nitrogen_dioxide} μg/m³</strong></span>
          </div>
        </div>
      ) : (
        <p className="text-gray-400 text-sm">Air quality data unavailable</p>
      )}
    </div>
  )
}
