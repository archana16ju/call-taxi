'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Stack,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Divider,
  LinearProgress,
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'
import FlashOnIcon from '@mui/icons-material/FlashOn'

export default function DriverAllocationManagement() {
  const [activeAllocations, setActiveAllocations] = useState<any[]>([])
  const [availableDrivers, setAvailableDrivers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, driversRes] = await Promise.all([
          fetch('/api/bookings?where[status][equals]=confirmed&limit=10&sort=-updatedAt&depth=2'),
          fetch('/api/drivers?where[status][equals]=available&limit=10'),
        ])
        
        const bookingsData = await bookingsRes.json()
        const driversData = await driversRes.json()
        
        setActiveAllocations(bookingsData.docs || [])
        setAvailableDrivers(driversData.docs || [])
        setLoading(false)
      } catch (e) {
        console.error(e)
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Box sx={{ p: 4, bgcolor: '#f1f5f9', minHeight: '100vh' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={900} color="#0f172a">Driver Allocation Engine</Typography>
          <Typography color="text.secondary">Automated dispatching and smart ride assignment monitor</Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Box sx={{ p: 1.5, px: 3, bgcolor: '#fff', borderRadius: 3, border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={900} color="#3b82f6">{activeAllocations.length}</Typography>
            <Typography variant="caption" fontWeight={700} color="text.secondary">PENDING ASSIGNMENTS</Typography>
          </Box>
          <Box sx={{ p: 1.5, px: 3, bgcolor: '#fff', borderRadius: 3, border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={900} color="#10b981">{availableDrivers.length}</Typography>
            <Typography variant="caption" fontWeight={700} color="text.secondary">READY DRIVERS</Typography>
          </Box>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {/* LEFT: ACTIVE ASSIGNMENTS */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h6" fontWeight={800} mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutorenewIcon color="primary" /> Recent System Allocations
          </Typography>
          <Stack spacing={2}>
            {activeAllocations.map((booking) => (
              <Card key={booking.id} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none', position: 'relative', overflow: 'visible' }}>
                {booking.reallocationHistory && booking.reallocationHistory.length > 0 && (
                  <Chip 
                    icon={<FlashOnIcon sx={{ fontSize: '12px !important' }} />}
                    label="Auto Re-allocated" 
                    size="small" 
                    sx={{ position: 'absolute', top: -10, right: 20, bgcolor: '#0f172a', color: '#fbbf24', fontWeight: 900, fontSize: 10 }}
                  />
                )}
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', mb: 0.5 }}>RIDE ID: {booking.bookingCode}</Typography>
                      <Typography variant="body1" fontWeight={800}>{booking.customerName}</Typography>
                      <Typography variant="body2" color="text.secondary">{booking.customerPhone}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Stack spacing={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <LocationOnIcon sx={{ fontSize: 16, color: '#ef4444' }} />
                          <Typography variant="body2" noWrap fontWeight={600}>{booking.pickupLocationName}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <LocationOnIcon sx={{ fontSize: 16, color: '#3b82f6' }} />
                          <Typography variant="body2" noWrap fontWeight={600}>{booking.dropoffLocationName}</Typography>
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>ASSIGNED DRIVER</Typography>
                        <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                          <Typography variant="body1" fontWeight={800}>{booking.driver?.name || 'Searching...'}</Typography>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: booking.driver ? '#10b981' : '#f59e0b' }}>
                            <PersonIcon sx={{ fontSize: 20 }} />
                          </Avatar>
                        </Stack>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  {booking.reallocationHistory && booking.reallocationHistory.length > 0 && (
                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed #e2e8f0' }}>
                      <Typography variant="caption" color="#64748b" sx={{ fontWeight: 700 }}>RE-ALLOCATION EVENT:</Typography>
                      <Typography variant="caption" color="#94a3b8" sx={{ display: 'block' }}>
                        Previously assigned to {booking.reallocationHistory[0].previousDriver?.name || 'another driver'} • {new Date(booking.reallocationHistory[0].timestamp).toLocaleTimeString()}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Grid>

        {/* RIGHT: DRIVER QUEUE */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h6" fontWeight={800} mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon color="success" /> Available Dispatch Queue
          </Typography>
          <Paper sx={{ p: 0, borderRadius: 4, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <Box sx={{ p: 2, bgcolor: '#fff' }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary">DRIVERS IN STANDBY</Typography>
            </Box>
            <Divider />
            <Stack divider={<Divider />}>
              {availableDrivers.map((driver) => (
                <Box key={driver.id} sx={{ p: 2, bgcolor: '#fff', '&:hover': { bgcolor: '#f8fafc' } }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar src={driver.photo?.url} sx={{ width: 44, height: 44, border: '2px solid #10b981' }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" fontWeight={800}>{driver.name}</Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10b981' }} />
                        <Typography variant="caption" color="text.secondary">Ready for assignment</Typography>
                      </Stack>
                    </Box>
                    <Button variant="outlined" size="small" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, fontSize: 10 }}>
                      Quick Assign
                    </Button>
                  </Stack>
                </Box>
              ))}
            </Stack>
            {availableDrivers.length === 0 && (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <WarningIcon sx={{ fontSize: 40, color: '#f59e0b', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">No available drivers in vicinity</Typography>
              </Box>
            )}
          </Paper>

          <Box sx={{ mt: 3, p: 3, borderRadius: 4, bgcolor: '#0f172a', color: '#fff' }}>
            <Typography variant="subtitle2" fontWeight={800} gutterBottom>AI ALLOCATION STATUS</Typography>
            <Stack spacing={2} mt={2}>
              <Box>
                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                  <Typography variant="caption">System Efficiency</Typography>
                  <Typography variant="caption" fontWeight={800} color="#fbbf24">98%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={98} sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#fbbf24' } }} />
              </Box>
              <Box>
                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                  <Typography variant="caption">Avg. Allocation Time</Typography>
                  <Typography variant="caption" fontWeight={800} color="#fbbf24">1.2s</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={85} sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: '#fbbf24' } }} />
              </Box>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
