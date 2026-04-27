"use client"

import { useState, useEffect } from "react"
import { actionSchema } from "@/schemas/actionSchema"

interface EcoActionFormProps {
  onSuccess: () => void
  editingAction?: {
    id: number
    type: string
    description: string
    amount: number
    date: string
  } | null
  onCancelEdit?: () => void
}

const ACTION_TYPES = [
  { value: "walking",          label: "🚶 Walking (km)"              },
  { value: "cycling",          label: "🚲 Cycling (km)"              },
  { value: "public_transport", label: "🚌 Public Transport (km)"     },
  { value: "plant_based_meal", label: "🥗 Plant-Based Meal"          },
  { value: "recycling",        label: "♻️ Recycling (kg)"            },
  { value: "home_energy",      label: "⚡ Home Energy Saving (kWh)"  },
]

export default function EcoActionForm({ onSuccess, editingAction, onCancelEdit }: EcoActionFormProps) {
  const [type, setType]               = useState(editingAction?.type ?? "walking")
  const [description, setDescription] = useState(editingAction?.description ?? "")
  const [amount, setAmount]           = useState(editingAction?.amount?.toString() ?? "")
  const [date, setDate]               = useState(editingAction?.date ?? new Date().toISOString().split("T")[0])
  const [loading, setLoading]         = useState(false)
  const [errors, setErrors]           = useState<Record<string, string[]>>({})
  const [serverError, setServerError] = useState("")

  const isEditing = !!editingAction

  // Sync form fields when editingAction changes (user clicks Edit on a different row)
  useEffect(() => {
    if (editingAction) {
      setType(editingAction.type)
      setDescription(editingAction.description)
      setAmount(editingAction.amount.toString())
      setDate(editingAction.date)
      setErrors({})
      setServerError("")
    }
  }, [editingAction])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    setServerError("")

    // ✅ Frontend Zod validation (ใช้ actionSchema ที่ถูก import ไว้ด้านบนสุดของไฟล์แล้ว)
    const parsed = actionSchema.safeParse({ type, description, amount, date })
    
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors)
      return
    }

    setLoading(true)
    try {
      const url = isEditing ? `/api/actions/${editingAction.id}` : "/api/actions"
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, description, amount: parseFloat(amount), date }),
      })

      if (res.ok) {
        if (!isEditing) {
          setType("walking")
          setDescription("")
          setAmount("")
          setDate(new Date().toISOString().split("T")[0])
        }
        onSuccess()
      } else {
        const data = await res.json()
        setServerError(data.error ?? "Failed to save action")
      }
    } catch {
      setServerError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold text-gray-700">
        {isEditing ? "✏️ Edit Action" : "➕ Log New Eco Action"}
      </h2>

      {/* Action Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {ACTION_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type[0]}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Walked to work instead of driving"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description[0]}</p>}
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.1"
          min="0"
          placeholder="e.g. 5"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount[0]}</p>}
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date[0]}</p>}
      </div>

      {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 transition-colors"
        >
          {loading ? "Saving..." : isEditing ? "Update Action" : "Log Action"}
        </button>
        {isEditing && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
