import type { MapProvider } from './types'
import { GoogleMapsProvider } from './google-maps'

let providerInstance: MapProvider | null = null

export function getMapProvider(): MapProvider {
  if (providerInstance) {
    return providerInstance
  }

  const providerType = process.env.MAP_PROVIDER ?? 'google'

  switch (providerType) {
    case 'google': {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY
      if (!apiKey) {
        throw new Error('Google Maps API key must be configured')
      }
      providerInstance = new GoogleMapsProvider(apiKey)
      break
    }
    default:
      throw new Error(`Unknown map provider: ${providerType}`)
  }

  return providerInstance
}

export function resetMapProvider(): void {
  providerInstance = null
}

export type {
  MapProvider,
  LatLng,
  GeocodeResult,
  ReverseGeocodeResult,
  DistanceResult,
  DirectionsResult,
  DirectionStep,
} from './types'
