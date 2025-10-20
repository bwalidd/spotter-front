"use client"

import { useState } from "react"
import TripForm from "./components/TripForm"
import MapDisplay from "./components/MapDisplay"
import LogSheetGenerator from "./components/LogSheetGenerator"
import { planRoute } from "./utils/routePlanning"
import "./App.css"

function App() {
  const [tripData, setTripData] = useState(null)
  const [routeData, setRouteData] = useState(null)
  const [showResults, setShowResults] = useState(false)

  const handleTripSubmit = async (formData) => {
    setTripData(formData)
    const calculatedRoute = planRoute(formData.pickupLocation, formData.dropoffLocation, formData.cycleUsed)
    setRouteData(calculatedRoute)
    setShowResults(true)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-neutral-dark)" }}>
      {/* Header */}
      <header
        className="border-b"
        style={{ borderColor: "var(--color-primary)", backgroundColor: "var(--color-primary)" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold" style={{ color: "var(--color-accent)" }}>
            ELD Log Generator
          </h1>
          <p style={{ color: "var(--color-neutral-light)" }} className="text-sm mt-1">
            Professional Hours of Service Compliance
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!showResults ? (
          <TripForm onSubmit={handleTripSubmit} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--color-accent)" }}>
                Route Overview
              </h2>
              <MapDisplay tripData={tripData} routeData={routeData} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--color-accent)" }}>
                ELD Log Sheets
              </h2>
              <LogSheetGenerator tripData={tripData} routeData={routeData} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
