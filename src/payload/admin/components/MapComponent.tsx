'use client'

import 'leaflet/dist/leaflet.css'
import React from 'react'
import dynamic from 'next/dynamic'
import { Box } from '@mui/material'

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

/* ---------------------------------------
   CLIENT ONLY LEAFLET MAP (NO SSR)
---------------------------------------- */
const LeafletMap = dynamic(
  async () => {
    const {
      MapContainer,
      TileLayer,
      Marker,
      Popup,
      Polyline,
      useMap,
    } = await import('react-leaflet')

    // 🔹 Handles map updates safely
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

    // 🔹 Main internal map component
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
            {/* OpenStreetMap tiles */}
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Auto update map center */}
            <MapViewUpdater center={center} zoom={zoom} />

            {/* ---------------- POLYLINES ---------------- */}
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

            {/* ---------------- MARKERS ---------------- */}
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
        </Box>
      )
    }

    return MapInner
  },
  {
    ssr: false, // 🔥 CRITICAL: prevents window SSR crash
  }
)

/* ---------------------------------------
   MAIN EXPORT
---------------------------------------- */
export default function MapComponent(props: MapComponentProps) {
  return <LeafletMap {...props} />
}

// optional alias (for dashboard usage)
export const LiveTrackingDashboard = MapComponent