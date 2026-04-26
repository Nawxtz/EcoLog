"use client"

import { useState, useEffect, useCallback } from "react"
import { calculateCO2Saved, getUnitForType } from "@/lib/co2Calculator"

interface EcoAction {
  id: number
  type: string
  description: string
  amount: number
  unit: string
  co2Saved: number
  date: string
  createdAt: string
}

const ACTION_TYPES = [
  { value: "walking",          label: "Walking",           icon: "directions_walk" },
  { value: "cycling",          label: "Cycling",           icon: "directions_bike" },
  { value: "public_transport", label: "Public Transport",  icon: "directions_bus"  },
  { value: "plant_based_meal", label: "Plant-based Meal",  icon: "eco"             },
  { value: "recycling",        label: "Recycling",         icon: "recycling"       },
  { value: "home_energy",      label: "Home Energy Saving",icon: "bolt"            },
]

const ACTION_ICON: Record<string, string> = Object.fromEntries(
  ACTION_TYPES.map((a) => [a.value, a.icon])
)

const TYPE_LABELS: Record<string, string> = Object.fromEntries(
  ACTION_TYPES.map((a) => [a.value, a.label])
)

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  })
}

function todayStr() {
  return new Date().toISOString().split("T")[0]
}

interface FormState {
  type: string
  description: string
  amount: string
  date: string
}

const EMPTY_FORM: FormState = {
  type: "cycling",
  description: "",
  amount: "",
  date: todayStr(),
}

export default function LogPage() {
  const [actions, setActions] = useState<EcoAction[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMsg, setSuccessMsg] = useState("")

  const fetchActions = useCallback(async () => {
    try {
      const res = await fetch("/api/actions")
      const data = await res.json()
      setActions(data)
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchActions() }, [fetchActions])

  const co2Preview = form.amount
    ? calculateCO2Saved(form.type, parseFloat(form.amount) || 0)
    : null

  const unitLabel = getUnitForType(form.type)

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!form.description.trim() || form.description.trim().length < 3)
      e.description = "At least 3 characters"
    const amt = parseFloat(form.amount)
    if (!form.amount || isNaN(amt) || amt <= 0)
      e.amount = "Must be a positive number"
    if (amt > 10000) e.amount = "Value seems too large"
    if (!form.date) e.date = "Required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setSubmitting(true)
    setSuccessMsg("")
    try {
      const url = editingId ? `/api/actions/${editingId}` : "/api/actions"
      const method = editingId ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: form.type,
          description: form.description.trim(),
          amount: parseFloat(form.amount),
          date: form.date,
        }),
      })
      if (res.ok) {
        setSuccessMsg(editingId ? "Action updated!" : "Action saved!")
        setForm(EMPTY_FORM)
        setEditingId(null)
        setErrors({})
        fetchActions()
        setTimeout(() => setSuccessMsg(""), 3000)
      } else {
        const data = await res.json()
        if (data.error && typeof data.error === "object") {
          const fe: Record<string, string> = {}
          for (const [k, v] of Object.entries(data.error)) {
            fe[k] = (v as string[])[0]
          }
          setErrors(fe)
        }
      }
    } catch {
      /* ignore */
    } finally {
      setSubmitting(false)
    }
  }

  function handleEdit(action: EcoAction) {
    setEditingId(action.id)
    setForm({
      type: action.type,
      description: action.description,
      amount: String(action.amount),
      date: action.date,
    })
    setErrors({})
    setSuccessMsg("")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function handleCancelEdit() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setErrors({})
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this action?")) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/actions/${id}`, { method: "DELETE" })
      if (res.ok) fetchActions()
    } catch {
      /* ignore */
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-stack-lg max-w-2xl">

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-bold text-on-surface tracking-tight">
          My Eco Log
        </h1>
        <p className="text-base text-outline mt-2 leading-relaxed">
          Record your eco-friendly actions and track how much CO₂ you&apos;re saving over time.
        </p>
      </div>

      {/* ── Add / Edit form ─────────────────────────────────────────── */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant/20 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20 bg-surface-container-low/50">
          <div className="flex items-center gap-3">
            <span
              className="material-symbols-outlined text-primary text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {editingId ? "edit" : "add_circle"}
            </span>
            <span className="text-sm font-semibold text-on-surface">
              {editingId ? "Edit Action" : "Log New Action"}
            </span>
          </div>
          {editingId && (
            <button
              onClick={handleCancelEdit}
              className="text-xs text-outline hover:text-on-surface flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
              Cancel
            </button>
          )}
        </div>

        <div className="p-6 space-y-5">

          {/* Action type */}
          <div>
            <label className="text-xs font-semibold text-outline uppercase tracking-widest mb-2 block">
              Action Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ACTION_TYPES.map((at) => (
                <button
                  key={at.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type: at.value }))}
                  className={`
                    flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all text-left
                    ${form.type === at.value
                      ? "bg-primary-fixed/40 border-primary/40 text-primary"
                      : "border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low hover:border-outline-variant"
                    }
                  `}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={form.type === at.value ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {at.icon}
                  </span>
                  <span className="truncate">{at.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount + Date row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-outline uppercase tracking-widest mb-2 block">
                Amount ({unitLabel})
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                placeholder={`e.g. 5`}
                className={`
                  w-full bg-surface-container-low rounded-lg border px-3 py-2.5 text-sm
                  text-on-surface placeholder-outline/50 focus:outline-none focus:border-primary transition-colors
                  ${errors.amount ? "border-error" : "border-outline-variant/30"}
                `}
              />
              {errors.amount && <p className="text-error text-xs mt-1">{errors.amount}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-outline uppercase tracking-widest mb-2 block">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className={`
                  w-full bg-surface-container-low rounded-lg border px-3 py-2.5 text-sm
                  text-on-surface focus:outline-none focus:border-primary transition-colors
                  ${errors.date ? "border-error" : "border-outline-variant/30"}
                `}
              />
              {errors.date && <p className="text-error text-xs mt-1">{errors.date}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-outline uppercase tracking-widest mb-2 block">
              Description
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="e.g. Cycled to work instead of driving"
              className={`
                w-full bg-surface-container-low rounded-lg border px-3 py-2.5 text-sm
                text-on-surface placeholder-outline/50 focus:outline-none focus:border-primary transition-colors
                ${errors.description ? "border-error" : "border-outline-variant/30"}
              `}
            />
            {errors.description && <p className="text-error text-xs mt-1">{errors.description}</p>}
          </div>

          {/* CO₂ preview + submit */}
          <div className="flex items-center justify-between gap-4 pt-1">
            {co2Preview !== null && parseFloat(form.amount) > 0 ? (
              <div className="flex items-center gap-2 bg-primary-fixed/30 border border-primary/20 rounded-lg px-3 py-2">
                <span
                  className="material-symbols-outlined text-primary text-[16px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  eco
                </span>
                <span className="text-sm text-on-surface">
                  Saves <strong className="text-primary font-bold">{co2Preview} kg</strong> CO₂
                </span>
              </div>
            ) : (
              <div />
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-on-primary-fixed-variant transition-colors shadow-primary disabled:opacity-50 flex items-center gap-2"
            >
              {submitting && (
                <span className="material-symbols-outlined animate-spin text-[16px]">
                  progress_activity
                </span>
              )}
              {editingId ? "Update Action" : "Save Action"}
            </button>
          </div>

          {successMsg && (
            <div className="flex items-center gap-2 text-primary bg-primary-fixed/30 border border-primary/20 rounded-lg px-4 py-2.5">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <span className="text-sm font-semibold">{successMsg}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Actions list ────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-outline uppercase tracking-widest">
            Logged Actions — {actions.length} total
          </h2>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-surface-container-low rounded-xl animate-pulse" />
            ))}
          </div>
        ) : actions.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 py-16 flex flex-col items-center text-center gap-4">
            <div className="bg-surface-container p-4 rounded-full">
              <span
                className="material-symbols-outlined text-outline text-[40px]"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                eco
              </span>
            </div>
            <div>
              <p className="text-base font-semibold text-on-surface">No actions logged yet</p>
              <p className="text-sm text-outline mt-1">Start by logging your first eco action above.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {actions.map((action) => (
              <div
                key={action.id}
                className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-4 flex items-center gap-4 hover:border-primary/20 transition-colors"
              >
                {/* Icon */}
                <div className="bg-primary-fixed/40 p-2.5 rounded-xl flex-shrink-0">
                  <span
                    className="material-symbols-outlined text-primary text-[22px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {ACTION_ICON[action.type] ?? "task_alt"}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface truncate">{action.description}</p>
                  <p className="text-xs text-outline mt-0.5">
                    {TYPE_LABELS[action.type] ?? action.type} · {action.amount} {action.unit} · {formatDate(action.date)}
                  </p>
                </div>

                {/* CO₂ */}
                <div className="text-right flex-shrink-0">
                  <p className="text-base font-bold text-primary">{action.co2Saved} kg</p>
                  <p className="text-xs text-outline">CO₂ saved</p>
                </div>

                {/* Actions */}
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(action)}
                    className="p-1.5 text-outline hover:text-primary hover:bg-primary-fixed/30 rounded-lg transition-colors"
                    aria-label="Edit"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(action.id)}
                    disabled={deletingId === action.id}
                    className="p-1.5 text-outline hover:text-error hover:bg-error-container/30 rounded-lg transition-colors disabled:opacity-40"
                    aria-label="Delete"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {deletingId === action.id ? "hourglass_empty" : "delete_outline"}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
