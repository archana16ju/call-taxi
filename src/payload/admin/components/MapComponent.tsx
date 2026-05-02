'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { Box } from '@mui/material'
import 'leaflet/dist/leaflet.css'

// ---------- Leaflet dynamic imports (SSR SAFE) ----------
const MapContainer = dynamic(
  () => import('react-leaflet').then(m => m.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import('react-leaflet').then(m => m.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import('react-leaflet').then(m => m.Marker),
  { ssr: false }
)

const Popup = dynamic(
  () => import('react-leaflet').then(m => m.Popup),
  { ssr: false }
)

const Polyline = dynamic(
  () => import('react-leaflet').then(m => m.Polyline),
  { ssr: false }
)

// ---------- TYPES ----------
export interface MapMarker {
  id: string | number
  position: [number, number]
  icon?: any
  popup?: React.ReactNode
}

export interface MapPolyline {
  id: string | number
  positions: [number, number][]
  color?: string
  weight?: number
  opacity?: number
  dashArray?: string
}

interface MapComponentProps {
  center: [number, number]
  zoom: number
  markers?: MapMarker[]
  polylines?: MapPolyline[]
  height?: string | number
  showZoomControl?: boolean
  className?: string
  darkMode?: boolean
}

// ---------- MAP VIEW UPDATER ----------
const MapViewUpdater = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const { useMap } = require('react-leaflet')
  const map = useMap()

  React.useEffect(() => {
    if (map) map.setView(center, zoom)
  }, [center, zoom, map])

  return null
}

// ---------- MAIN COMPONENT ----------
export default function MapComponent({
  center,
  zoom,
  markers = [],
  polylines = [],
  height = '100%',
  showZoomControl = false,
  className = '',
  darkMode = true
}: MapComponentProps) {

  return (
    <Box
      sx={{
        height,
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        '.leaflet-container': {
          height: '100% !important',
          width: '100% !important',
          background: darkMode ? '#0f172a !important' : '#fff !important',
        },
        '.leaflet-tile-container': darkMode
          ? {
              filter: 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)',
            }
          : {},
      }}
      className={className}
    >
      {typeof window !== 'undefined' && (
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={showZoomControl}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <MapViewUpdater center={center} zoom={zoom} />

          {/* ---------- POLYLINES ---------- */}
          {polylines.map((poly) => (
            <Polyline
              key={poly.id}
              positions={poly.positions}
              pathOptions={{
                color: poly.color || '#3b82f6',
                weight: poly.weight || 3,
                opacity: poly.opacity || 0.8,
                dashArray: poly.dashArray,
              }}
            />
          ))}

          {/* ---------- MARKERS ---------- */}
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              icon={marker.icon}
            >
              {marker.popup && <Popup>{marker.popup}</Popup>}
            </Marker>
          ))}
        </MapContainer>
      )}
    </Box>
  )
}


export const LiveTrackingDashboard = MapComponent