"use client"

import { useEffect, useRef } from "react"

interface MapDisplayProps {
  tripData: any
  routeData: any
}

export default function MapDisplay({ tripData, routeData }: MapDisplayProps) {
  const mapContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapContainer.current || !routeData) return

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("width", "100%")
    svg.setAttribute("height", "500")
    svg.setAttribute("viewBox", "0 0 1000 500")
    svg.style.backgroundColor = "#e2e8f0"
    svg.style.borderRadius = "8px"
    svg.style.border = "2px solid #f97316"

    // Draw route lines
    const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line")
    line1.setAttribute("x1", "80")
    line1.setAttribute("y1", "250")
    line1.setAttribute("x2", "500")
    line1.setAttribute("y2", "250")
    line1.setAttribute("stroke", "#f97316")
    line1.setAttribute("stroke-width", "6")
    line1.setAttribute("stroke-linecap", "round")
    svg.appendChild(line1)

    const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line")
    line2.setAttribute("x1", "500")
    line2.setAttribute("y1", "250")
    line2.setAttribute("x2", "920")
    line2.setAttribute("y2", "250")
    line2.setAttribute("stroke", "#f97316")
    line2.setAttribute("stroke-width", "6")
    line2.setAttribute("stroke-linecap", "round")
    svg.appendChild(line2)

    // Draw current location point
    const currentCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    currentCircle.setAttribute("cx", "80")
    currentCircle.setAttribute("cy", "250")
    currentCircle.setAttribute("r", "12")
    currentCircle.setAttribute("fill", "#22c55e")
    currentCircle.setAttribute("stroke", "#f97316")
    currentCircle.setAttribute("stroke-width", "2")
    svg.appendChild(currentCircle)

    const currentLabel = document.createElementNS("http://www.w3.org/2000/svg", "text")
    currentLabel.setAttribute("x", "80")
    currentLabel.setAttribute("y", "280")
    currentLabel.setAttribute("text-anchor", "middle")
    currentLabel.setAttribute("font-size", "12")
    currentLabel.setAttribute("fill", "#f97316")
    currentLabel.setAttribute("font-weight", "bold")
    currentLabel.textContent = "CURRENT"
    svg.appendChild(currentLabel)

    // Draw pickup point
    const pickupCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    pickupCircle.setAttribute("cx", "500")
    pickupCircle.setAttribute("cy", "250")
    pickupCircle.setAttribute("r", "12")
    pickupCircle.setAttribute("fill", "#eab308")
    pickupCircle.setAttribute("stroke", "#f97316")
    pickupCircle.setAttribute("stroke-width", "2")
    svg.appendChild(pickupCircle)

    const pickupLabel = document.createElementNS("http://www.w3.org/2000/svg", "text")
    pickupLabel.setAttribute("x", "500")
    pickupLabel.setAttribute("y", "280")
    pickupLabel.setAttribute("text-anchor", "middle")
    pickupLabel.setAttribute("font-size", "12")
    pickupLabel.setAttribute("fill", "#f97316")
    pickupLabel.setAttribute("font-weight", "bold")
    pickupLabel.textContent = "PICKUP"
    svg.appendChild(pickupLabel)

    // Draw dropoff point
    const dropoffCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    dropoffCircle.setAttribute("cx", "920")
    dropoffCircle.setAttribute("cy", "250")
    dropoffCircle.setAttribute("r", "12")
    dropoffCircle.setAttribute("fill", "#ef4444")
    dropoffCircle.setAttribute("stroke", "#f97316")
    dropoffCircle.setAttribute("stroke-width", "2")
    svg.appendChild(dropoffCircle)

    const dropoffLabel = document.createElementNS("http://www.w3.org/2000/svg", "text")
    dropoffLabel.setAttribute("x", "920")
    dropoffLabel.setAttribute("y", "280")
    dropoffLabel.setAttribute("text-anchor", "middle")
    dropoffLabel.setAttribute("font-size", "12")
    dropoffLabel.setAttribute("fill", "#f97316")
    dropoffLabel.setAttribute("font-weight", "bold")
    dropoffLabel.textContent = "DROPOFF"
    svg.appendChild(dropoffLabel)

    // Draw stops
    if (routeData?.stops && routeData.stops.length > 0) {
      routeData.stops.forEach((stop: any, index: number) => {
        const x = 80 + ((index + 1) / (routeData.stops.length + 1)) * 840
        const stopCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
        stopCircle.setAttribute("cx", x.toString())
        stopCircle.setAttribute("cy", "250")
        stopCircle.setAttribute("r", "8")
        stopCircle.setAttribute("fill", stop.type === "fuel" ? "#eab308" : "#3b82f6")
        stopCircle.setAttribute("stroke", "#f97316")
        stopCircle.setAttribute("stroke-width", "1.5")
        svg.appendChild(stopCircle)

        const stopLabel = document.createElementNS("http://www.w3.org/2000/svg", "text")
        stopLabel.setAttribute("x", x.toString())
        stopLabel.setAttribute("y", "220")
        stopLabel.setAttribute("text-anchor", "middle")
        stopLabel.setAttribute("font-size", "10")
        stopLabel.setAttribute("fill", "#f97316")
        stopLabel.textContent = stop.type === "fuel" ? "FUEL" : "REST"
        svg.appendChild(stopLabel)
      })
    }

    // Add info box
    const infoBox = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    infoBox.setAttribute("x", "50")
    infoBox.setAttribute("y", "350")
    infoBox.setAttribute("width", "900")
    infoBox.setAttribute("height", "120")
    infoBox.setAttribute("fill", "#1e3a8a")
    infoBox.setAttribute("stroke", "#f97316")
    infoBox.setAttribute("stroke-width", "2")
    infoBox.setAttribute("rx", "8")
    svg.appendChild(infoBox)

    const distanceText = document.createElementNS("http://www.w3.org/2000/svg", "text")
    distanceText.setAttribute("x", "70")
    distanceText.setAttribute("y", "375")
    distanceText.setAttribute("font-size", "14")
    distanceText.setAttribute("font-weight", "bold")
    distanceText.setAttribute("fill", "#f97316")
    distanceText.textContent = `Distance: ${routeData?.distance || 0} miles`
    svg.appendChild(distanceText)

    const durationText = document.createElementNS("http://www.w3.org/2000/svg", "text")
    durationText.setAttribute("x", "70")
    durationText.setAttribute("y", "400")
    durationText.setAttribute("font-size", "14")
    durationText.setAttribute("font-weight", "bold")
    durationText.setAttribute("fill", "#f97316")
    durationText.textContent = `Est. Duration: ${routeData?.duration || 0} hours`
    svg.appendChild(durationText)

    const daysText = document.createElementNS("http://www.w3.org/2000/svg", "text")
    daysText.setAttribute("x", "70")
    daysText.setAttribute("y", "425")
    daysText.setAttribute("font-size", "14")
    daysText.setAttribute("font-weight", "bold")
    daysText.setAttribute("fill", "#f97316")
    daysText.textContent = `Days Needed: ${routeData?.daysNeeded || 1}`
    svg.appendChild(daysText)

    const speedText = document.createElementNS("http://www.w3.org/2000/svg", "text")
    speedText.setAttribute("x", "70")
    speedText.setAttribute("y", "450")
    speedText.setAttribute("font-size", "14")
    speedText.setAttribute("font-weight", "bold")
    speedText.setAttribute("fill", "#f97316")
    speedText.textContent = `Avg Speed: ${routeData?.avgSpeed || 60} mph`
    svg.appendChild(speedText)

    mapContainer.current.innerHTML = ""
    mapContainer.current.appendChild(svg)
  }, [routeData])

  return (
    <div className="space-y-4">
      <div ref={mapContainer} className="w-full"></div>

      <div className="mt-10 grid grid-cols-3 gap-4">
        <div className="p-4 rounded bg-blue-900 border border-orange-500">
          <p className="text-xs text-slate-400">Current</p>
          <p className="text-sm font-bold text-orange-500">{tripData?.currentLocation || "N/A"}</p>
        </div>
        <div className="p-4 rounded bg-blue-900 border border-orange-500">
          <p className="text-xs text-slate-400">Pickup</p>
          <p className="text-sm font-bold text-orange-500">{routeData?.pickupLocation || "N/A"}</p>
        </div>
        <div className="p-4 rounded bg-blue-900 border border-orange-500">
          <p className="text-xs text-slate-400">Dropoff</p>
          <p className="text-sm font-bold text-orange-500">{routeData?.dropoffLocation || "N/A"}</p>
        </div>
      </div>

      {routeData?.stops && routeData.stops.length > 0 && (
        <div className="p-4 rounded bg-blue-900 border border-orange-500">
          <h3 className="font-bold mb-3 text-orange-500">Planned Stops ({routeData.stops.length})</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {routeData.stops.map((stop: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between text-sm p-2 rounded bg-slate-100">
                <span className="text-slate-900">
                  {stop.type === "fuel" ? "⛽" : "🛏️"} {stop.location} (Day {stop.day})
                </span>
                <span className="text-orange-500 font-bold">{stop.time}h</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
