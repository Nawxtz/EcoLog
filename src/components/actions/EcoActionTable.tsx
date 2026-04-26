"use client"

interface EcoAction {
  id: number
  type: string
  description: string
  amount: number
  unit: string
  co2Saved: number
  date: string
}

interface EcoActionTableProps {
  actions: EcoAction[]
  onEdit: (action: EcoAction) => void
  onDelete: (id: number) => void
}

const TYPE_LABELS: Record<string, string> = {
  walking:          "🚶 Walking",
  cycling:          "🚲 Cycling",
  public_transport: "🚌 Public Transport",
  plant_based_meal: "🥗 Plant-Based Meal",
  recycling:        "♻️ Recycling",
  home_energy:      "⚡ Home Energy",
}

export default function EcoActionTable({ actions, onEdit, onDelete }: EcoActionTableProps) {
  if (actions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-4xl mb-3">📋</p>
        <p className="font-medium">No eco-actions logged yet.</p>
        <p className="text-sm">Use the form above to log your first action!</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium hidden sm:table-cell">Description</th>
            <th className="px-4 py-3 font-medium">Amount</th>
            <th className="px-4 py-3 font-medium text-green-700">CO₂ Saved</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {actions.map((action) => (
            <tr key={action.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-600">{action.date}</td>
              <td className="px-4 py-3 font-medium">{TYPE_LABELS[action.type] ?? action.type}</td>
              <td className="px-4 py-3 text-gray-500 hidden sm:table-cell max-w-xs truncate">
                {action.description}
              </td>
              <td className="px-4 py-3">{action.amount} {action.unit}</td>
              <td className="px-4 py-3 text-green-700 font-semibold">{action.co2Saved} kg</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(action)}
                    className="text-blue-500 hover:text-blue-700 text-xs border border-blue-200 rounded px-2 py-1 hover:bg-blue-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Delete this action?")) onDelete(action.id)
                    }}
                    className="text-red-400 hover:text-red-600 text-xs border border-red-200 rounded px-2 py-1 hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
