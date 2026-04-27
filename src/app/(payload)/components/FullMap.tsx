'use client'

import React from 'react'
import { Box, Typography, Paper, Stack, Avatar, IconButton, Button, CircularProgress, Divider } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PersonIcon from '@mui/icons-material/Person'
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import TripOriginIcon from '@mui/icons-material/TripOrigin'
import NavigationIcon from '@mui/icons-material/Navigation'
import Link from 'next/link'
import 'leaflet/dist/leaflet.css'
import dynamic from 'next/dynamic'

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false })
const Polyline = dynamic(() => import('react-leaflet').then(m => m.Polyline), { ssr: false })

let L: any;
if (typeof window !== 'undefined') {
  L = require('leaflet');
}

const taxiIcon = typeof window !== 'undefined' ? new L.DivIcon({
  className: 'custom-taxi-icon',
  html: `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      <div style="
        background: #1e293b; 
        color: #fff; 
        padding: 4px 8px; 
        border-radius: 4px; 
        font-size: 10px; 
        font-weight: 700; 
        border: 1px solid #3b82f6;
        margin-bottom: 4px;
        white-space: nowrap;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      ">
        <span id="driver-label">Driver</span>
      </div>
      <div style="
        width: 40px; 
        height: 40px; 
        background: #1e293b; 
        border-radius: 8px; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        border: 2px solid #3b82f6;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
      ">
        <img src="https://cdn-icons-png.flaticon.com/512/3448/3448339.png" style="width: 24px; height: 24px;" />
      </div>
      <div style="
        margin-top: 4px; 
        background: #fff; 
        color: #1e293b; 
        padding: 2px 6px; 
        border-radius: 4px; 
        font-size: 8px; 
        font-weight: 800;
        text-transform: uppercase;
      ">
        On Route
      </div>
    </div>
  `,
  iconSize: [60, 80],
  iconAnchor: [30, 80],
  popupAnchor: [0, -80],
}) : null;

export default function FullMap() {
  const [driverLocations, setDriverLocations] = React.useState<any[]>([])
  const [activeBookings, setActiveBookings] = React.useState<any[]>([])
  const [activeRoutes, setActiveRoutes] = React.useState<Record<string, any>>({})
  const [loading, setLoading] = React.useState(true)

  const fetchLocations = React.useCallback(async () => {
    try {
      // Fetch drivers and active bookings to link trip data
      const [driversRes, bookingsRes] = await Promise.all([
        fetch('/api/drivers?where[location][exists]=true&limit=100').then(res => res.json()),
        fetch('/api/bookings?where[status][equals]=confirmed&limit=100').then(res => res.json())
      ])
      
      setDriverLocations(driversRes.docs)
      setActiveBookings(bookingsRes.docs)
      
      // Update routes for driving drivers
      driversRes.docs.forEach(async (driver: any) => {
        if (driver.status === 'driving' && driver.location) {
          const booking = bookingsRes.docs.find((b: any) => {
            const bDriverId = typeof b.driver === 'object' ? b.driver?.id : b.driver;
            return bDriverId === driver.id;
          });

          if (booking && booking.dropoffLocation) {
            try {
              const osrm = `https://router.project-osrm.org/route/v1/driving/${driver.location[0]},${driver.location[1]};${booking.dropoffLocation[0]},${booking.dropoffLocation[1]}?overview=full&geometries=geojson`
              const routeRes = await fetch(osrm).then(res => res.json())
              if (routeRes.routes && routeRes.routes[0]) {
                setActiveRoutes(prev => ({
                  ...prev,
                  [driver.id]: routeRes.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]])
                }))
              }
            } catch (e) {
              console.error(`Error fetching route for driver ${driver.id}`, e)
            }
          }
        } else {
          // Clear route if not driving
          setActiveRoutes(prev => {
            if (prev[driver.id]) {
              const next = { ...prev }
              delete next[driver.id]
              return next
            }
            return prev
          })
        }
      })

      setLoading(false)
    } catch (e) {
      console.error('Error fetching tracking data', e)
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--theme-bg-page)' }}>
        <CircularProgress sx={{ color: '#fbbf24' }} />
      </Box>
    )
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0f172a', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        .leaflet-tile-container {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
        .leaflet-container {
          background: #0f172a !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #fbbf24;
          border-radius: 10px;
        }
      `}</style>

      {/* Top Header */}
      <Paper sx={{ 
        p: 2, 
        borderRadius: 0, 
        backgroundColor: 'rgba(30, 41, 59, 0.9)', 
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)', 
        zIndex: 1100,
        backgroundImage: 'none'
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton component={Link} href="/admin" sx={{ color: '#fff' }}>
              <ArrowBackIcon />
            </IconButton>
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

      <Box sx={{ flexGrow: 1, display: 'flex', position: 'relative' }}>
        {/* Left Side Activity Panel */}
        <Paper sx={{ 
          width: 340, 
          height: '100%', 
          backgroundColor: 'rgba(15, 23, 42, 0.95)', 
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 1000,
          backgroundImage: 'none',
          display: 'flex',
          flexDirection: 'column'
        }}>
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
                  <Paper key={i} sx={{ 
                    p: 1.5, 
                    backgroundColor: 'rgba(30, 41, 59, 0.5)', 
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    '&:hover': { backgroundColor: 'rgba(30, 41, 59, 0.8)' }
                  }}>
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                      <Avatar sx={{ width: 40, height: 40, border: '2px solid #fbbf24' }}>
                        <PersonIcon />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" sx={{ color: '#fff', fontWeight: 700 }}>{driver.name}</Typography>
                          <Typography variant="caption" sx={{ 
                            px: 1, 
                            py: 0.2, 
                            borderRadius: '4px', 
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            backgroundColor: driver.status === 'driving' ? '#3b82f633' : '#10b98133',
                            color: driver.status === 'driving' ? '#3b82f6' : '#10b981',
                            textTransform: 'uppercase'
                          }}>
                            {driver.status === 'driving' ? 'Riding' : 'Available'}
                          </Typography>
                        </Stack>
                        
                        {activeTrip ? (
                          <Box sx={{ mt: 1, p: 1, borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                            <Stack spacing={0.5}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <TripOriginIcon sx={{ fontSize: '0.75rem', color: '#fbbf24' }} />
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{activeTrip.pickupLocationName}</Typography>
                              </Stack>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <NavigationIcon sx={{ fontSize: '0.75rem', color: '#3b82f6' }} />
                                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 700 }}>{activeTrip.dropoffLocationName}</Typography>
                              </Stack>
                            </Stack>
                          </Box>
                        ) : (
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', mt: 0.5, display: 'block' }}>
                            Waiting for next assignment...
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </Paper>
                );
              })}
            </Stack>
          </Box>
        </Paper>

        {/* Map Container */}
        <Box sx={{ flexGrow: 1, position: 'relative', zIndex: 0 }}>
          {typeof window !== 'undefined' && (
            <MapContainer 
              center={[13.0827, 80.2707]} 
              zoom={12} 
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              
              {/* Render Active Routes */}
              {Object.entries(activeRoutes).map(([driverId, positions]: [string, any]) => (
                <React.Fragment key={`route-${driverId}`}>
                  {/* Outer glow line */}
                  <Polyline 
                    positions={positions} 
                    pathOptions={{ 
                      color: '#3b82f6', 
                      weight: 8, 
                      opacity: 0.2,
                      lineCap: 'round'
                    }} 
                  />
                  {/* Inner solid line */}
                  <Polyline 
                    positions={positions} 
                    pathOptions={{ 
                      color: '#3b82f6', 
                      weight: 3, 
                      opacity: 0.8,
                      lineCap: 'round',
                      dashArray: '1, 10'
                    }} 
                  />
                </React.Fragment>
              ))}

              {driverLocations.map((loc, i) => {
                if (!loc.location) return null;
                
                const activeTrip = activeBookings.find(b => {
                  const bDriverId = typeof b.driver === 'object' ? b.driver?.id : b.driver;
                  return bDriverId === loc.id;
                });

                const isDriving = loc.status === 'driving';

                const iconHtml = `
                  <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
                    <div style="background: #1e293b; color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; border: 1px solid ${isDriving ? '#3b82f6' : '#10b981'}; margin-bottom: 4px; white-space: nowrap; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
                      ${loc.name}
                    </div>
                    <div style="width: 44px; height: 44px; background: #1e293b; border-radius: 10px; display: flex; align-items: center; justify-content: center; border: 3px solid ${isDriving ? '#3b82f6' : '#10b981'}; box-shadow: 0 10px 20px rgba(0,0,0,0.3);">
                      <img src="${isDriving ? 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png' : 'https://cdn-icons-png.flaticon.com/512/1048/1048313.png'}" style="width: 28px; height: 28px;" />
                    </div>
                    <div style="margin-top: 4px; background: ${isDriving ? '#3b82f6' : '#10b981'}; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 8px; font-weight: 900; text-transform: uppercase;">
                      ${isDriving ? 'In Trip' : 'Free'}
                    </div>
                  </div>
                `;
                
                const currentIcon = new L.DivIcon({
                  className: 'custom-taxi-icon',
                  html: iconHtml,
                  iconSize: [70, 90],
                  iconAnchor: [35, 90],
                  popupAnchor: [0, -90]
                });

                return (
                  <Marker 
                    key={i} 
                    position={[loc.location[1], loc.location[0]]} 
                    icon={currentIcon}
                  >
                    <Popup>
                      <Box sx={{ p: 1, minWidth: 200 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>{loc.name}</Typography>
                        <Divider sx={{ my: 1 }} />
                        {activeTrip ? (
                          <Box>
                            <Typography variant="caption" sx={{ color: '#3b82f6', fontWeight: 800, display: 'block', mb: 0.5 }}>ACTIVE MISSION</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Dest: {activeTrip.dropoffLocationName}</Typography>
                            <Typography variant="caption" sx={{ display: 'block', color: '#64748b' }}>From: {activeTrip.pickupLocationName}</Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 700 }}>Ready for new trip</Typography>
                        )}
                        <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid #e2e8f0' }}>
                          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                            Last Link: {new Date(loc.lastUpdated).toLocaleTimeString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          )}
        </Box>
      </Box>
    </Box>
  )
}
