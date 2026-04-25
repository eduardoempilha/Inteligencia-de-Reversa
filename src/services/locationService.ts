import { LocationPoint, APIResponse } from '../types'

export function generateSampleLocations(): LocationPoint[] {
  return [
    {
      id: '1',
      name: 'Empilha Log - Sede',
      latitude: -23.5505,
      longitude: -46.6333,
      type: 'deposito',
    },
    {
      id: '2',
      name: 'Cliente São Paulo',
      latitude: -23.5505,
      longitude: -46.6400,
      type: 'cliente',
    },
    {
      id: '3',
      name: 'Ponto de Coleta 01',
      latitude: -23.5450,
      longitude: -46.6280,
      type: 'ponto',
    },
    {
      id: '4',
      name: 'Ponto de Coleta 02',
      latitude: -23.5550,
      longitude: -46.6450,
      type: 'ponto',
    },
    {
      id: '5',
      name: 'Rota de Entrega 01',
      latitude: -23.5400,
      longitude: -46.6500,
      type: 'rota',
    },
    {
      id: '6',
      name: 'Cliente Guarulhos',
      latitude: -23.4700,
      longitude: -46.5100,
      type: 'cliente',
    },
    {
      id: '7',
      name: 'Centro de Distribuição',
      latitude: -23.5600,
      longitude: -46.6600,
      type: 'deposito',
    },
    {
      id: '8',
      name: 'Ponto Estratégico',
      latitude: -23.5480,
      longitude: -46.6380,
      type: 'ponto',
    },
  ]
}

export async function loadLocationsFromAPI(baseURL: string): Promise<LocationPoint[]> {
  try {
    const response = await fetch(`${baseURL}/api/locations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data: APIResponse<LocationPoint[]> = await response.json()

    if (!data.success) {
      throw new Error(data.message || 'Failed to load locations')
    }

    return data.data
  } catch (error) {
    console.error('Error loading locations from API:', error)
    throw error
  }
}

export async function saveLocation(baseURL: string, location: Omit<LocationPoint, 'id'>): Promise<LocationPoint> {
  const response = await fetch(`${baseURL}/api/locations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(location),
  })

  const data: APIResponse<LocationPoint> = await response.json()
  return data.data
}