'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Box,
  Typography,
  Paper,
  Stack,
  Avatar,
  Chip,
  Divider,
  Container,
  CircularProgress,
} from '@mui/material'
import MapComponent from '../../(payload)/CustomNav.tsx/MapComponent'
import PersonIcon from '@mui/icons-material/Person'
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import NearMeIcon from '@mui/icons-material/NearMe'

function TrackingContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setError('Invalid sharing link.')
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const shareRes = await fetch(`/api/trip-sharing?where[shareToken][equals]=${token}&limit=1`)
        const shareData = await shareRes.json()

        if (!shareData.docs || shareData.docs.length === 0) {
          setError('This sharing link has expired or is invalid.')
          setLoading(false)
          return
        }

        const shareDoc = shareData.docs[0]
        if (!shareDoc.active) {
          setError('This trip has already ended.')
          setLoading(false)
          return
        }

        const bookingId = typeof shareDoc.booking === 'object' ? shareDoc.booking.id : shareDoc.booking
        const bookingRes = await fetch(`/api/bookings/${bookingId}?depth=2`)
        const booking = await bookingRes.json()

        setData({ share: shareDoc, booking })
        setLoading(false)
      } catch (e) {
        console.error(e)
        setError('Failed to load tracking data.')
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 10000) // Refresh every 10s
    return () => clearInterval(interval)
  }, [token])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#0f172a' }}>
        <CircularProgress sx={{ color: '#fbbf24', mb: 2 }} />
        <Typography color="#fff">Locating your ride...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#0f172a' }}>
        <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 400, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom>Oops!</Typography>
          <Typography color="text.secondary">{error}</Typography>
        </Paper>
      </Box>
    )
  }

  const { booking } = data
  const driver = booking.driver
  const vehicle = booking.vehicle
  const driverLocation = driver?.location || booking.pickupLocation

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0f172a' }}>
      {/* HEADER */}
      <Box sx={{ p: 2, bgcolor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.1)', zIdx: 1000 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" fontWeight={800} color="#fbbf24">LIVE TRACKING</Typography>
            <Typography variant="caption" color="rgba(255,255,255,0.6)">Ride ID: {booking.bookingCode}</Typography>
          </Box>
          <Chip label="IN TRANSIT" size="small" sx={{ bgcolor: '#fbbf24', color: '#000', fontWeight: 900 }} />
        </Stack>
      </Box>

      {/* MAP */}
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        <MapComponent
          center={[driverLocation[1], driverLocation[0]]}
          zoom={15}
          markers={[
            {
              id: 'driver',
              position: [driverLocation[1], driverLocation[0]],
              popup: <Typography fontWeight={700}>{driver?.name || 'Your Driver'}</Typography>
            },
            {
              id: 'pickup',
              position: [booking.pickupLocation[1], booking.pickupLocation[0]],
              popup: <Typography>Pickup: {booking.pickupLocationName}</Typography>
            },
            {
              id: 'dropoff',
              position: [booking.dropoffLocation[1], booking.dropoffLocation[0]],
              popup: <Typography>Destination: {booking.dropoffLocationName}</Typography>
            }
          ]}
        />

        {/* DRIVER CARD (FLOATING) */}
        <Box sx={{ position: 'absolute', bottom: 24, left: 16, right: 16, zIndex: 1000 }}>
          <Paper sx={{ p: 2, borderRadius: 4, boxShadow: '0 20px 40px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', bgcolor: 'rgba(30, 41, 59, 0.95)', backdropFilter: 'blur(10px)', color: '#fff' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ width: 60, height: 60, border: '3px solid #fbbf24' }} src={driver?.profileImage?.url}>
                <PersonIcon />
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight={700}>{driver?.name || 'Driver'}</Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ opacity: 0.8 }}>
                  <LocalTaxiIcon sx={{ fontSize: 16, color: '#fbbf24' }} />
                  <Typography variant="body2">{vehicle?.name} • {vehicle?.number}</Typography>
                </Stack>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h5" fontWeight={900} color="#fbbf24">12</Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>MIN AWAY</Typography>
              </Box>
            </Stack>
            
            <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
            
            <Stack direction="row" spacing={3}>
              <Stack spacing={0.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <NearMeIcon sx={{ fontSize: 14, color: '#fbbf24' }} />
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>DESTINATION</Typography>
                </Stack>
                <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>{booking.dropoffLocationName}</Typography>
              </Stack>
              
              <Stack spacing={0.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AccessTimeIcon sx={{ fontSize: 14, color: '#fbbf24' }} />
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>EST. ARRIVAL</Typography>
                </Stack>
                <Typography variant="body2">{new Date(Date.now() + 12 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

export default function LiveTrackingPage() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <TrackingContent />
    </Suspense>
  )
}
