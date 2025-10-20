"use client"

import React, { useState } from "react"
import LogSheet from "./LogSheet"
import { generateDefaultLog, calculateCycleUsage } from "../utils/eldCalculations"
import { generatePDF } from "../utils/pdfGenerator"

export default function LogSheetGenerator({ tripData, routeData }) {
  const [logs, setLogs] = useState([])
  const [cycleUsage, setCycleUsage] = useState(tripData?.cycleUsed || 0)
  const [isExporting, setIsExporting] = useState(false)

  React.useEffect(() => {
    if (tripData && routeData) {
      generateLogs()
    }
  }, [tripData, routeData])

  const generateLogs = () => {
    const daysNeeded = routeData.daysNeeded || 1
    const totalDrivingHours = routeData.duration || 0
    const drivingPerDay = totalDrivingHours / daysNeeded
    const newLogs = []

    for (let i = 0; i < daysNeeded; i++) {
      const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000)
      const log = generateDefaultLog(i + 1, date.toLocaleDateString(), drivingPerDay)
      newLogs.push(log)
    }

    setLogs(newLogs)
    updateCycleUsage(newLogs)
  }

  const handleLogUpdate = (updatedLog) => {
    const updatedLogs = logs.map((log) => (log.day === updatedLog.day ? updatedLog : log))
    setLogs(updatedLogs)
    updateCycleUsage(updatedLogs)
  }

  const updateCycleUsage = (currentLogs) => {
    const usage = calculateCycleUsage(currentLogs, tripData?.cycleUsed || 0)
    setCycleUsage(usage)
  }

  const handleDownloadPDF = () => {
    setIsExporting(true)
    try {
      generatePDF(tripData, routeData, logs)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const handleAddDay = () => {
    const newDay = logs.length + 1
    const date = new Date(Date.now() + logs.length * 24 * 60 * 60 * 1000)
    const newLog = generateDefaultLog(newDay, date.toLocaleDateString(), 0)
    setLogs([...logs, newLog])
  }

  const handleRemoveDay = (dayToRemove) => {
    const updatedLogs = logs
      .filter((log) => log.day !== dayToRemove)
      .map((log, idx) => ({
        ...log,
        day: idx + 1,
      }))
    setLogs(updatedLogs)
    updateCycleUsage(updatedLogs)
  }

  const handleResetLogs = () => {
    if (window.confirm("Are you sure you want to reset all logs? This cannot be undone.")) {
      generateLogs()
    }
  }

  return (
    <div className="space-y-6">
      {/* Cycle Usage Summary */}
      <div
        className="p-4 rounded"
        style={{
          backgroundColor: "var(--color-primary)",
          border: "2px solid var(--color-accent)",
        }}
      >
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-xs" style={{ color: "var(--color-neutral-gray)" }}>
              70-Hour Cycle Used
            </p>
            <p className="text-2xl font-bold" style={{ color: "var(--color-accent)" }}>
              {cycleUsage.toFixed(1)}h
            </p>
          </div>
          <div>
            <p className="text-xs" style={{ color: "var(--color-neutral-gray)" }}>
              Remaining
            </p>
            <p className="text-2xl font-bold" style={{ color: "var(--color-accent)" }}>
              {Math.max(0, 70 - cycleUsage).toFixed(1)}h
            </p>
          </div>
        </div>
        {/* <div className="w-full bg-gray-300 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all"
            style={{
              width: `${Math.min(100, (cycleUsage / 70) * 100)}%`,
              backgroundColor: cycleUsage > 60 ? "var(--color-error)" : "var(--color-accent)",
            }}
          ></div>
        </div> */}
      </div>

      {/* Log Sheets */}
      {logs.map((log, idx) => (
        <div key={idx} className="relative">
          <LogSheet log={log} tripData={routeData} onUpdate={handleLogUpdate} />
          {logs.length > 1 && (
            <button
              onClick={() => handleRemoveDay(log.day)}
              className="absolute top-4 right-4 px-2 py-1 text-xs rounded transition-all"
              style={{
                backgroundColor: "var(--color-error)",
                color: "white",
              }}
            >
              Remove Day
            </button>
          )}
        </div>
      ))}

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={handleAddDay}
          className="py-3 rounded font-bold transition-all hover:opacity-90"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "var(--color-accent)",
            border: "2px solid var(--color-accent)",
          }}
        >
          Add Day
        </button>
        <button
          onClick={handleResetLogs}
          className="py-3 rounded font-bold transition-all hover:opacity-90"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "var(--color-accent)",
            border: "2px solid var(--color-accent)",
          }}
        >
          Reset Logs
        </button>
        <button
          onClick={handleDownloadPDF}
          disabled={isExporting}
          className="py-3 rounded font-bold transition-all hover:opacity-90 disabled:opacity-50"
          style={{
            backgroundColor: "var(--color-accent)",
            color: "var(--color-neutral-dark)",
          }}
        >
          {isExporting ? "Generating..." : "Download PDF"}
        </button>
      </div>
    </div>
  )
}
