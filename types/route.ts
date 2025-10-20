export interface Stop {
  type: "fuel" | "rest"
  location: string
  distance: number
  time: number
  day: number
}

export interface RouteData {
  distance: number
  duration: number
  daysNeeded: number
  stops: Stop[]
  avgSpeed: number
  pickupLocation: string
  dropoffLocation: string
}
