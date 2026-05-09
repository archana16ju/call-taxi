'use client'

import React, { useState, useEffect } from 'react'
import { Box, Typography, Paper, CircularProgress } from '@mui/material'
import dynamic from 'next/dynamic'

const MapComponent = dynamic(
  () => import('./MapComponent'),
  { ssr: false }
)

export default function BookingLiveTracking({ path, data }: any) {
  const [driverLoc, setDriverLoc] = useState<[number, number] | null>(null)
  const [loading, setLoading] = useState(true)

  const driverId = typeof data.driver === 'object' ? data.driver?.id : data.driver

  useEffect(() => {
    if (!driverId) {
      setLoading(false)
      return
    }

    const fetchDriver = async () => {
      try {
        const res = await fetch(`/api/drivers/${driverId}`)
        const driver = await res.json()
        if (driver.location && Array.isArray(driver.location)) {
          setDriverLoc([driver.location[1], driver.location[0]])
        }
      } catch (e) {
        console.error('Failed to fetch driver location', e)
      } finally {
        setLoading(false)
      }
    }

    fetchDriver()
    const interval = setInterval(fetchDriver, 10000)
    return () => clearInterval(interval)
  }, [driverId])

  if (!driverId) return null

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="subtitle1" fontWeight={700} color="#0f172a" mb={2}>
        Live Ride Tracking
      </Typography>
      <Paper sx={{ height: 400, borderRadius: 2, overflow: 'hidden', border: '1px solid #e2e8f0', position: 'relative' }}>
        {loading && !driverLoc ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : driverLoc ? (
          <MapComponent
            center={driverLoc}
            zoom={15}
            markers={[
              {
                id: 'driver',
                position: driverLoc,
                popup: <Typography fontWeight={700}>Driver Current Position</Typography>
              }
            ]}
          />
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', bgcolor: '#f8fafc' }}>
            <Typography color="text.secondary">Location data not available for this driver.</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  )
}
