export interface LocationPoint {
  id: string
  name: string
  latitude: number
  longitude: number
  type: string
  metadata?: {
    [key: string]: any
  }
}

export interface MapBounds {
  minLat: number
  maxLat: number
  minLng: number
  maxLng: number
}

export interface APIResponse<T> {
  success: boolean
  data: T
  message?: string
}