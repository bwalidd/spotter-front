"use client"

import { useState } from "react"
import TripForm from "@/components/trip-form"
import LeafletMapDisplay from "@/components/leaflet-map-display"
import LogSheetGenerator from "@/components/log-sheet-generator"
import { planRoute } from "@/utils/route-planning"
import { RouteData } from "@/types/route"

export default function Home() {
  const [tripData, setTripData] = useState<any>(null)
  const [routeData, setRouteData] = useState<RouteData | null>(null)
  const [showResults, setShowResults] = useState(false)

  const handleTripSubmit = async (formData: any) => {
    setTripData(formData)
    const calculatedRoute = await planRoute(
      formData.currentLocation,
      formData.pickupLocation,
      formData.dropoffLocation,
      formData.cycleUsed
    )
    setRouteData(calculatedRoute)
    setShowResults(true)
  }

  const handleReset = () => {
    localStorage.removeItem('currentTripId');
    setShowResults(false)
    setTripData(null)
    setRouteData(null)
  }

  return (
    <div
      className={`relative min-h-screen ${
        !showResults ? "bg-cover bg-center" : "bg-slate-100"
      }`}
      style={
        !showResults
          ? { backgroundImage: "url('/truck3.jpg')" }
          : {}
      }
    >
      {/* Only show overlay when showResults is false */}
      {!showResults && <div className="absolute inset-0 bg-black/60"></div>}

      {/* Actual content */}
      <div className="relative z-10 bg-gradient-to-br from-slate-300/60 via-slate-300/40 to-slate-300/20 backdrop-blur-sm">
        {/* Header */}
        <header className="border-b border-blue-600 bg-gradient-to-r from-blue-900 to-blue-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-blue-300 mb-2">
                  Spotter AI - ELD Log Generator 
                </h1>
                <p className="text-blue-200 text-sm">
                  Professional Hours of Service Compliance Tool
                </p>
              </div>
              {showResults && (
                <button
                  onClick={handleReset}
                  className="px-6 py-2 rounded-lg font-semibold transition-all hover:opacity-90 bg-orange-500 text-slate-900"
                >
                  New Trip
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-12">
          {!showResults ? (
            <div className="max-w-2xl mx-auto">
              <TripForm onSubmit={handleTripSubmit} />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-500 rounded"></div>
                  <h2 className="text-3xl font-bold text-orange-400">
                    Route Overview
                  </h2>
                </div>
                <LeafletMapDisplay tripData={tripData} routeData={routeData} />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-8 bg-blue-500 rounded"></div>
                  <h2 className="text-3xl font-bold text-orange-400">
                    ELD Log Sheets
                  </h2>
                </div>
                <LogSheetGenerator tripData={tripData} routeData={routeData} />
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-700 bg-slate-900 mt-16">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-blue-300 font-bold mb-2">About</h3>
                <p className="text-slate-400 text-sm">
                  Professional ELD log generator for FMCSA Hours of Service
                  compliance.
                </p>
              </div>
              <div>
                <h3 className="text-blue-300 font-bold mb-2">Features</h3>
                <ul className="text-slate-400 text-sm space-y-1">
                  <li>✓ Route planning & optimization</li>
                  <li>✓ HOS compliance validation</li>
                  <li>✓ Drawable canvas logs</li>
                  <li>✓ PDF export & reporting</li>
                </ul>
              </div>
              <div>
                <h3 className="text-blue-300 font-bold mb-2">Compliance</h3>
                <p className="text-slate-400 text-sm">
                  Built to comply with FMCSA regulations and industry standards.
                </p>
              </div>
            </div>
            <div className="border-t border-slate-700 pt-8 text-center text-slate-500 text-sm">
              <p>
                ELD Log Generator &copy; {new Date().getFullYear()}. All rights
                reserved. | Spotter AI | walid
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
