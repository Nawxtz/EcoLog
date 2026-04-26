"use client"

import { useState, useEffect, useCallback } from "react"
import EcoActionForm from "@/components/actions/EcoActionForm"
import EcoActionTable from "@/components/actions/EcoActionTable"

interface EcoAction {
  id: number
  type: string
  description: string
  amount: number
  unit: string
  co2Saved: number
  date: string
}

export default function LogPage() {
  const [actions, setActions] = useState<EcoAction[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAction, setEditingAction] = useState<EcoAction | null>(null)

  const loadActions = useCallback(async () => {
    try {
      const res = await fetch("/api/actions")
      if (res.ok) {
        const data = await res.json()
        setActions(data)
      }
    } catch {
      console.error("Failed to load actions")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadActions() }, [loadActions])

  async function handleDelete(id: number) {
    try {
      const res = await fetch(`/api/actions/${id}`, { method: "DELETE" })
      if (res.ok) loadActions()
    } catch {
      alert("Failed to delete action")
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Eco Log</h1>
        <p className="text-gray-500 mt-1">Track your eco-friendly actions and see your CO₂ savings.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <EcoActionForm
          onSuccess={() => { loadActions(); setEditingAction(null) }}
          editingAction={editingAction}
          onCancelEdit={() => setEditingAction(null)}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-700 mb-4">All Actions</h2>
        {loading ? (
          <p className="text-gray-400 text-sm animate-pulse">Loading actions...</p>
        ) : (
          <EcoActionTable
            actions={actions}
            onEdit={(action) => setEditingAction(action)}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  )
}
