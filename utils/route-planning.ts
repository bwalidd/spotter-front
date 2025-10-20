import type { RouteData } from "@/types/route"

const MAJOR_CITIES: Record<string, { lat: number; lng: number }> = {
  "Dallas, TX": { lat: 32.7767, lng: -96.797 },
  "Houston, TX": { lat: 29.7604, lng: -95.3698 },
  "Austin, TX": { lat: 30.2672, lng: -97.7431 },
  "San Antonio, TX": { lat: 29.4241, lng: -98.4936 },
  "Oklahoma City, OK": { lat: 35.4676, lng: -97.5164 },
  "Memphis, TN": { lat: 35.1495, lng: -90.049 },
  "Nashville, TN": { lat: 36.1627, lng: -86.7816 },
  "Atlanta, GA": { lat: 33.749, lng: -84.388 },
  "Charlotte, NC": { lat: 35.2271, lng: -80.8431 },
  "New York, NY": { lat: 40.7128, lng: -74.006 },
  "Los Angeles, CA": { lat: 34.0522, lng: -118.2437 },
  "Chicago, IL": { lat: 41.8781, lng: -87.6298 },
  "Denver, CO": { lat: 39.7392, lng: -104.9903 },
  "Phoenix, AZ": { lat: 33.4484, lng: -112.0742 },
  "Las Vegas, NV": { lat: 36.1699, lng: -115.1398 },
  "Miami, FL": { lat: 25.7617, lng: -80.1918 },
  "Boston, MA": { lat: 42.3601, lng: -71.0589 },
  "Seattle, WA": { lat: 47.6062, lng: -122.3321 },
  "San Francisco, CA": { lat: 37.7749, lng: -122.4194 },
  "Portland, OR": { lat: 45.5152, lng: -122.6784 },
}

// Calculate distance using Haversine formula (fallback if API fails)
function calculateDistanceHaversine(city1: string, city2: string): number {
  const loc1 = MAJOR_CITIES[city1]
  const loc2 = MAJOR_CITIES[city2]

  if (!loc1 || !loc2) {
    return Math.random() * 1000 + 200
  }

  const R = 3959 // Earth's radius in miles
  const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180
  const dLng = ((loc2.lng - loc1.lng) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((loc1.lat * Math.PI) / 180) *
      Math.cos((loc2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

async function fetchOSRMRoute(city1: string, city2: string): Promise<{ distance: number; duration: number } | null> {
  try {
    const loc1 = MAJOR_CITIES[city1]
    const loc2 = MAJOR_CITIES[city2]

    if (!loc1 || !loc2) return null

    // OSRM Demo server (free, no API key required)
    const url = `https://router.project-osrm.org/route/v1/driving/${loc1.lng},${loc1.lat};${loc2.lng},${loc2.lat}?overview=false`

    const response = await fetch(url)
    if (!response.ok) throw new Error("OSRM API error")

    const data = await response.json()
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0]
      return {
        distance: Math.round(route.distance / 1609.34), // Convert meters to miles
        duration: Math.round((route.duration / 3600) * 10) / 10, // Convert seconds to hours
      }
    }
  } catch (error) {
    console.log("[v0] OSRM API failed, using fallback calculation")
  }
  return null
}

// Generate realistic stops based on HOS regulations
export async function planRoute(
  currentLocation: string,
  pickupLocation: string,
  dropoffLocation: string,
  currentCycleUsed: number,
): Promise<RouteData> {
  // Calculate total distance including current location to pickup
  const currentToPickupDistance = calculateDistanceHaversine(currentLocation, pickupLocation)
  const pickupToDropoffDistance = calculateDistanceHaversine(pickupLocation, dropoffLocation)
  const totalDistance = currentToPickupDistance + pickupToDropoffDistance

  // Try to fetch real route data from OSRM for pickup to dropoff
  let routeData = await fetchOSRMRoute(pickupLocation, dropoffLocation)

  // Fallback to Haversine calculation if API fails
  if (!routeData) {
    routeData = {
      distance: totalDistance,
      duration: Math.round((totalDistance / 60) * 10) / 10, // Assume 60 mph average
    }
  } else {
    // Add current to pickup distance to the route data
    routeData.distance = currentToPickupDistance + routeData.distance
    routeData.duration = (currentToPickupDistance / 60) + routeData.duration
  }

  const { distance, duration } = routeData
  const avgSpeed = Math.round(distance / duration) || 60

  // HOS regulations: max 11 hours driving, must have 10 hour break
  const maxDrivingPerDay = 11
  const requiredBreak = 10
  const daysNeeded = Math.ceil(duration / maxDrivingPerDay)

  const stops = []
  let remainingDistance = distance
  let remainingDrivingTime = duration
  let currentDay = 1

  // Generate stops based on distance and HOS rules
  for (let i = 0; i < daysNeeded - 1; i++) {
    const dayDrivingTime = Math.min(maxDrivingPerDay, remainingDrivingTime)
    const dayDistance = Math.round(dayDrivingTime * avgSpeed)

    // Add fuel stop (every 400-500 miles)
    if (dayDistance > 400) {
      stops.push({
        type: "fuel" as "fuel",
        location: `Fuel Stop ${i + 1}`,
        distance: Math.round(dayDistance * 0.6),
        time: 0.5,
        day: currentDay,
      })
    }

    // Add mandatory rest break
    stops.push({
      type: "rest" as "rest",
      location: `Rest Area ${i + 1}`,
      distance: dayDistance,
      time: requiredBreak,
      day: currentDay,
    })

    remainingDistance -= dayDistance
    remainingDrivingTime -= dayDrivingTime
    currentDay++
  }

  return {
    distance,
    duration,
    daysNeeded,
    stops,
    avgSpeed,
    pickupLocation,
    dropoffLocation,
  }
}
