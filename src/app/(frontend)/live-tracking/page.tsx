'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import NearMeIcon from '@mui/icons-material/NearMe'

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
} from '@mui/material'

import Grid from '@mui/material/Grid'

import PersonIcon from '@mui/icons-material/Person'
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import SpeedIcon from '@mui/icons-material/Speed'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const MapComponent = dynamic(
  () => import('@/payload/admin/components/MapComponent'),
  {
    ssr: false,
  },
)

export default function LiveTrackingPage() {
  const [loading, setLoading] = useState(true)

  const [drivers, setDrivers] = useState<any[]>([])

  const [activeRoutes, setActiveRoutes] = useState<Record<string, any>>({})

  const fetchData = async () => {
    try {
      setLoading(true)

      // ---------------- DRIVERS ----------------
      const driversRes = await fetch(
        '/api/drivers?where[location][exists]=true&limit=100',
      )

      const driversData = await driversRes.json()

      // ---------------- BOOKINGS ----------------
      const bookingsRes = await fetch(
        '/api/bookings?where[status][in]=confirmed,onride&limit=100',
      )

      const bookingsData = await bookingsRes.json()

      setDrivers(driversData.docs || [])

      // ---------------- ROUTES ----------------
      const routes: Record<string, any> = {}

      for (const driver of driversData.docs || []) {
        try {
          const booking = bookingsData.docs?.find((b: any) => {
            const driverId =
              typeof b.driver === 'object'
                ? b.driver?.id
                : b.driver

            return driverId === driver.id
          })

          if (
            !driver.location ||
            !Array.isArray(driver.location) ||
            driver.location.length < 2
          ) {
            continue
          }

          if (
            !booking?.dropoffLocation ||
            !Array.isArray(booking.dropoffLocation)
          ) {
            continue
          }

          const startLng = driver.location[0]
          const startLat = driver.location[1]

          const endLng = booking.dropoffLocation[0]
          const endLat = booking.dropoffLocation[1]

          const routeURL =
            `https://router.project-osrm.org/route/v1/driving/` +
            `${startLng},${startLat};${endLng},${endLat}` +
            `?overview=full&geometries=geojson`

          const routeRes = await fetch(routeURL)

          const routeData = await routeRes.json()

          if (routeData?.routes?.[0]) {
            routes[driver.id] =
              routeData.routes[0].geometry.coordinates.map(
                (coord: number[]) => [coord[1], coord[0]],
              )
          }
        } catch (err) {
          console.error('Route Error:', err)
        }
      }

      setActiveRoutes(routes)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    const interval = setInterval(() => {
      fetchData()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fafc',
        }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress sx={{ color: '#3b82f6' }} />

          <Typography
            sx={{
              color: '#64748b',
              fontWeight: 700,
            }}
          >
            Loading Live Tracking...
          </Typography>
        </Stack>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
      }}
    >
      {/* ---------------- HEADER ---------------- */}

      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: '18px',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: '14px',
                background:
                  'linear-gradient(135deg,#3b82f6,#2563eb)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              <LocationOnIcon />
            </Box>

            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 900,
                  color: '#0f172a',
                }}
              >
                Live GPS Tracking
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  color: '#64748b',
                  fontWeight: 700,
                }}
              >
                Real-time driver location monitoring system
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1.5}>
            <Chip
              label="LIVE"
              sx={{
                backgroundColor: '#10b981',
                color: '#fff',
                fontWeight: 900,
              }}
            />

            <Button
              component={Link}
              href="/admin"
              startIcon={<ArrowBackIcon />}
              sx={{
                textTransform: 'none',
                fontWeight: 800,
              }}
            >
              Dashboard
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* ---------------- MAIN GRID ---------------- */}

      <Grid container spacing={3}>
        {/* ---------------- MAP ---------------- */}

       <Grid size={{ xs: 12, lg: 8 }}>
          <Paper
            sx={{
              borderRadius: '18px',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
              backgroundColor: '#fff',
            }}
          >
            <Box
              sx={{
                p: 2,
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 900,
                  color: '#0f172a',
                }}
              >
                Live Driver Movement
              </Typography>
            </Box>

            <Box sx={{ height: 620 }}>
              <MapComponent
                center={[13.0827, 80.2707]}
                zoom={12}
                polylines={Object.entries(activeRoutes).map(
                  ([id, positions]) => ({
                    id,
                    positions: positions as [number, number][],
                    color: '#3b82f6',
                    weight: 4,
                  }),
                )}
                markers={drivers
                  .filter(
                    (driver) =>
                      driver.location &&
                      Array.isArray(driver.location) &&
                      driver.location.length >= 2,
                  )
                  .map((driver) => ({
                    id: driver.id,

                    position: [
                      Number(driver.location[1]),
                      Number(driver.location[0]),
                    ],

                    popup: `
                      <div style="min-width:200px">
                        <h3 style="margin:0;font-size:14px">
                          ${driver.name || 'Driver'}
                        </h3>

                        <p style="margin:6px 0">
                          Status:
                          <b style="color:${
                            driver.status === 'available'
                              ? '#10b981'
                              : '#3b82f6'
                          }">
                            ${driver.status || 'active'}
                          </b>
                        </p>

                        <p style="margin:6px 0">
                          Phone:
                          ${driver.phone || 'N/A'}
                        </p>
                      </div>
                    `,
                  }))}
              />
            </Box>
          </Paper>
        </Grid>

        {/* ---------------- DRIVER PANEL ---------------- */}

        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            sx={{
              p: 2,
              borderRadius: '18px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#fff',
              height: 620,
              overflowY: 'auto',
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 900,
                mb: 2,
                color: '#0f172a',
              }}
            >
              Driver Status
            </Typography>

            <Stack spacing={2}>
              {drivers.length > 0 ? (
                drivers.map((driver, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: '14px',
                      border: '1px solid #e2e8f0',
                      transition: '0.2s',
                      '&:hover': {
                        backgroundColor: '#f8fafc',
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                    >
                      <Avatar
                        sx={{
                          background:
                            'linear-gradient(135deg,#3b82f6,#2563eb)',
                          width: 48,
                          height: 48,
                        }}
                      >
                        <PersonIcon />
                      </Avatar>

                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          sx={{
                            fontWeight: 900,
                            color: '#0f172a',
                          }}
                        >
                          {driver.name}
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{
                            color: '#64748b',
                          }}
                        >
                          {driver.phone}
                        </Typography>

                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ mt: 1 }}
                        >
                          <Chip
                            size="small"
                            icon={<CheckCircleIcon />}
                            label={
                              driver.status || 'available'
                            }
                            sx={{
                              fontWeight: 800,
                              backgroundColor:
                                driver.status === 'available'
                                  ? '#dcfce7'
                                  : '#dbeafe',
                              color:
                                driver.status === 'available'
                                  ? '#166534'
                                  : '#1d4ed8',
                            }}
                          />

                          <Chip
                            size="small"
                            icon={<LocalTaxiIcon />}
                            label="Taxi"
                            sx={{
                              fontWeight: 800,
                            }}
                          />
                        </Stack>
                      </Box>
                    </Stack>
                  </Paper>
                ))
              ) : (
                <Box sx={{ py: 10, textAlign: 'center' }}>
                  <Typography
                    sx={{
                      color: '#64748b',
                      fontWeight: 700,
                    }}
                  >
                    No active drivers found
                  </Typography>
                </Box>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* ---------------- SUMMARY ---------------- */}

       <Grid size={{ xs: 12 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: '18px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
            }}
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Stack spacing={1} alignItems="center">
                  <SpeedIcon
                    sx={{
                      fontSize: 36,
                      color: '#3b82f6',
                    }}
                  />

                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 900,
                      color: '#0f172a',
                    }}
                  >
                    {drivers.length}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: '#64748b',
                      fontWeight: 700,
                    }}
                  >
                    Active Drivers
                  </Typography>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Stack spacing={1} alignItems="center">
                  <LocalTaxiIcon
                    sx={{
                      fontSize: 36,
                      color: '#10b981',
                    }}
                  />

                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 900,
                      color: '#0f172a',
                    }}
                  >
                    {Object.keys(activeRoutes).length}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: '#64748b',
                      fontWeight: 700,
                    }}
                  >
                    On Ride
                  </Typography>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Stack spacing={1} alignItems="center">
                  <NearMeIcon
                    sx={{
                      fontSize: 36,
                      color: '#f59e0b',
                    }}
                  />

                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 900,
                      color: '#0f172a',
                    }}
                  >
                    LIVE
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: '#64748b',
                      fontWeight: 700,
                    }}
                  >
                    GPS Status
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}