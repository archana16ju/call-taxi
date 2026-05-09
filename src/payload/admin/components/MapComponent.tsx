'use client'

import 'leaflet/dist/leaflet.css'
import React from 'react'
import dynamic from 'next/dynamic'
import { Box } from '@mui/material'
import L from 'leaflet'

/* ---------------------------------------
   FIX LEAFLET DEFAULT ICONS (CRITICAL)
---------------------------------------- */
delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

/* ---------------------------------------
   TYPES
---------------------------------------- */
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

/* ---------------------------------------
   LEAFLET INNER MAP (CLIENT ONLY)
---------------------------------------- */
function MapInner(props: MapComponentProps) {
  const {
    center,
    zoom,
    markers = [],
    polylines = [],
    height = '100%',
    showZoomControl = false,
    className = '',
    darkMode = true,
  } = props

  const {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    useMap,
  } = require('react-leaflet')

  function MapViewUpdater({
    center,
    zoom,
  }: {
    center: [number, number]
    zoom: number
  }) {
    const map = useMap()

    React.useEffect(() => {
      map.setView(center, zoom)
    }, [center, zoom, map])

    return null
  }

  return (
    <Box
      sx={{
        height,
        width: '100%',
        position: 'relative',
        overflow: 'hidden',

        '.leaflet-container': {
          height: '100%',
          width: '100%',
          background: darkMode ? '#0f172a' : '#ffffff',
        },

        '.leaflet-tile-container': darkMode
          ? {
              filter:
                'invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)',
            }
          : {},
      }}
      className={className}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={showZoomControl}
      >
        {/* OpenStreetMap */}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Auto update map center */}
        <MapViewUpdater center={center} zoom={zoom} />

        {/* POLYLINES */}
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

        {/* MARKERS */}
        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.position} icon={marker.icon}>
            {marker.popup && <Popup>{marker.popup}</Popup>}
          </Marker>
        ))}
      </MapContainer>
    </Box>
  )
}

/* ---------------------------------------
   MAIN EXPORT (SAFE WRAPPER)
---------------------------------------- */
export default function MapComponent(props: MapComponentProps) {
  return <MapInner {...props} />
}