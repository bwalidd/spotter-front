"use client"

import { useState } from "react"

export default function TripForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    currentLocation: "",
    pickupLocation: "",
    dropoffLocation: "",
    cycleUsed: 0,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cycleUsed" ? Number.parseFloat(value) : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="rounded-lg p-8"
        style={{ backgroundColor: "var(--color-primary)", border: "2px solid var(--color-accent)" }}
      >
        <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--color-accent)" }}>
          Trip Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Location */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-neutral-light)" }}>
              Current Location
            </label>
            <input
              type="text"
              name="currentLocation"
              value={formData.currentLocation}
              onChange={handleChange}
              placeholder="e.g., Dallas, TX"
              required
              className="w-full px-4 py-3 rounded border-2"
              style={{
                borderColor: "var(--color-accent)",
                backgroundColor: "var(--color-neutral-light)",
                color: "var(--color-neutral-dark)",
              }}
            />
          </div>

          {/* Pickup Location */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-neutral-light)" }}>
              Pickup Location
            </label>
            <input
              type="text"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              placeholder="e.g., Houston, TX"
              required
              className="w-full px-4 py-3 rounded border-2"
              style={{
                borderColor: "var(--color-accent)",
                backgroundColor: "var(--color-neutral-light)",
                color: "var(--color-neutral-dark)",
              }}
            />
          </div>

          {/* Dropoff Location */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-neutral-light)" }}>
              Dropoff Location
            </label>
            <input
              type="text"
              name="dropoffLocation"
              value={formData.dropoffLocation}
              onChange={handleChange}
              placeholder="e.g., New York, NY"
              required
              className="w-full px-4 py-3 rounded border-2"
              style={{
                borderColor: "var(--color-accent)",
                backgroundColor: "var(--color-neutral-light)",
                color: "var(--color-neutral-dark)",
              }}
            />
          </div>

          {/* Cycle Used */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-neutral-light)" }}>
              Current Cycle Used (Hours)
            </label>
            <input
              type="number"
              name="cycleUsed"
              value={formData.cycleUsed}
              onChange={handleChange}
              min="0"
              max="70"
              step="0.5"
              required
              className="w-full px-4 py-3 rounded border-2"
              style={{
                borderColor: "var(--color-accent)",
                backgroundColor: "var(--color-neutral-light)",
                color: "var(--color-neutral-dark)",
              }}
            />
            <p className="text-xs mt-1" style={{ color: "var(--color-neutral-gray)" }}>
              70-hour/8-day cycle. Available: {Math.max(0, 70 - formData.cycleUsed).toFixed(1)} hours
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded font-bold text-lg transition-all hover:opacity-90"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-neutral-dark)",
            }}
          >
            Generate Route & ELD Logs
          </button>
        </form>
      </div>
    </div>
  )
}
