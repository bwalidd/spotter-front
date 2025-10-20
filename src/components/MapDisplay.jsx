"use client"

import { useEffect, useRef } from "react"

export default function MapDisplay({ tripData, routeData }) {
  const mapContainer = useRef(null)

  useEffect(() => {
    if (!mapContainer.current || !routeData) return

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("width", "100%")
    svg.setAttribute("height", "500")
    svg.setAttribute("viewBox", "0 0 1000 500")
    svg.style.backgroundColor = "var(--color-neutral-light)"
    svg.style.borderRadius = "8px"
    svg.style.border = "2px solid var(--color-accent)"

    // Draw gradient background
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs")
    const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient")
    gradient.setAttribute("id", "routeGradient")
    gradient.setAttribute("x1", "0%")
    gradient.setAttribute("y1", "0%")
    gradient.setAttribute("x2", "100%")
    gradient.setAttribute("y2", "0%")

    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop")
    stop1.setAttribute("offset", "0%")
    stop1.setAttribute("stop-color", "var(--color-success)")
    stop1.setAttribute("stop-opacity", "0.3")
    gradient.appendChild(stop1)

    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop")
    stop2.setAttribute("offset", "100%")
    stop2.setAttribute("stop-color", "var(--color-error)")
    stop2.setAttribute("stop-opacity", "0.3")
    gradient.appendChild(stop2)

    defs.appendChild(gradient)
    svg.appendChild(defs)

    // Draw route lines with gradient
    const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line")
    line1.setAttribute("x1", "80")
    line1.setAttribute("y1", "250")
    line1.setAttribute("x2", "500")
    line1.setAttribute("y2", "250")
    line1.setAttribute("stroke", "url(#routeGradient)")
    line1.setAttribute("stroke-width", "6")
    line1.setAttribute("stroke-linecap", "round")
    svg.appendChild(line1)

    const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line")
    line2.setAttribute("x1", "500")
    line2.setAttribute("y1", "250")
    line2.setAttribute("x2", "920")
    line2.setAttribute("y2", "250")
    line2.setAttribute("stroke", "url(#routeGradient)")
    line2.setAttribute("stroke-width", "6")
    line2.setAttribute("stroke-linecap", "round")
    svg.appendChild(line2)

    // Draw current location point
    const currentCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    currentCircle.setAttribute("cx", "80")
    currentCircle.setAttribute("cy", "250")
    currentCircle.setAttribute("r", "12")
    currentCircle.setAttribute("fill", "var(--color-success)")
    currentCircle.setAttribute("stroke", "var(--color-accent)")
    currentCircle.setAttribute("stroke-width", "2")
    svg.appendChild(currentCircle)

    // Add current location label
    const currentLabel = document.createElementNS("http://www.w3.org/2000/svg", "text")
    currentLabel.setAttribute("x", "80")
    currentLabel.setAttribute("y", "280")
    currentLabel.setAttribute("text-anchor", "middle")
    currentLabel.setAttribute("font-size", "12")
    currentLabel.setAttribute("fill", "var(--color-accent)")
    currentLabel.setAttribute("font-weight", "bold")
    currentLabel.textContent = "CURRENT"
    svg.appendChild(currentLabel)

    // Draw pickup point
    const pickupCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    pickupCircle.setAttribute("cx", "500")
    pickupCircle.setAttribute("cy", "250")
    pickupCircle.setAttribute("r", "12")
    pickupCircle.setAttribute("fill", "var(--color-warning)")
    pickupCircle.setAttribute("stroke", "var(--color-accent)")
    pickupCircle.setAttribute("stroke-width", "2")
    svg.appendChild(pickupCircle)

    // Add pickup label
    const pickupLabel = document.createElementNS("http://www.w3.org/2000/svg", "text")
    pickupLabel.setAttribute("x", "500")
    pickupLabel.setAttribute("y", "280")
    pickupLabel.setAttribute("text-anchor", "middle")
    pickupLabel.setAttribute("font-size", "12")
    pickupLabel.setAttribute("fill", "var(--color-accent)")
    pickupLabel.setAttribute("font-weight", "bold")
    pickupLabel.textContent = "PICKUP"
    svg.appendChild(pickupLabel)

    // Draw dropoff point
    const dropoffCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    dropoffCircle.setAttribute("cx", "920")
    dropoffCircle.setAttribute("cy", "250")
    dropoffCircle.setAttribute("r", "12")
    dropoffCircle.setAttribute("fill", "var(--color-error)")
    dropoffCircle.setAttribute("stroke", "var(--color-accent)")
    dropoffCircle.setAttribute("stroke-width", "2")
    svg.appendChild(dropoffCircle)

    // Add dropoff label
    const dropoffLabel = document.createElementNS("http://www.w3.org/2000/svg", "text")
    dropoffLabel.setAttribute("x", "920")
    dropoffLabel.setAttribute("y", "280")
    dropoffLabel.setAttribute("text-anchor", "middle")
    dropoffLabel.setAttribute("font-size", "12")
    dropoffLabel.setAttribute("fill", "var(--color-accent)")
    dropoffLabel.setAttribute("font-weight", "bold")
    dropoffLabel.textContent = "DROPOFF"
    svg.appendChild(dropoffLabel)

    // Draw stops
    if (routeData?.stops && routeData.stops.length > 0) {
      routeData.stops.forEach((stop, index) => {
        const x = 80 + ((index + 1) / (routeData.stops.length + 1)) * 840
        const stopCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
        stopCircle.setAttribute("cx", x)
        stopCircle.setAttribute("cy", "250")
        stopCircle.setAttribute("r", "8")
        stopCircle.setAttribute("fill", stop.type === "fuel" ? "var(--color-warning)" : "var(--color-primary)")
        stopCircle.setAttribute("stroke", "var(--color-accent)")
        stopCircle.setAttribute("stroke-width", "1.5")
        svg.appendChild(stopCircle)

        // Add stop label
        const stopLabel = document.createElementNS("http://www.w3.org/2000/svg", "text")
        stopLabel.setAttribute("x", x)
        stopLabel.setAttribute("y", "220")
        stopLabel.setAttribute("text-anchor", "middle")
        stopLabel.setAttribute("font-size", "10")
        stopLabel.setAttribute("fill", "var(--color-accent)")
        stopLabel.textContent = stop.type === "fuel" ? "FUEL" : "REST"
        svg.appendChild(stopLabel)
      })
    }

    // Add distance and duration info
    const infoBox = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    infoBox.setAttribute("x", "50")
    infoBox.setAttribute("y", "350")
    infoBox.setAttribute("width", "900")
    infoBox.setAttribute("height", "120")
    infoBox.setAttribute("fill", "var(--color-primary)")
    infoBox.setAttribute("stroke", "var(--color-accent)")
    infoBox.setAttribute("stroke-width", "2")
    infoBox.setAttribute("rx", "8")
    svg.appendChild(infoBox)

    // Route info text
    const distanceText = document.createElementNS("http://www.w3.org/2000/svg", "text")
    distanceText.setAttribute("x", "70")
    distanceText.setAttribute("y", "375")
    distanceText.setAttribute("font-size", "14")
    distanceText.setAttribute("font-weight", "bold")
    distanceText.setAttribute("fill", "var(--color-accent)")
    distanceText.textContent = `Distance: ${routeData?.distance || 0} miles`
    svg.appendChild(distanceText)

    const durationText = document.createElementNS("http://www.w3.org/2000/svg", "text")
    durationText.setAttribute("x", "70")
    durationText.setAttribute("y", "400")
    durationText.setAttribute("font-size", "14")
    durationText.setAttribute("font-weight", "bold")
    durationText.setAttribute("fill", "var(--color-accent)")
    durationText.textContent = `Est. Duration: ${routeData?.duration || 0} hours`
    svg.appendChild(durationText)

    const daysText = document.createElementNS("http://www.w3.org/2000/svg", "text")
    daysText.setAttribute("x", "70")
    daysText.setAttribute("y", "425")
    daysText.setAttribute("font-size", "14")
    daysText.setAttribute("font-weight", "bold")
    daysText.setAttribute("fill", "var(--color-accent)")
    daysText.textContent = `Days Needed: ${routeData?.daysNeeded || 1}`
    svg.appendChild(daysText)

    const speedText = document.createElementNS("http://www.w3.org/2000/svg", "text")
    speedText.setAttribute("x", "70")
    speedText.setAttribute("y", "450")
    speedText.setAttribute("font-size", "14")
    speedText.setAttribute("font-weight", "bold")
    speedText.setAttribute("fill", "var(--color-accent)")
    speedText.textContent = `Avg Speed: ${routeData?.avgSpeed || 60} mph`
    svg.appendChild(speedText)

    mapContainer.current.innerHTML = ""
    mapContainer.current.appendChild(svg)
  }, [routeData])

  return (
    <div className="space-y-4">
      <div ref={mapContainer} className="w-full"></div>

      <div className="grid grid-cols-3 gap-4">
        <div
          className="p-4 rounded"
          style={{ backgroundColor: "var(--color-primary)", border: "1px solid var(--color-accent)" }}
        >
          <p className="text-xs" style={{ color: "var(--color-neutral-gray)" }}>
            Current
          </p>
          <p className="text-sm font-bold" style={{ color: "var(--color-accent)" }}>
            {tripData?.currentLocation || "N/A"}
          </p>
        </div>
        <div
          className="p-4 rounded"
          style={{ backgroundColor: "var(--color-primary)", border: "1px solid var(--color-accent)" }}
        >
          <p className="text-xs" style={{ color: "var(--color-neutral-gray)" }}>
            Pickup
          </p>
          <p className="text-sm font-bold" style={{ color: "var(--color-accent)" }}>
            {routeData?.pickupLocation || "N/A"}
          </p>
        </div>
        <div
          className="p-4 rounded"
          style={{ backgroundColor: "var(--color-primary)", border: "1px solid var(--color-accent)" }}
        >
          <p className="text-xs" style={{ color: "var(--color-neutral-gray)" }}>
            Dropoff
          </p>
          <p className="text-sm font-bold" style={{ color: "var(--color-accent)" }}>
            {routeData?.dropoffLocation || "N/A"}
          </p>
        </div>
      </div>

      {routeData?.stops && routeData.stops.length > 0 && (
        <div
          className="p-4 rounded"
          style={{ backgroundColor: "var(--color-primary)", border: "1px solid var(--color-accent)" }}
        >
          <h3 className="font-bold mb-3" style={{ color: "var(--color-accent)" }}>
            Planned Stops ({routeData.stops.length})
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {routeData.stops.map((stop, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-sm p-2 rounded"
                style={{ backgroundColor: "var(--color-neutral-light)" }}
              >
                <span style={{ color: "var(--color-neutral-dark)" }}>
                  {stop.type === "fuel" ? "⛽" : "🛏️"} {stop.location} (Day {stop.day})
                </span>
                <span style={{ color: "var(--color-accent)" }} className="font-bold">
                  {stop.time}h
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
