"use client"

import { useState } from "react"
import { ACTIVITY_TYPES, ACTIVITY_COLORS, calculateDailyStats } from "../utils/eldCalculations"

export default function LogSheet({ log, tripData, onUpdate }) {
  const [activities, setActivities] = useState(log.activities || Array(24).fill("off-duty"))
  const [notes, setNotes] = useState(log.notes || "")
  const [showStats, setShowStats] = useState(false)

  const handleActivityChange = (hour, activity) => {
    const newActivities = [...activities]
    newActivities[hour] = activity
    setActivities(newActivities)

    if (onUpdate) {
      onUpdate({
        ...log,
        activities: newActivities,
        notes,
      })
    }
  }

  const stats = calculateDailyStats(activities)
  const hasViolations = stats.violations.length > 0

  return (
    <div
      className="rounded-lg p-6"
      style={{
        backgroundColor: "var(--color-primary)",
        border: hasViolations ? "2px solid var(--color-error)" : "2px solid var(--color-accent)",
      }}
    >
      {/* Header */}
      <div className="grid grid-cols-3 gap-4 mb-6 pb-4 border-b" style={{ borderColor: "var(--color-accent)" }}>
        <div>
          <p className="text-xs" style={{ color: "var(--color-neutral-gray)" }}>
            Date
          </p>
          <p className="font-bold" style={{ color: "var(--color-accent)" }}>
            {log.date}
          </p>
        </div>
        <div>
          <p className="text-xs" style={{ color: "var(--color-neutral-gray)" }}>
            Day
          </p>
          <p className="font-bold" style={{ color: "var(--color-accent)" }}>
            {log.day} of {tripData?.daysNeeded || "?"}
          </p>
        </div>
        <div className="text-right">
          <button
            onClick={() => setShowStats(!showStats)}
            className="text-xs px-3 py-1 rounded transition-all"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-neutral-dark)",
            }}
          >
            {showStats ? "Hide" : "Show"} Stats
          </button>
        </div>
      </div>

      {/* Statistics */}
      {showStats && (
        <div className="mb-6 p-4 rounded" style={{ backgroundColor: "var(--color-neutral-light)" }}>
          <div className="grid grid-cols-4 gap-2 mb-3">
            <div>
              <p className="text-xs" style={{ color: "var(--color-neutral-gray)" }}>
                Driving
              </p>
              <p className="font-bold" style={{ color: "var(--color-accent)" }}>
                {stats.driving}h
              </p>
            </div>
            <div>
              <p className="text-xs" style={{ color: "var(--color-neutral-gray)" }}>
                On Duty
              </p>
              <p className="font-bold" style={{ color: "var(--color-accent)" }}>
                {stats.onDuty}h
              </p>
            </div>
            <div>
              <p className="text-xs" style={{ color: "var(--color-neutral-gray)" }}>
                Sleeper
              </p>
              <p className="font-bold" style={{ color: "var(--color-accent)" }}>
                {stats.sleeper}h
              </p>
            </div>
            <div>
              <p className="text-xs" style={{ color: "var(--color-neutral-gray)" }}>
                Off Duty
              </p>
              <p className="font-bold" style={{ color: "var(--color-accent)" }}>
                {stats.offDuty}h
              </p>
            </div>
          </div>

          {stats.violations.length > 0 && (
            <div className="p-2 rounded" style={{ backgroundColor: "var(--color-error)", opacity: 0.2 }}>
              <p className="text-xs font-bold" style={{ color: "var(--color-error)" }}>
                Violations:
              </p>
              {stats.violations.map((violation, idx) => (
                <p key={idx} className="text-xs" style={{ color: "var(--color-error)" }}>
                  • {violation}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 24-Hour Grid */}
      <div className="mb-6">
        <p className="text-sm font-bold mb-3" style={{ color: "var(--color-accent)" }}>
          Hours of Service (Click to cycle through activities)
        </p>
        <div className="grid grid-cols-12 gap-1">
          {Array(24)
            .fill(null)
            .map((_, hour) => (
              <div key={hour} className="flex flex-col items-center">
                <div
                  className="w-full h-12 rounded cursor-pointer border-2 transition-all hover:opacity-80"
                  style={{
                    backgroundColor: ACTIVITY_COLORS[activities[hour]],
                    borderColor: "var(--color-accent)",
                  }}
                  onClick={() => {
                    const activities_list = [
                      ACTIVITY_TYPES.OFF_DUTY,
                      ACTIVITY_TYPES.SLEEPER,
                      ACTIVITY_TYPES.DRIVING,
                      ACTIVITY_TYPES.ON_DUTY,
                    ]
                    const currentIdx = activities_list.indexOf(activities[hour])
                    handleActivityChange(hour, activities_list[(currentIdx + 1) % activities_list.length])
                  }}
                  title={`Hour ${hour}: ${activities[hour]}`}
                />
                <span className="text-xs mt-1" style={{ color: "var(--color-neutral-gray)" }}>
                  {hour}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-4 gap-2 text-xs mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: ACTIVITY_COLORS["off-duty"] }}></div>
          <span style={{ color: "var(--color-neutral-light)" }}>Off Duty</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: ACTIVITY_COLORS["sleeper"] }}></div>
          <span style={{ color: "var(--color-neutral-light)" }}>Sleeper</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: ACTIVITY_COLORS["driving"] }}></div>
          <span style={{ color: "var(--color-neutral-light)" }}>Driving</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: ACTIVITY_COLORS["on-duty"] }}></div>
          <span style={{ color: "var(--color-neutral-light)" }}>On Duty</span>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="text-xs font-bold" style={{ color: "var(--color-accent)" }}>
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value)
            if (onUpdate) {
              onUpdate({
                ...log,
                activities,
                notes: e.target.value,
              })
            }
          }}
          placeholder="Add any notes for this day..."
          className="w-full mt-2 p-2 rounded text-sm"
          style={{
            backgroundColor: "var(--color-neutral-light)",
            color: "var(--color-neutral-dark)",
            border: "1px solid var(--color-accent)",
          }}
          rows="2"
        />
      </div>
    </div>
  )
}
