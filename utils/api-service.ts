// API service for communicating with the Django backend

const API_BASE_URL = 'http://localhost:8000/api';

export async function saveTripAndLogs(tripData: any, routeData: any, logs: any[], forceNewTrip: boolean = false) {
  try {
    // First check if this is a new trip or an existing one
    let tripId = forceNewTrip ? null : localStorage.getItem('currentTripId');
    let response;
    
    if (tripId && !forceNewTrip) {
      // Update existing trip
      response = await fetch(`${API_BASE_URL}/trips/${tripId}/save_logs/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tripData,
          routeData,
          logs,
        }),
      });
      console.log('save logs----->', response);
    } else {
      // Create new trip - clear the current trip ID if we're forcing a new trip
      if (forceNewTrip) {
        localStorage.removeItem('currentTripId');
      }
      
      response = await fetch(`${API_BASE_URL}/trips/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_location: tripData.currentLocation,
          pickup_location: tripData.pickupLocation,
          dropoff_location: tripData.dropoffLocation,
          cycle_used: tripData.cycleUsed,
          route_data: {
            distance: routeData.distance,
            duration: routeData.duration,
            days_needed: routeData.daysNeeded,
            avg_speed: routeData.avgSpeed,
            stops: routeData.stops,
          },
          logs: logs.map(log => ({
            day: log.day,
            date: log.date,
            activities: log.activities,
            remarks: log.remarks || [],
            notes: log.notes || '',
          })),
        }),
      });
      
      if (response.ok) {
        try {
          const data = await response.json();
          if (data && data.id) {
            // Store the new trip ID
            localStorage.setItem('currentTripId', data.id.toString());
            tripId = data.id.toString();
            
            // Also store this ID in the trip history
            const tripHistory = JSON.parse(localStorage.getItem('tripHistory') || '[]');
            if (!tripHistory.includes(data.id.toString())) {
              tripHistory.push(data.id.toString());
              localStorage.setItem('tripHistory', JSON.stringify(tripHistory));
            }
          }
        } catch (parseError) {
          console.error('Error parsing response JSON:', parseError);
          // Continue execution even if JSON parsing fails
        }
      }
    }
    
    if (!response.ok) {
      // Return error object instead of throwing to prevent page freezing
      return { 
        success: false, 
        error: `Failed to save trip data: ${response.status} ${response.statusText}` 
      };
    }
    
    return { success: true, tripId };
  } catch (error) {
    console.error('Error saving trip data:', error);
    return { success: false, error };
  }
}

export async function fetchTrips() {
  try {
    const response = await fetch(`${API_BASE_URL}/trips/`);
    if (!response.ok) {
      throw new Error('Failed to fetch trips');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching trips:', error);
    return [];
  }
}

export async function fetchTripById(tripId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/trips/${tripId}/`);
    if (!response.ok) {
      throw new Error('Failed to fetch trip');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching trip:', error);
    return null;
  }
}