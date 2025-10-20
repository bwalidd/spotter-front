"use client"

import { useEffect, useRef } from "react"

interface GoogleMapDisplayProps {
  tripData: any
  routeData: any
}

// City coordinates database
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
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
  "Philadelphia, PA": { lat: 39.9526, lng: -75.1652 },
  "Detroit, MI": { lat: 42.3314, lng: -83.0458 },
  "Minneapolis, MN": { lat: 44.9778, lng: -93.2650 },
  "Tampa, FL": { lat: 27.9506, lng: -82.4572 },
  "Orlando, FL": { lat: 28.5383, lng: -81.3792 },
  "Jacksonville, FL": { lat: 30.3322, lng: -81.6557 },
  "Columbus, OH": { lat: 39.9612, lng: -82.9988 },
  "Cleveland, OH": { lat: 41.4993, lng: -81.6944 },
  "Cincinnati, OH": { lat: 39.1031, lng: -84.5120 },
  "Pittsburgh, PA": { lat: 40.4406, lng: -79.9959 },
  "Buffalo, NY": { lat: 42.8864, lng: -78.8784 },
  "Rochester, NY": { lat: 43.1566, lng: -77.6088 },
  "Albany, NY": { lat: 42.6526, lng: -73.7562 },
  "Hartford, CT": { lat: 41.7658, lng: -72.6734 },
  "Providence, RI": { lat: 41.8240, lng: -71.4128 },
  "Manchester, NH": { lat: 42.9956, lng: -71.4548 },
  "Burlington, VT": { lat: 44.4759, lng: -73.2121 },
  "Portland, ME": { lat: 43.6591, lng: -70.2568 },
  "Bangor, ME": { lat: 44.8016, lng: -68.7712 },
  "Concord, NH": { lat: 43.2081, lng: -71.5376 },
  "Montpelier, VT": { lat: 44.2601, lng: -72.5754 },
  "Augusta, ME": { lat: 44.3106, lng: -69.7795 },
  "Worcester, MA": { lat: 42.2626, lng: -71.8023 },
  "Springfield, MA": { lat: 42.1015, lng: -72.5898 },
  "New Haven, CT": { lat: 41.3083, lng: -72.9279 },
  "Bridgeport, CT": { lat: 41.1865, lng: -73.1952 },
  "Stamford, CT": { lat: 41.0534, lng: -73.5387 },
  "Newark, NJ": { lat: 40.7357, lng: -74.1724 },
  "Jersey City, NJ": { lat: 40.7178, lng: -74.0431 },
  "Paterson, NJ": { lat: 40.9168, lng: -74.1718 },
  "Elizabeth, NJ": { lat: 40.6639, lng: -74.2107 },
  "Edison, NJ": { lat: 40.5187, lng: -74.4121 },
  "Woodbridge, NJ": { lat: 40.5576, lng: -74.2846 },
  "Hamilton, NJ": { lat: 40.2276, lng: -74.6532 },
  "Trenton, NJ": { lat: 40.2206, lng: -74.7597 },
  "Camden, NJ": { lat: 39.9259, lng: -75.1196 },
  "Cherry Hill, NJ": { lat: 39.9348, lng: -75.0303 },
  "Vineland, NJ": { lat: 39.4860, lng: -75.0260 },
  "Atlantic City, NJ": { lat: 39.3643, lng: -74.4229 },
  "Cape May, NJ": { lat: 38.9351, lng: -74.9060 },
  "Wildwood, NJ": { lat: 38.9912, lng: -74.8149 },
  "Ocean City, NJ": { lat: 39.2776, lng: -74.5746 },
  "Asbury Park, NJ": { lat: 40.2204, lng: -74.0121 },
  "Long Branch, NJ": { lat: 40.3043, lng: -73.9924 },
  "Red Bank, NJ": { lat: 40.3471, lng: -74.0643 },
  "Freehold, NJ": { lat: 40.2432, lng: -74.2760 },
  "Toms River, NJ": { lat: 39.9538, lng: -74.1979 },
  "Brick, NJ": { lat: 40.0604, lng: -74.1238 },
  "Lakewood, NJ": { lat: 40.0979, lng: -74.2176 },
  "Howell, NJ": { lat: 40.1709, lng: -74.2096 },
  "Middletown, NJ": { lat: 40.3943, lng: -74.1171 },
  "Holmdel, NJ": { lat: 40.3846, lng: -74.1857 },
  "Marlboro, NJ": { lat: 40.3154, lng: -74.2460 },
  "Manalapan, NJ": { lat: 40.2779, lng: -74.3618 },
  "Old Bridge, NJ": { lat: 40.4148, lng: -74.3654 },
  "East Brunswick, NJ": { lat: 40.4279, lng: -74.4159 },
  "New Brunswick, NJ": { lat: 40.4862, lng: -74.4518 },
  "North Brunswick, NJ": { lat: 40.4593, lng: -74.4718 },
  "South Brunswick, NJ": { lat: 40.3887, lng: -74.5443 },
  "Franklin, NJ": { lat: 40.4751, lng: -74.5807 },
  "Somerset, NJ": { lat: 40.4976, lng: -74.4887 },
  "Bridgewater, NJ": { lat: 40.6007, lng: -74.6482 },
  "Branchburg, NJ": { lat: 40.5704, lng: -74.7015 },
  "Raritan, NJ": { lat: 40.5695, lng: -74.6332 },
  "Somerville, NJ": { lat: 40.4973, lng: -74.6110 },
  "Bound Brook, NJ": { lat: 40.5684, lng: -74.5385 },
  "Manville, NJ": { lat: 40.5409, lng: -74.5877 },
  "Hillsborough, NJ": { lat: 40.5207, lng: -74.6979 },
  "Montgomery, NJ": { lat: 40.4370, lng: -74.7032 },
  "Rocky Hill, NJ": { lat: 40.3990, lng: -74.6390 },
  "Princeton, NJ": { lat: 40.3573, lng: -74.6672 },
  "West Windsor, NJ": { lat: 40.2982, lng: -74.6185 },
  "East Windsor, NJ": { lat: 40.2598, lng: -74.7015 },
  "Cranbury, NJ": { lat: 40.3162, lng: -74.5138 },
  "Plainsboro, NJ": { lat: 40.3318, lng: -74.5635 },
  "Monroe, NJ": { lat: 40.3301, lng: -74.4415 },
  "Jamesburg, NJ": { lat: 40.3526, lng: -74.4402 },
  "Milltown, NJ": { lat: 40.4526, lng: -74.4432 },
  "Highland Park, NJ": { lat: 40.4959, lng: -74.4243 },
  "Piscataway, NJ": { lat: 40.4993, lng: -74.3990 },
  "Dunellen, NJ": { lat: 40.5890, lng: -74.4668 },
  "Green Brook, NJ": { lat: 40.6007, lng: -74.4779 },
  "Watchung, NJ": { lat: 40.6379, lng: -74.4507 },
  "Warren, NJ": { lat: 40.6082, lng: -74.5180 },
  "Mountainside, NJ": { lat: 40.6724, lng: -74.3573 },
  "Berkeley Heights, NJ": { lat: 40.6834, lng: -74.4427 },
  "New Providence, NJ": { lat: 40.6984, lng: -74.4013 },
  "Summit, NJ": { lat: 40.7415, lng: -74.3594 },
  "Chatham, NJ": { lat: 40.7409, lng: -74.3838 },
  "Madison, NJ": { lat: 40.7598, lng: -74.4171 },
  "Florham Park, NJ": { lat: 40.7879, lng: -74.3887 },
  "East Hanover, NJ": { lat: 40.8201, lng: -74.3643 },
  "Hanover, NJ": { lat: 40.8044, lng: -74.3665 },
  "Whippany, NJ": { lat: 40.8201, lng: -74.4159 },
  "Parsippany, NJ": { lat: 40.8579, lng: -74.4257 },
  "Troy Hills, NJ": { lat: 40.8579, lng: -74.4257 },
  "Morris Plains, NJ": { lat: 40.8218, lng: -74.4807 },
  "Morristown, NJ": { lat: 40.7968, lng: -74.4815 },
  "Morris Township, NJ": { lat: 40.7968, lng: -74.4815 },
  "Harding, NJ": { lat: 40.7409, lng: -74.4807 },
  "Mendham, NJ": { lat: 40.7757, lng: -74.6007 },
  "Chester, NJ": { lat: 40.7843, lng: -74.6965 },
  "Chester Township, NJ": { lat: 40.7843, lng: -74.6965 },
  "Washington, NJ": { lat: 40.7584, lng: -74.9793 },
  "Washington Township, NJ": { lat: 40.7584, lng: -74.9793 },
  "Long Valley, NJ": { lat: 40.7843, lng: -74.7807 },
  "Tewksbury, NJ": { lat: 40.7843, lng: -74.7807 },
  "Lebanon, NJ": { lat: 40.7843, lng: -74.7807 },
  "Clinton, NJ": { lat: 40.6365, lng: -74.9093 },
  "High Bridge, NJ": { lat: 40.6670, lng: -74.8957 },
  "Glen Gardner, NJ": { lat: 40.6965, lng: -74.9407 },
  "Hampton, NJ": { lat: 40.7070, lng: -74.9557 },
  "Bethlehem, NJ": { lat: 40.7070, lng: -74.9557 },
  "Bloomsbury, NJ": { lat: 40.7070, lng: -74.9557 },
  "Califon, NJ": { lat: 40.7070, lng: -74.9557 },
  "Clinton Township, NJ": { lat: 40.6365, lng: -74.9093 },
  "Delaware, NJ": { lat: 40.7070, lng: -74.9557 },
  "Delaware Township, NJ": { lat: 40.7070, lng: -74.9557 },
  "East Amwell, NJ": { lat: 40.7070, lng: -74.9557 },
  "Franklin Township, NJ": { lat: 40.4751, lng: -74.5807 },
  "Frenchtown, NJ": { lat: 40.5265, lng: -75.0593 },
  "Holland, NJ": { lat: 40.7070, lng: -74.9557 },
  "Holland Township, NJ": { lat: 40.7070, lng: -74.9557 },
  "Kingwood, NJ": { lat: 40.7070, lng: -74.9557 },
  "Kingwood Township, NJ": { lat: 40.7070, lng: -74.9557 },
  "Lambertville, NJ": { lat: 40.3659, lng: -74.9429 },
  "Lebanon Township, NJ": { lat: 40.7843, lng: -74.7807 },
  "Milford, NJ": { lat: 40.5704, lng: -75.0943 },
  "Raritan Township, NJ": { lat: 40.5695, lng: -74.6332 },
  "Readington, NJ": { lat: 40.7070, lng: -74.9557 },
  "Readington Township, NJ": { lat: 40.7070, lng: -74.9557 },
  "Stockton, NJ": { lat: 40.4070, lng: -74.9757 },
  "Tewksbury Township, NJ": { lat: 40.7843, lng: -74.7807 },
  "Union, NJ": { lat: 40.6976, lng: -74.2632 },
  "Union Township, NJ": { lat: 40.6976, lng: -74.2632 },
  "West Amwell, NJ": { lat: 40.7070, lng: -74.9557 },
  "Whitehouse, NJ": { lat: 40.7070, lng: -74.9557 },
  "Whitehouse Station, NJ": { lat: 40.7070, lng: -74.9557 },
  "Alexandria, NJ": { lat: 40.7070, lng: -74.9557 },
  "Alexandria Township, NJ": { lat: 40.7070, lng: -74.9557 },
  "Bethlehem Township, NJ": { lat: 40.7070, lng: -74.9557 }
}

export default function GoogleMapDisplay({ tripData, routeData }: GoogleMapDisplayProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<google.maps.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current || !tripData || !routeData) {
      console.log('Google Map: Missing data or container')
      return
    }

    console.log('Google Map: Initializing with data:', { tripData, routeData })

    // Load Google Maps API
    const loadGoogleMaps = () => {
      if ((window as any).google && (window as any).google.maps) {
        console.log('Google Maps already loaded')
        initializeMap()
        return
      }

      // Load Google Maps API
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWW5dQ&libraries=geometry&callback=initGoogleMap`
      script.async = true
      script.defer = true
      
      // Set up global callback
      ;(window as any).initGoogleMap = () => {
        console.log('Google Maps API loaded')
        initializeMap()
      }
      
      script.onerror = () => {
        console.error('Failed to load Google Maps API')
        // Fallback to simple display
        showFallbackMap()
      }
      
      document.head.appendChild(script)
    }

    const initializeMap = () => {
      try {
        const google = (window as any).google
        if (!google || !google.maps) {
          console.error('Google Maps not available')
          showFallbackMap()
          return
        }

        console.log('Initializing Google Map')

        // Get coordinates for all three points
        const currentCoords = CITY_COORDINATES[tripData.currentLocation] || { lat: 40.7128, lng: -74.006 }
        const pickupCoords = CITY_COORDINATES[routeData.pickupLocation] || { lat: 40.7128, lng: -74.006 }
        const dropoffCoords = CITY_COORDINATES[routeData.dropoffLocation] || { lat: 40.7128, lng: -74.006 }

        console.log('Coordinates:', { currentCoords, pickupCoords, dropoffCoords })

        // Calculate center point
        const centerLat = (currentCoords.lat + pickupCoords.lat + dropoffCoords.lat) / 3
        const centerLng = (currentCoords.lng + pickupCoords.lng + dropoffCoords.lng) / 3

        // Initialize map
        const map = new google.maps.Map(mapContainer.current!, {
          center: { lat: centerLat, lng: centerLng },
          zoom: 6,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        })

        mapInstance.current = map

        // Create custom markers
        const currentMarker = new google.maps.Marker({
          position: currentCoords,
          map: map,
          title: `Current: ${tripData.currentLocation}`,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 15,
            fillColor: '#22c55e',
            fillOpacity: 1,
            strokeColor: '#f97316',
            strokeWeight: 3
          },
          label: {
            text: 'C',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '12px'
          }
        })

        const pickupMarker = new google.maps.Marker({
          position: pickupCoords,
          map: map,
          title: `Pickup: ${routeData.pickupLocation}`,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 15,
            fillColor: '#eab308',
            fillOpacity: 1,
            strokeColor: '#f97316',
            strokeWeight: 3
          },
          label: {
            text: 'P',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '12px'
          }
        })

        const dropoffMarker = new google.maps.Marker({
          position: dropoffCoords,
          map: map,
          title: `Dropoff: ${routeData.dropoffLocation}`,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 15,
            fillColor: '#ef4444',
            fillOpacity: 1,
            strokeColor: '#f97316',
            strokeWeight: 3
          },
          label: {
            text: 'D',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '12px'
          }
        })

        // Add info windows
        const currentInfoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <h3 style="margin: 0 0 4px 0; color: #22c55e; font-size: 14px;">Current Location</h3>
              <p style="margin: 0; font-size: 12px;">${tripData.currentLocation}</p>
            </div>
          `
        })

        const pickupInfoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <h3 style="margin: 0 0 4px 0; color: #eab308; font-size: 14px;">Pickup Location</h3>
              <p style="margin: 0; font-size: 12px;">${routeData.pickupLocation}</p>
            </div>
          `
        })

        const dropoffInfoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <h3 style="margin: 0 0 4px 0; color: #ef4444; font-size: 14px;">Dropoff Location</h3>
              <p style="margin: 0; font-size: 12px;">${routeData.dropoffLocation}</p>
            </div>
          `
        })

        // Add click listeners
        currentMarker.addListener('click', () => {
          currentInfoWindow.open(map, currentMarker)
        })

        pickupMarker.addListener('click', () => {
          pickupInfoWindow.open(map, pickupMarker)
        })

        dropoffMarker.addListener('click', () => {
          dropoffInfoWindow.open(map, dropoffMarker)
        })

        // Draw route lines
        const currentToPickupPath = new google.maps.Polyline({
          path: [currentCoords, pickupCoords],
          geodesic: true,
          strokeColor: '#22c55e',
          strokeOpacity: 0.8,
          strokeWeight: 4
        })

        const pickupToDropoffPath = new google.maps.Polyline({
          path: [pickupCoords, dropoffCoords],
          geodesic: true,
          strokeColor: '#eab308',
          strokeOpacity: 0.8,
          strokeWeight: 4
        })

        currentToPickupPath.setMap(map)
        pickupToDropoffPath.setMap(map)

        // Fit bounds to show all markers
        const bounds = new google.maps.LatLngBounds()
        bounds.extend(currentCoords)
        bounds.extend(pickupCoords)
        bounds.extend(dropoffCoords)
        map.fitBounds(bounds)

        // Add some padding
        const listener = google.maps.event.addListener(map, 'idle', () => {
          if (map.getZoom() > 10) map.setZoom(10)
          google.maps.event.removeListener(listener)
        })

        console.log('Google Map initialized successfully')

      } catch (error) {
        console.error('Error initializing Google Map:', error)
        showFallbackMap()
      }
    }

    const showFallbackMap = () => {
      console.log('Showing fallback map')
      if (mapContainer.current) {
        mapContainer.current.innerHTML = `
          <div style="
            width: 100%; 
            height: 400px; 
            background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
            border: 2px solid #f97316;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            color: #374151;
            font-family: Arial, sans-serif;
          ">
            <div style="font-size: 24px; margin-bottom: 8px;">🗺️</div>
            <div style="font-size: 16px; font-weight: bold; margin-bottom: 4px;">Route Map</div>
            <div style="font-size: 12px; text-align: center;">
              <div>Current: ${tripData?.currentLocation || 'N/A'}</div>
              <div>Pickup: ${routeData?.pickupLocation || 'N/A'}</div>
              <div>Dropoff: ${routeData?.dropoffLocation || 'N/A'}</div>
            </div>
          </div>
        `
      }
    }

    loadGoogleMaps()

    // Cleanup
    return () => {
      if (mapInstance.current) {
        mapInstance.current = null
      }
    }
  }, [tripData, routeData])

  return (
    <div className="space-y-4">
      <div ref={mapContainer} className="w-full h-96 rounded-lg border-2 border-orange-500"></div>

      <div className="grid grid-cols-3 gap-4">
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
