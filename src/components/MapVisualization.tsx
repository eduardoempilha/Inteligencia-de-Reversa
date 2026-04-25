import { useEffect, useRef } from 'react'
import { VisQuill, Attach } from '@visquill/visquill-gdk'
import { LocationPoint } from '../types'
import '../styles/MapVisualization.css'

interface MapVisualizationProps {
  locations: LocationPoint[]
}

const MapVisualization: React.FC<MapVisualizationProps> = ({ locations }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const rvgRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current) return

    try {
      const rvg = VisQuill.create(containerRef.current, 'map-')
      rvgRef.current = rvg
      const canvas = rvg.canvas

      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      canvas.extent = { width, height }

      const bounds = calculateBounds(locations)
      const padding = 50
      const scale = calculateScale(bounds, width, height, padding)
      const offsetX = -bounds.minLng * scale + padding
      const offsetY = -bounds.maxLat * scale + padding

      // Background
      const background = canvas.rectangle(
        'bg',
        { width, height },
        '@style fill: #f0f4f8; stroke: none;'
      )
      background.extent = { x: 0, y: 0, width, height }

      // Grid
      drawGrid(canvas, width, height)

      // Renderiza pontos
      locations.forEach((location) => {
        const x = location.longitude * scale + offsetX
        const y = -location.latitude * scale + offsetY

        const handle = canvas.handles.disk(
          `point-${location.id}`,
          { x, y },
          '@style fill: #0066cc; stroke: white; stroke-width: 2; opacity: 0.8;'
        )
        handle.r = 6

        const label = canvas.text.label(
          `${location.name}`,
          `label-${location.id}`,
          '@style fill: #333; font-size: 12px; font-weight: bold; text-anchor: middle;'
        )

        Attach.pointToPoint(label, handle, { offset: [0, -25] })

        handle.addEventListener('mouseenter', () => {
          handle.style = '@style fill: #ff6b35; stroke: white; stroke-width: 2; opacity: 1;'
          label.style = '@style fill: #ff6b35; font-size: 13px; font-weight: bold;'
        })

        handle.addEventListener('mouseleave', () => {
          handle.style = '@style fill: #0066cc; stroke: white; stroke-width: 2; opacity: 0.8;'
          label.style = '@style fill: #333; font-size: 12px; font-weight: bold;'
        })

        handle.addEventListener('click', () => {
          showLocationInfo(canvas, location, x, y)
        })
      })

      const title = canvas.text.label(
        `📍 ${locations.length} Ponto(s) Mapeado(s)`,
        'title',
        '@style fill: #1a1a2e; font-size: 18px; font-weight: bold; text-anchor: middle;'
      )
      Attach.pointToPoint(title, { x: width / 2, y: 20 })

      const handleResize = () => {
        if (containerRef.current) {
          const newWidth = containerRef.current.clientWidth
          const newHeight = containerRef.current.clientHeight
          canvas.extent = { width: newWidth, height: newHeight }
        }
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    } catch (err) {
      console.error('Erro ao inicializar VisQuill:', err)
    }
  }, [locations])

  useEffect(() => {
    return () => {
      if (rvgRef.current) {
        try {
          rvgRef.current.dispose()
        } catch (err) {
          console.warn('Erro ao limpar VisQuill:', err)
        }
      }
    }
  }, [])

  return <div ref={containerRef} className="map-visualization" />
}

function calculateBounds(locations: LocationPoint[]) {
  if (locations.length === 0) {
    return { minLat: -23.5505, maxLat: -23.5505, minLng: -46.6333, maxLng: -46.6333 }
  }

  return {
    minLat: Math.min(...locations.map(l => l.latitude)),
    maxLat: Math.max(...locations.map(l => l.latitude)),
    minLng: Math.min(...locations.map(l => l.longitude)),
    maxLng: Math.max(...locations.map(l => l.longitude)),
  }
}

function calculateScale(bounds: any, width: number, height: number, padding: number) {
  const latRange = bounds.maxLat - bounds.minLat || 0.01
  const lngRange = bounds.maxLng - bounds.minLng || 0.01

  const scaleX = (width - padding * 2) / lngRange
  const scaleY = (height - padding * 2) / latRange

  return Math.min(scaleX, scaleY, 10000)
}

function drawGrid(canvas: any, width: number, height: number) {
  for (let x = 0; x < width; x += 50) {
    canvas.line(`grid-v-${x}`, [[x, 0], [x, height]], '@style stroke: #ddd; stroke-width: 1;')
  }

  for (let y = 0; y < height; y += 50) {
    canvas.line(`grid-h-${y}`, [[0, y], [width, y]], '@style stroke: #ddd; stroke-width: 1;')
  }
}

function showLocationInfo(canvas: any, location: LocationPoint, x: number, y: number) {
  const boxWidth = 200
  const boxHeight = 100
  const boxX = Math.min(x, canvas.extent.width - boxWidth - 10)
  const boxY = Math.max(y - boxHeight - 10, 10)

  const infoBox = canvas.rectangle(
    `info-${location.id}`,
    { width: boxWidth, height: boxHeight },
    '@style fill: white; stroke: #0066cc; stroke-width: 2; opacity: 0.95;'
  )
  infoBox.extent = { x: boxX, y: boxY, width: boxWidth, height: boxHeight }

  const infoText = canvas.text.label(
    `📍 ${location.name}\n📊 ${location.type}\n📍 ${location.latitude.toFixed(4)}\n📍 ${location.longitude.toFixed(4)}`,
    `info-text-${location.id}`,
    '@style fill: #1a1a2e; font-size: 11px;'
  )
  infoText.extent = { x: boxX + 10, y: boxY + 10 }
}

export default MapVisualization