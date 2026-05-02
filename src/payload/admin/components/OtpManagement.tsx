'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import SecurityIcon from '@mui/icons-material/Security'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import TimerIcon from '@mui/icons-material/Timer'

export default function OtpManagement() {
  const [otps, setOtps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/trip-otps?limit=100&sort=-createdAt&depth=1')
      .then((res) => res.json())
      .then((data) => {
        setOtps(data.docs || [])
        setLoading(false)
      })
  }, [])

  const filteredOtps = otps.filter((otp) => 
    otp.otp.includes(search) || 
    (otp.booking && (typeof otp.booking === 'object' ? otp.booking.bookingCode : otp.booking).toLowerCase().includes(search.toLowerCase()))
  )

  const getStatusChip = (otp: any) => {
    if (otp.verified) return <Chip icon={<CheckCircleIcon />} label="Verified" color="success" size="small" />
    const isExpired = new Date(otp.expiresAt) < new Date()
    if (isExpired) return <Chip icon={<ErrorOutlineIcon />} label="Expired" color="error" size="small" />
    return <Chip icon={<PendingActionsIcon />} label="Active" color="primary" size="small" />
  }

  return (
    <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="#0f172a">OTP Command Center</Typography>
          <Typography color="text.secondary">Monitor and manage ride verification security codes</Typography>
        </Box>
        <TextField
          size="small"
          placeholder="Search by OTP or Booking ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ bgcolor: '#fff', borderRadius: 2, width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', border: '1px solid #e2e8f0' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f1f5f9' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>BOOKING</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>SECURITY OTP</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>STATUS</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>METHOD</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>EXPIRY</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>CREATED AT</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOtps.map((otp) => (
              <TableRow key={otp.id} hover>
                <TableCell>
                  <Typography fontWeight={700}>#{typeof otp.booking === 'object' ? otp.booking.bookingCode : 'N/A'}</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', bgcolor: '#0f172a', color: '#fff', px: 2, py: 0.5, borderRadius: 1.5, gap: 1 }}>
                    <SecurityIcon sx={{ fontSize: 16, color: '#fbbf24' }} />
                    <Typography variant="body2" fontWeight={800} letterSpacing={2}>{otp.otp}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{getStatusChip(otp)}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ textTransform: 'uppercase', fontWeight: 600, color: '#64748b' }}>
                    {otp.deliveryMethod}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TimerIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                    <Typography variant="body2">{new Date(otp.expiresAt).toLocaleTimeString()}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">{new Date(otp.createdAt).toLocaleString()}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
