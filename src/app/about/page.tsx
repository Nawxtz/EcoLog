export default function AboutPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">About EcoLog</h1>
        <p className="text-gray-500 mt-1">Learn about what EcoLog does and how it works.</p>
      </div>

      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
        <h2 className="text-xl font-bold text-gray-700">What is EcoLog?</h2>
        <p className="text-gray-600">
          EcoLog is a personal environmental impact tracker. It lets you monitor air quality in cities around
          the world and log your own eco-friendly actions — like walking, cycling, or eating plant-based meals —
          to see how much CO₂ you are saving over time.
        </p>
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
        <h2 className="text-xl font-bold text-gray-700">Tech Stack</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left">Layer</th>
                <th className="px-4 py-2 text-left">Technology</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ["Framework", "Next.js 14 (App Router)"],
                ["Language", "TypeScript"],
                ["Styling", "Tailwind CSS"],
                ["Database", "SQLite via Prisma ORM"],
                ["Validation", "Zod (frontend + backend)"],
                ["Charts", "Recharts"],
                ["External API", "Open-Meteo (free, no key)"],
              ].map(([layer, tech]) => (
                <tr key={layer}>
                  <td className="px-4 py-2 font-medium text-gray-700">{layer}</td>
                  <td className="px-4 py-2 text-gray-600">{tech}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
        <h2 className="text-xl font-bold text-gray-700">CO₂ Calculation Method</h2>
        <p className="text-gray-600">Our calculations are based on peer-reviewed scientific estimates.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left">Action</th>
                <th className="px-4 py-2 text-left">Unit</th>
                <th className="px-4 py-2 text-left">CO₂ Saved per Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ["🚶 Walking", "km", "0.21 kg"],
                ["🚲 Cycling", "km", "0.21 kg"],
                ["🚌 Public Transport", "km", "0.089 kg"],
                ["🥗 Plant-Based Meal", "meal", "1.5 kg"],
                ["♻️ Recycling", "kg", "0.5 kg"],
                ["⚡ Home Energy Saving", "kWh", "0.233 kg"],
              ].map(([action, unit, factor]) => (
                <tr key={action}>
                  <td className="px-4 py-2 font-medium text-gray-800">{action}</td>
                  <td className="px-4 py-2 text-gray-600">{unit}</td>
                  <td className="px-4 py-2 text-green-700 font-semibold">{factor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
