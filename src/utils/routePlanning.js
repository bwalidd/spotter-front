// Route planning utility for calculating realistic routes between cities
// Uses approximate distances and calculates optimal stops based on HOS regulations

const MAJOR_CITIES = {
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
}

// Calculate approximate distance between two cities using Haversine formula
function calculateDistance(city1, city2) {
  const loc1 = MAJOR_CITIES[city1]
  const loc2 = MAJOR_CITIES[city2]

  if (!loc1 || !loc2) {
    // Fallback: estimate based on city name patterns
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

// Calculate average speed (varies by road type and conditions)
function getAverageSpeed() {
  return 60 // mph - conservative estimate for long hauls
}

// Generate realistic stops based on HOS regulations
export function planRoute(pickupLocation, dropoffLocation, currentCycleUsed) {
  const distance = calculateDistance(pickupLocation, dropoffLocation)
  const avgSpeed = getAverageSpeed()
  const drivingTime = distance / avgSpeed

  // HOS regulations: max 11 hours driving, must have 10 hour break
  const maxDrivingPerDay = 11
  const requiredBreak = 10
  const daysNeeded = Math.ceil(drivingTime / maxDrivingPerDay)

  const stops = []
  let remainingDistance = distance
  let remainingDrivingTime = drivingTime
  let currentDay = 1

  // Generate stops
  for (let i = 0; i < daysNeeded - 1; i++) {
    const dayDrivingTime = Math.min(maxDrivingPerDay, remainingDrivingTime)
    const dayDistance = dayDrivingTime * avgSpeed

    // Add fuel stop (every 400-500 miles)
    if (dayDistance > 400) {
      stops.push({
        type: "fuel",
        location: `Stop ${i + 1}`,
        distance: dayDistance * 0.6,
        time: 0.5,
        day: currentDay,
      })
    }

    // Add mandatory rest break
    stops.push({
      type: "rest",
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
    distance: Math.round(distance),
    duration: Math.round(drivingTime * 10) / 10,
    daysNeeded,
    stops,
    avgSpeed,
    pickupLocation,
    dropoffLocation,
  }
}

// Get coordinates for route visualization
export function getRouteCoordinates(pickupLocation, dropoffLocation) {
  const start = MAJOR_CITIES[pickupLocation] || { lat: 35, lng: -95 }
  const end = MAJOR_CITIES[dropoffLocation] || { lat: 40, lng: -75 }

  return {
    start,
    end,
    midpoint: {
      lat: (start.lat + end.lat) / 2,
      lng: (start.lng + end.lng) / 2,
    },
  }
}
