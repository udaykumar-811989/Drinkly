import type {
  MapProvider,
  LatLng,
  GeocodeResult,
  ReverseGeocodeResult,
  DistanceResult,
  DirectionsResult,
} from './types'

export class GoogleMapsProvider implements MapProvider {
  private apiKey: string
  private baseUrl = 'https://maps.googleapis.com/maps/api'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async geocode(address: string): Promise<GeocodeResult> {
    const params = new URLSearchParams({
      address,
      key: this.apiKey,
    })

    const response = await fetch(`${this.baseUrl}/geocode/json?${params}`)
    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.status !== 'OK' || !data.results?.length) {
      throw new Error(`Geocoding returned status: ${data.status}`)
    }

    const result = data.results[0]
    const location = result.geometry.location
    const components = this.extractAddressComponents(result.address_components)

    return {
      lat: location.lat,
      lng: location.lng,
      formattedAddress: result.formatted_address,
      city: components.city,
      state: components.state,
      country: components.country,
      zipCode: components.zipCode,
    }
  }

  async reverseGeocode(lat: number, lng: number): Promise<ReverseGeocodeResult> {
    const params = new URLSearchParams({
      latlng: `${lat},${lng}`,
      key: this.apiKey,
    })

    const response = await fetch(`${this.baseUrl}/geocode/json?${params}`)
    if (!response.ok) {
      throw new Error(`Reverse geocoding failed: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.status !== 'OK' || !data.results?.length) {
      throw new Error(`Reverse geocoding returned status: ${data.status}`)
    }

    const result = data.results[0]
    const components = this.extractAddressComponents(result.address_components)

    return {
      address: result.formatted_address,
      city: components.city,
      state: components.state,
      country: components.country,
      zipCode: components.zipCode,
    }
  }

  async getDistance(origin: LatLng, destination: LatLng): Promise<DistanceResult> {
    const params = new URLSearchParams({
      origins: `${origin.lat},${origin.lng}`,
      destinations: `${destination.lat},${destination.lng}`,
      key: this.apiKey,
    })

    const response = await fetch(`${this.baseUrl}/distancematrix/json?${params}`)
    if (!response.ok) {
      throw new Error(`Distance calculation failed: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.status !== 'OK') {
      throw new Error(`Distance matrix returned status: ${data.status}`)
    }

    const element = data.rows[0]?.elements[0]
    if (!element || element.status !== 'OK') {
      throw new Error('Could not calculate distance between the given points')
    }

    return {
      distanceKm: element.distance.value / 1000,
      durationMinutes: Math.ceil(element.duration.value / 60),
    }
  }

  async getDirections(origin: LatLng, destination: LatLng): Promise<DirectionsResult> {
    const params = new URLSearchParams({
      origin: `${origin.lat},${origin.lng}`,
      destination: `${destination.lat},${destination.lng}`,
      mode: 'driving',
      key: this.apiKey,
    })

    const response = await fetch(`${this.baseUrl}/directions/json?${params}`)
    if (!response.ok) {
      throw new Error(`Directions request failed: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.status !== 'OK' || !data.routes?.length) {
      throw new Error(`Directions returned status: ${data.status}`)
    }

    const route = data.routes[0]
    const leg = route.legs[0]

    return {
      distanceKm: leg.distance.value / 1000,
      durationMinutes: Math.ceil(leg.duration.value / 60),
      steps: leg.steps.map((step: Record<string, unknown>) => ({
        instruction: (step.html_instructions as string).replace(/<[^>]+>/g, ''),
        distance: (step.distance as { value: number }).value / 1000,
        duration: Math.ceil((step.duration as { value: number }).value / 60),
      })),
    }
  }

  private extractAddressComponents(
    components: Array<{
      types: string[]
      long_name: string
      short_name: string
    }>,
  ): { city?: string; state?: string; country?: string; zipCode?: string } {
    const find = (type: string) =>
      components.find((c) => c.types.includes(type))?.long_name

    return {
      city: find('locality') ?? find('sublocality'),
      state: find('administrative_area_level_1'),
      country: find('country'),
      zipCode: find('postal_code'),
    }
  }
}
