'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Stack,
  Avatar,
  Chip,
  CircularProgress,
  Divider,
  Button,
  Grid,
} from '@mui/material'
import dynamic from 'next/dynamic'
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import NearMeIcon from '@mui/icons-material/NearMe'
import PersonIcon from '@mui/icons-material/Person'
import Link from 'next/link'

// Map (same as dashboard style)
const MapComponent = dynamic(
  () => import('@/payload/admin/components/MapComponent'),
  { ssr: false }
)

export default function LiveTrackingPage() {
  const [loading, setLoading] = useState(true)
  const [drivers, setDrivers] = useState<any[]>([])
  const [activeRoutes, setActiveRoutes] = useState<Record<string, any>>({})

  // ---------------- FETCH DATA ----------------
  const fetchData = async () => {
    try {
      const driversRes = await fetch('/api/drivers?where[location][exists]=true&limit=100')
      const driversData = await driversRes.json()

      const bookingsRes = await fetch('/api/bookings?where[status][equals]=confirmed&limit=100')
      const bookingsData = await bookingsRes.json()

      setDrivers(driversData.docs || [])

      // build routes
      const routes: Record<string, any> = {}

      for (const driver of driversData.docs || []) {
        const booking = bookingsData.docs?.find((b: any) => {
          const id = typeof b.driver === 'object' ? b.driver?.id : b.driver
          return id === driver.id
        })

        if (
          driver.location &&
          Array.isArray(driver.location) &&
          booking?.dropoffLocation
        ) {
          try {
            const osrm = await fetch(
              `https://router.project-osrm.org/route/v1/driving/${driver.location[0]},${driver.location[1]};${booking.dropoffLocation[0]},${booking.dropoffLocation[1]}?overview=full&geometries=geojson`
            ).then(r => r.json())

            if (osrm?.routes?.[0]) {
              routes[driver.id] = osrm.routes[0].geometry.coordinates.map((c: any) => [
                c[1],
                c[0],
              ])
            }
          } catch {}
        }
      }

      setActiveRoutes(routes)
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: '#3b82f6' }} />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3, backgroundColor: 'var(--theme-bg-page)', minHeight: '100%' }}>

      {/* HEADER (Dashboard style) */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#ffffff',
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#1e293b' }}>
            Live GPS Tracking
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Real-time driver movement monitoring
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Chip label="LIVE" sx={{ backgroundColor: '#10b981', color: '#fff', fontWeight: 800 }} />
          <Button
            component={Link}
            href="/admin"
            size="small"
            sx={{ textTransform: 'none', fontWeight: 800 }}
          >
            Back to Dashboard
          </Button>
        </Stack>
      </Paper>

      <Grid container spacing={3}>

        {/* LEFT: MAP */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            sx={{
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Box sx={{ height: 520 }}>
              <MapComponent
                center={[13.0827, 80.2707]}
                zoom={12}
                polylines={Object.entries(activeRoutes).map(([id, positions]) => ({
                  id,
                  positions: positions as [number, number][],
                  color: '#3b82f6',
                  weight: 3,
                }))}
                markers={drivers
                  .filter(d => d.location && Array.isArray(d.location))
                  .map(d => ({
                    id: d.id,
                    position: [d.location[1], d.location[0]],
                  }))}
              />
            </Box>
          </Paper>
        </Grid>

        {/* RIGHT: DRIVER LIST */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              p: 2,
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              height: 520,
              overflowY: 'auto',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>
              Active Drivers
            </Typography>

            <Stack spacing={2}>
              {drivers.map((driver, i) => (
                <Paper
                  key={i}
                  sx={{
                    p: 1.5,
                    borderRadius: '12px',
                    border: '1px solid #f1f5f9',
                    '&:hover': { backgroundColor: '#f8fafc' },
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: '#3b82f6' }}>
                      <PersonIcon />
                    </Avatar>

                    <Box sx={{ flexGrow: 1 }}>
                      <Typography sx={{ fontWeight: 800 }}>
                        {driver.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {driver.phone}
                      </Typography>
                    </Box>

                    <Chip
                      size="small"
                      label={driver.status || 'active'}
                      sx={{ fontWeight: 800 }}
                    />
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* BOTTOM SUMMARY */}
        <Grid size={{ xs: 12 }}>
          <Paper
            sx={{
              p: 2,
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-around',
              backgroundColor: '#ffffff',
            }}
          >
            <Box textAlign="center">
              <Typography sx={{ fontWeight: 900, color: '#3b82f6' }}>
                {drivers.length}
              </Typography>
              <Typography variant="caption">Active Drivers</Typography>
            </Box>

            <Divider orientation="vertical" flexItem />

            <Box textAlign="center">
              <Typography sx={{ fontWeight: 900, color: '#10b981' }}>
                {Object.keys(activeRoutes).length}
              </Typography>
              <Typography variant="caption">On Trip</Typography>
            </Box>

            <Divider orientation="vertical" flexItem />

            <Box textAlign="center">
              <Typography sx={{ fontWeight: 900, color: '#f59e0b' }}>
                Live
              </Typography>
              <Typography variant="caption">Tracking Status</Typography>
            </Box>
          </Paper>
        </Grid>

      </Grid>
    </Box>
  )
}