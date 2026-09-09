export interface MapProvider {
  geocode(address: string): Promise<GeocodeResult>
  reverseGeocode(lat: number, lng: number): Promise<ReverseGeocodeResult>
  getDistance(origin: LatLng, destination: LatLng): Promise<DistanceResult>
  getDirections(origin: LatLng, destination: LatLng): Promise<DirectionsResult>
}

export interface LatLng {
  lat: number
  lng: number
}

export interface GeocodeResult {
  lat: number
  lng: number
  formattedAddress: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
}

export interface ReverseGeocodeResult {
  address: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
}

export interface DistanceResult {
  distanceKm: number
  durationMinutes: number
}

export interface DirectionsResult {
  distanceKm: number
  durationMinutes: number
  steps: DirectionStep[]
}

export interface DirectionStep {
  instruction: string
  distance: number
  duration: number
}
