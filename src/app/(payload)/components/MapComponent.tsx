'use client'

import React from 'react'
import 'leaflet/dist/leaflet.css'
import dynamic from 'next/dynamic'
import { Box, Typography, Paper, Stack, Avatar, IconButton, Button, CircularProgress, Divider } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PersonIcon from '@mui/icons-material/Person'
import TripOriginIcon from '@mui/icons-material/TripOrigin'
import NavigationIcon from '@mui/icons-material/Navigation'
import Link from 'next/link'

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false })
const Polyline = dynamic(() => import('react-leaflet').then(m => m.Polyline), { ssr: false })

// --- TYPES ---

export interface MapMarker {
  id: string | number
  position: [number, number] // [lat, lng]
  icon?: any
  popup?: React.ReactNode
}

export interface MapPolyline {
  id: string | number
  positions: [number, number][] // [[lat, lng], ...]
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

// --- SUB-COMPONENTS ---

/**
 * Handles map view updates when center or zoom props change
 */
const MapViewUpdater = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  // We use require here to avoid SSR issues with the hook
  const { useMap } = require('react-leaflet')
  const map = useMap()
  React.useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  return null
}

// --- MAIN REUSABLE COMPONENT ---

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
    <Box sx={{ 
      height, 
      width: '100%', 
      position: 'relative', 
      overflow: 'hidden',
      '.leaflet-container': {
        height: '100% !important',
        width: '100% !important',
        background: darkMode ? '#0f172a !important' : '#fff !important',
      },
      '.leaflet-tile-container': darkMode ? {
        filter: 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)',
      } : {}
    }} className={className}>
      {typeof window !== 'undefined' && (
        <MapContainer 
          center={center} 
          zoom={zoom} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={showZoomControl}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapViewUpdater center={center} zoom={zoom} />
          
          {/* Render Polylines */}
          {polylines.map((poly) => (
            <Polyline 
              key={`poly-${poly.id}`}
              positions={poly.positions} 
              pathOptions={{ 
                color: poly.color || '#3b82f6', 
                weight: poly.weight || 3, 
                opacity: poly.opacity || 0.8,
                lineCap: 'round',
                dashArray: poly.dashArray
              }} 
            />
          ))}

          {/* Render Markers */}
          {markers.map((marker) => (
            <Marker 
              key={`marker-${marker.id}`} 
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

// --- CONSOLIDATED FULL DASHBOARD COMPONENT ---

export function LiveTrackingDashboard() {
  const [driverLocations, setDriverLocations] = React.useState<any[]>([])
  const [activeBookings, setActiveBookings] = React.useState<any[]>([])
  const [activeRoutes, setActiveRoutes] = React.useState<Record<string, any>>({})
  const [loading, setLoading] = React.useState(true)

  const fetchLocations = React.useCallback(async () => {
    try {
      const [driversRes, bookingsRes] = await Promise.all([
        fetch('/api/drivers?where[location][exists]=true&limit=100').then(res => {
          if (!res.ok) throw new Error('Failed to fetch drivers')
          return res.json()
        }),
        fetch('/api/bookings?where[status][equals]=confirmed&limit=100').then(res => {
          if (!res.ok) throw new Error('Failed to fetch bookings')
          return res.json()
        })
      ])
      
      setDriverLocations(driversRes.docs)
      setActiveBookings(bookingsRes.docs)
      
      const routePromises = driversRes.docs.map(async (driver: any) => {
        if (driver.status === 'driving' && driver.location && Array.isArray(driver.location)) {
          const booking = bookingsRes.docs.find((b: any) => {
            const bDriverId = typeof b.driver === 'object' ? b.driver?.id : b.driver;
            return bDriverId === driver.id;
          });

          if (booking && booking.dropoffLocation && Array.isArray(booking.dropoffLocation)) {
            try {
              const osrm = `https://router.project-osrm.org/route/v1/driving/${driver.location[0]},${driver.location[1]};${booking.dropoffLocation[0]},${booking.dropoffLocation[1]}?overview=full&geometries=geojson`
              const routeRes = await fetch(osrm).then(res => {
                if (!res.ok) return null
                return res.json()
              })
              if (routeRes && routeRes.routes && routeRes.routes[0]) {
                return { id: driver.id, coords: routeRes.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]]) }
              }
            } catch (e) {
              console.warn(`Error fetching route for driver ${driver.id}:`, e)
            }
          }
        }
        return { id: driver.id, coords: null }
      })

      const results = await Promise.all(routePromises)
      setActiveRoutes(prev => {
        const next = { ...prev }
        results.forEach(res => {
          if (res.coords) {
            next[res.id] = res.coords
          } else {
            delete next[res.id]
          }
        })
        return next
      })

      setLoading(false)
    } catch (e) {
      console.error('Error fetching tracking data:', e)
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchLocations()
    const interval = setInterval(fetchLocations, 5000)
    return () => clearInterval(interval)
  }, [fetchLocations])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a' }}>
        <CircularProgress sx={{ color: '#fbbf24' }} />
      </Box>
    )
  }

  // --- ICONS ---
  let L: any;
  if (typeof window !== 'undefined') {
    L = require('leaflet');
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0f172a', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #fbbf24; border-radius: 10px; }
      `}</style>

      {/* Top Header */}
      <Paper sx={{ p: 2, borderRadius: 0, backgroundColor: 'rgba(30, 41, 59, 0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', zIndex: 1100, backgroundImage: 'none' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton component={Link} href="/admin" sx={{ color: '#fff' }}><ArrowBackIcon /></IconButton>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#fbbf24', lineHeight: 1.2 }}>GPS COMMAND CENTER</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Real-Time Fleet Surveillance</Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={3} alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 10px #10b981' }} />
              <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700 }}>System Live</Typography>
            </Stack>
            <Box sx={{ backgroundColor: '#fbbf24', color: '#000', px: 2, py: 0.5, borderRadius: '20px', fontWeight: 900, fontSize: '0.75rem' }}>
              ACTIVE DRIVERS: {driverLocations.length}
            </Box>
          </Stack>
        </Stack>
      </Paper>

      {/* DISCONNECTION ALERT */}
      {driverLocations.some(d => d.connectionStatus === 'offline') && (
        <Box sx={{ position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 2000, width: '80%', maxWidth: 600 }}>
          {driverLocations.filter(d => d.connectionStatus === 'offline').slice(0, 1).map((d, i) => (
            <Paper key={i} sx={{ p: 2, bgcolor: '#fee2e2', border: '1px solid #ef4444', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ef4444', animation: 'pulse 1.5s infinite' }} />
              <Typography variant="body2" fontWeight={700} color="#991b1b">
                Driver {d.name} lost connection. Tracking paused. Data will sync when connection resumes.
              </Typography>
            </Paper>
          ))}
        </Box>
      )}

      <Box sx={{ flexGrow: 1, display: 'flex', position: 'relative' }}>
        {/* Activity Panel */}
        <Paper sx={{ width: 340, height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.95)', borderRight: '1px solid rgba(255, 255, 255, 0.1)', zIndex: 1000, backgroundImage: 'none', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 800, letterSpacing: '0.05em' }}>DRIVER ACTIVITY</Typography>
          </Box>
          <Box className="custom-scrollbar" sx={{ flexGrow: 1, overflowY: 'auto', p: 1.5 }}>
            <Stack spacing={1.5}>
              {driverLocations.map((driver, i) => {
                const activeTrip = activeBookings.find(b => {
                  const bDriverId = typeof b.driver === 'object' ? b.driver?.id : b.driver;
                  return bDriverId === driver.id;
                });
                return (
                  <Paper key={i} sx={{ p: 1.5, backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', '&:hover': { backgroundColor: 'rgba(30, 41, 59, 0.8)' } }}>
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                      <Avatar sx={{ width: 40, height: 40, border: '2px solid #fbbf24' }}><PersonIcon /></Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" sx={{ color: '#fff', fontWeight: 700 }}>{driver.name}</Typography>
                          <Typography variant="caption" sx={{ px: 1, py: 0.2, borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800, backgroundColor: driver.status === 'driving' ? '#3b82f633' : '#10b98133', color: driver.status === 'driving' ? '#3b82f6' : '#10b981', textTransform: 'uppercase' }}>
                            {driver.status === 'driving' ? 'Riding' : 'Available'}
                          </Typography>
                        </Stack>
                        {activeTrip && (
                          <Box sx={{ mt: 1, p: 1, borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                            <Stack spacing={0.5}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <TripOriginIcon sx={{ fontSize: '0.75rem', color: '#fbbf24' }} /><Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{activeTrip.pickupLocationName}</Typography>
                              </Stack>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <NavigationIcon sx={{ fontSize: '11px', color: '#3b82f6', transform: 'rotate(45deg)' }} /><Typography variant="caption" sx={{ color: '#fff', fontWeight: 700 }}>{activeTrip.dropoffLocationName}</Typography>
                              </Stack>
                            </Stack>
                          </Box>
                        )}
                      </Box>
                    </Stack>
                  </Paper>
                )
              })}
            </Stack>
          </Box>
        </Paper>

        {/* Reusable MapComponent integrated into the Dashboard */}
        <Box sx={{ flexGrow: 1, position: 'relative', zIndex: 0 }}>
          <MapComponent 
            center={[13.0827, 80.2707]}
            zoom={12}
            polylines={Object.entries(activeRoutes).flatMap(([driverId, positions]) => ([
              { id: `glow-${driverId}`, positions: positions as [number, number][], color: '#3b82f6', weight: 8, opacity: 0.2 },
              { id: `line-${driverId}`, positions: positions as [number, number][], color: '#3b82f6', weight: 3, opacity: 0.8, dashArray: '1, 10' }
            ]))}
            markers={driverLocations
              .filter(loc => loc.location && Array.isArray(loc.location) && loc.location.length >= 2)
              .map((loc) => {
                const activeTrip = activeBookings.find(b => {
                  const bDriverId = typeof b.driver === 'object' ? b.driver?.id : b.driver;
                  return bDriverId === loc.id;
                });
                const isDriving = loc.status === 'driving';
                const isOffline = loc.connectionStatus === 'offline';
                const statusColor = isOffline ? '#ef4444' : (isDriving ? '#3b82f6' : '#10b981');
                
                const iconHtml = `
                  <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
                    <div style="background: #1e293b; color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; border: 1px solid ${statusColor}; margin-bottom: 4px; white-space: nowrap; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">${loc.name}</div>
                    <div style="width: 44px; height: 44px; background: #1e293b; border-radius: 10px; display: flex; align-items: center; justify-content: center; border: 3px solid ${statusColor}; box-shadow: 0 10px 20px rgba(0,0,0,0.3); position: relative;">
                      <img src="${isDriving ? 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png' : 'https://cdn-icons-png.flaticon.com/512/1048/1048313.png'}" style="width: 28px; height: 28px; ${isOffline ? 'filter: grayscale(100%); opacity: 0.5;' : ''}" />
                      ${isOffline ? '<div style="position: absolute; top: -5px; right: -5px; width: 12px; height: 12px; background: #ef4444; border: 2px solid #1e293b; border-radius: 50%;"></div>' : ''}
                    </div>
                    <div style="margin-top: 4px; background: ${statusColor}; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 8px; font-weight: 900; text-transform: uppercase;">
                      ${isOffline ? 'Offline' : (isDriving ? 'In Trip' : 'Free')}
                    </div>
                  </div>
                `;
                const currentIcon = new L.DivIcon({ className: 'custom-taxi-icon', html: iconHtml, iconSize: [70, 90], iconAnchor: [35, 90], popupAnchor: [0, -90] });
                return {
                  id: loc.id, position: [loc.location[1], loc.location[0]], icon: currentIcon,
                  popup: (
                    <Box sx={{ p: 1, minWidth: 200 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>{loc.name}</Typography>
                      <Divider sx={{ my: 1 }} />
                      {activeTrip ? (
                        <Box>
                          <Typography variant="caption" sx={{ color: '#3b82f6', fontWeight: 800, display: 'block', mb: 0.5 }}>ACTIVE MISSION</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Dest: {activeTrip.dropoffLocationName}</Typography>
                          <Typography variant="caption" sx={{ display: 'block', color: '#64748b' }}>From: {activeTrip.pickupLocationName}</Typography>
                        </Box>
                      ) : <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 700 }}>Ready for new trip</Typography>}
                      <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid #e2e8f0' }}>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>Last Link: {new Date(loc.lastUpdated).toLocaleTimeString()}</Typography>
                      </Box>
                    </Box>
                  )
                }
              })}
          />
        </Box>
      </Box>
    </Box>
  )
}
