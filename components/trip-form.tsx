"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface TripFormProps {
  onSubmit: (formData: any) => void
}

// Major US cities database for autocomplete
const MAJOR_CITIES = [
  "Dallas, TX", "Houston, TX", "Austin, TX", "San Antonio, TX",
  "Oklahoma City, OK", "Memphis, TN", "Nashville, TN", "Atlanta, GA",
  "Charlotte, NC", "New York, NY", "Los Angeles, CA", "Chicago, IL",
  "Denver, CO", "Phoenix, AZ", "Las Vegas, NV", "Miami, FL",
  "Boston, MA", "Seattle, WA", "San Francisco, CA", "Portland, OR",
  "Philadelphia, PA", "Detroit, MI", "Minneapolis, MN", "Tampa, FL",
  "Orlando, FL", "Jacksonville, FL", "Columbus, OH", "Cleveland, OH",
  "Cincinnati, OH", "Pittsburgh, PA", "Buffalo, NY", "Rochester, NY",
  "Albany, NY", "Hartford, CT", "Providence, RI", "Manchester, NH",
  "Burlington, VT", "Portland, ME", "Bangor, ME", "Concord, NH",
  "Montpelier, VT", "Augusta, ME", "Worcester, MA", "Springfield, MA",
  "New Haven, CT", "Bridgeport, CT", "Stamford, CT", "Newark, NJ",
  "Jersey City, NJ", "Paterson, NJ", "Elizabeth, NJ", "Edison, NJ",
  "Woodbridge, NJ", "Hamilton, NJ", "Trenton, NJ", "Camden, NJ",
  "Cherry Hill, NJ", "Vineland, NJ", "Atlantic City, NJ", "Cape May, NJ",
  "Wildwood, NJ", "Ocean City, NJ", "Asbury Park, NJ", "Long Branch, NJ",
  "Red Bank, NJ", "Freehold, NJ", "Toms River, NJ", "Brick, NJ",
  "Lakewood, NJ", "Howell, NJ", "Middletown, NJ", "Holmdel, NJ",
  "Marlboro, NJ", "Manalapan, NJ", "Old Bridge, NJ", "East Brunswick, NJ",
  "New Brunswick, NJ", "North Brunswick, NJ", "South Brunswick, NJ",
  "Franklin, NJ", "Somerset, NJ", "Bridgewater, NJ", "Branchburg, NJ",
  "Raritan, NJ", "Somerville, NJ", "Bound Brook, NJ", "Manville, NJ",
  "Hillsborough, NJ", "Montgomery, NJ", "Rocky Hill, NJ", "Princeton, NJ",
  "West Windsor, NJ", "East Windsor, NJ", "Cranbury, NJ", "Plainsboro, NJ",
  "Monroe, NJ", "Jamesburg, NJ", "Milltown, NJ", "Highland Park, NJ",
  "Piscataway, NJ", "Dunellen, NJ", "Green Brook, NJ", "Watchung, NJ",
  "Warren, NJ", "Mountainside, NJ", "Berkeley Heights, NJ", "New Providence, NJ",
  "Summit, NJ", "Chatham, NJ", "Madison, NJ", "Florham Park, NJ",
  "East Hanover, NJ", "Hanover, NJ", "Whippany, NJ", "Parsippany, NJ",
  "Troy Hills, NJ", "Morris Plains, NJ", "Morristown, NJ", "Morris Township, NJ",
  "Harding, NJ", "Mendham, NJ", "Chester, NJ", "Chester Township, NJ",
  "Washington, NJ", "Washington Township, NJ", "Long Valley, NJ", "Tewksbury, NJ",
  "Lebanon, NJ", "Clinton, NJ", "High Bridge, NJ", "Glen Gardner, NJ",
  "Hampton, NJ", "Bethlehem, NJ", "Bloomsbury, NJ", "Califon, NJ",
  "Clinton Township, NJ", "Delaware, NJ", "Delaware Township, NJ", "East Amwell, NJ",
  "Franklin, NJ", "Franklin Township, NJ", "Frenchtown, NJ", "Holland, NJ",
  "Holland Township, NJ", "Kingwood, NJ", "Kingwood Township, NJ", "Lambertville, NJ",
  "Lebanon Township, NJ", "Milford, NJ", "Raritan Township, NJ", "Readington, NJ",
  "Readington Township, NJ", "Stockton, NJ", "Tewksbury Township, NJ",
  "Union, NJ", "Union Township, NJ", "West Amwell, NJ", "Whitehouse, NJ",
  "Whitehouse Station, NJ", "Alexandria, NJ", "Alexandria Township, NJ", "Bethlehem Township, NJ",
  "Bloomsbury, NJ", "Califon, NJ", "Clinton Township, NJ", "Delaware Township, NJ",
  "East Amwell, NJ", "Franklin Township, NJ", "Frenchtown, NJ", "Glen Gardner, NJ",
  "Hampton, NJ", "Holland Township, NJ", "Kingwood Township, NJ", "Lambertville, NJ",
  "Lebanon Township, NJ", "Milford, NJ", "Raritan Township, NJ", "Readington Township, NJ",
  "Stockton, NJ", "Tewksbury Township, NJ", "Union Township, NJ", "West Amwell, NJ",
  "Whitehouse Station, NJ"
]

export default function TripForm({ onSubmit }: TripFormProps) {
  const [formData, setFormData] = useState({
    currentLocation: "",
    pickupLocation: "",
    dropoffLocation: "",
    cycleUsed: 0,
  })

  const [errors, setErrors] = useState<string[]>([])

  console.log('TripForm render - formData:', formData)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cycleUsed" ? (value === "" ? 0 : Math.max(0, Number.parseFloat(value) || 0)) : value,
    }))
  }


  const validateForm = () => {
    const newErrors: string[] = []
    if (!formData.currentLocation.trim()) newErrors.push("Current location is required")
    if (!formData.pickupLocation.trim()) newErrors.push("Pickup location is required")
    if (!formData.dropoffLocation.trim()) newErrors.push("Dropoff location is required")
    if (formData.cycleUsed < 0 || formData.cycleUsed > 70) newErrors.push("Cycle used must be between 0 and 70 hours")
    if (formData.pickupLocation === formData.dropoffLocation)
      newErrors.push("Pickup and dropoff locations must be different")
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg p-8 shadow-xl bg-blue-900 border-2 border-orange-500">
        <h2 className="text-2xl font-bold mb-6 text-orange-500">Trip Details</h2>

        {errors.length > 0 && (
          <div className="mb-6 p-4 rounded-lg bg-red-900 bg-opacity-20 border border-red-500">
            {errors.map((error, idx) => (
              <p key={idx} className="text-red-400 text-sm">
                • {error}
              </p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Location */}
          <div>
            <label className="block text-sm font-medium mb-2 text-blue-200">Current Location</label>
            <select
              name="currentLocation"
              value={formData.currentLocation}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded border-2 border-orange-500 bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select your current location</option>
              {MAJOR_CITIES.sort().map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Pickup Location */}
          <div>
            <label className="block text-sm font-medium mb-2 text-blue-200">Pickup Location</label>
            <select
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded border-2 border-orange-500 bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select pickup location</option>
              {MAJOR_CITIES.sort().map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Dropoff Location */}
          <div>
            <label className="block text-sm font-medium mb-2 text-blue-200">Dropoff Location</label>
            <select
              name="dropoffLocation"
              value={formData.dropoffLocation}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded border-2 border-orange-500 bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select dropoff location</option>
              {MAJOR_CITIES.sort().map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Cycle Used */}
          <div>
            <label className="block text-sm font-medium mb-2 text-blue-200">Current Cycle Used (Hours)</label>
            <input
              type="number"
              name="cycleUsed"
              value={formData.cycleUsed}
              onChange={handleChange}
              min="0"
              max="70"
              step="0.5"
              className="w-full px-4 py-3 rounded border-2 border-orange-500 bg-slate-100 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <p className="text-xs mt-2 text-slate-400">
              70-hour/8-day cycle. Available: {Math.max(0, 70 - formData.cycleUsed).toFixed(1)} hours
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded font-bold text-lg transition-all hover:opacity-90 hover:shadow-lg bg-orange-500 text-slate-900"
          >
            Generate Route & ELD Logs
          </button>
        </form>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-blue-900 border border-orange-500">
          <h3 className="font-bold mb-2 text-orange-500">Route Planning</h3>
          <p className="text-sm text-blue-200">Automatic route optimization with realistic distance calculations</p>
        </div>
        <div className="p-4 rounded-lg bg-blue-900 border border-orange-500">
          <h3 className="font-bold mb-2 text-orange-500">HOS Compliance</h3>
          <p className="text-sm text-blue-200">FMCSA-compliant hours of service validation and tracking</p>
        </div>
        <div className="p-4 rounded-lg bg-blue-900 border border-orange-500">
          <h3 className="font-bold mb-2 text-orange-500">PDF Export</h3>
          <p className="text-sm text-blue-200">Professional PDF reports ready for regulatory submission</p>
        </div>
      </div>
    </div>
  )
}
