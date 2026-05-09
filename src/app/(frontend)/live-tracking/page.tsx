'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

import Grid from '@mui/material/Grid'

import {
  Box,
  Paper,
  Typography,
  Stack,
  Avatar,
  Chip,
  CircularProgress,
  Button,
} from '@mui/material'

import PersonIcon from '@mui/icons-material/Person'
import NearMeIcon from '@mui/icons-material/NearMe'
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi'

const MapComponent = dynamic(() => import('@/payload/admin/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        height: 520,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress />
    </Box>
  ),
})

export default function LiveTrackingPage() {
  const [loading, setLoading] = useState(true)
  const [drivers, setDrivers] = useState<any[]>([])

  const fetchData = async () => {
    try {
      const driversRes = await fetch('/api/drivers?where[location][exists]=true&limit=100')

if (!driversRes.ok) {
  throw new Error('Failed to fetch drivers')
}

      const driversData = await driversRes.json()

      const safeDrivers = Array.isArray(driversData?.docs) ? driversData.docs : []

      setDrivers(safeDrivers)

    } catch (err) {
      console.error('Live tracking error:', err)
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

  

  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
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
      {/* HEADER */}

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
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
              }}
            >
              Real-time driver monitoring
            </Typography>
          </Box>

          <Button
            component={Link}
            href="/admin"
            variant="contained"
            sx={{
              textTransform: 'none',
              borderRadius: '10px',
            }}
          >
            Back to Dashboard
          </Button>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        {/* MAP */}

        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper
            sx={{
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
            }}
          >
            <Box sx={{ height: 520 }}>
              <MapComponent
                center={[13.0827, 80.2707]}
                zoom={11}
                polylines={[]}
                markers={drivers
  .filter((driver) =>
    Array.isArray(driver?.location) &&
    driver.location.length >= 2 &&
    !isNaN(Number(driver.location[0])) &&
    !isNaN(Number(driver.location[1]))
  )
  .map((driver) => ({
    id: driver.id,
    position: [
      Number(driver.location[1]),
      Number(driver.location[0]),
    ],
    popup: `
      <div>
        <b>${driver.name || 'Driver'}</b><br/>
        ${driver.phone || ''}
      </div>
    `,
  }))}
              />
            </Box>
          </Paper>
        </Grid>

        {/* DRIVERS */}

        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            sx={{
              p: 2,
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              height: 520,
              overflowY: 'auto',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                mb: 2,
              }}
            >
              Active Drivers
            </Typography>

            <Stack spacing={2}>
              {drivers.map((driver, i) => (
                <Paper
                  key={driver.id}
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    border: '1px solid #f1f5f9',
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: '#3b82f6',
                      }}
                    >
                      <PersonIcon />
                    </Avatar>

                    <Box sx={{ flexGrow: 1 }}>
                      <Typography sx={{ fontWeight: 800 }}>{driver.name}</Typography>

                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {driver.phone}
                      </Typography>
                    </Box>

                    <Chip
                      icon={<NearMeIcon />}
                      label={driver.status || 'active'}
                     color={driver.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* SUMMARY */}

        <Grid size={{ xs: 12 }}>
          <Paper
            sx={{
              p: 2,
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
            }}
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Stack alignItems="center">
                  <LocalTaxiIcon
                    sx={{
                      fontSize: 40,
                      color: '#3b82f6',
                    }}
                  />

                  <Typography variant="h5" sx={{ fontWeight: 900 }}>
                    {drivers.length}
                  </Typography>

                  <Typography variant="caption">Active Drivers</Typography>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Stack alignItems="center">
                  <NearMeIcon
                    sx={{
                      fontSize: 40,
                      color: '#10b981',
                    }}
                  />

                  <Typography variant="h5" sx={{ fontWeight: 900 }}>
                    LIVE
                  </Typography>

                  <Typography variant="caption">GPS Status</Typography>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Stack alignItems="center">
                  <PersonIcon
                    sx={{
                      fontSize: 40,
                      color: '#f59e0b',
                    }}
                  />

                  <Typography variant="h5" sx={{ fontWeight: 900 }}>
                    Online
                  </Typography>

                  <Typography variant="caption">Driver Status</Typography>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
