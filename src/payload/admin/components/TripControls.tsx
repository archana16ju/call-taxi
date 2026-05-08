'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  TextField,
  MenuItem,
  Grid,
  IconButton,
  Divider,
  Chip,
  CircularProgress,
  InputAdornment,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SmsIcon from '@mui/icons-material/Sms'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import EmailIcon from '@mui/icons-material/Email'
import ShareIcon from '@mui/icons-material/Share'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import MapIcon from '@mui/icons-material/Map'

type TripControlsProps = {
  bookingId: string
  bookingCode: string
  customerName: string
  customerPhone: string
  status: string
  tripStatus: string
  otpVerified: boolean
  sharingToken?: string
  onUpdate: () => void
}

export default function TripControls({
  bookingId,
  bookingCode,
  customerName,
  customerPhone,
  status,
  tripStatus,
  otpVerified,
  sharingToken,
  onUpdate,
}: TripControlsProps) {
  const [loading, setLoading] = useState(false)
  const [otpData, setOtpData] = useState<any>(null)
  const [enteredOtp, setEnteredOtp] = useState(['', '', '', '', '', ''])
  const [method, setMethod] = useState<'sms' | 'whatsapp' | 'email'>('sms')

  useEffect(() => {
    if (bookingId) {
      fetchOtp()
    }
  }, [bookingId])

  const fetchOtp = async () => {
    try {
      const res = await fetch(`/api/trip-otps?where[booking][equals]=${bookingId}&sort=-createdAt&limit=1`)
      const data = await res.json()
      if (data.docs && data.docs.length > 0) {
        setOtpData(data.docs[0])
      }
    } catch (e) {
      console.error('Error fetching OTP', e)
    }
  }

  const handleGenerateOtp = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/trip-otps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking: bookingId,
          otp: Math.floor(100000 + Math.random() * 900000).toString(),
          expiresAt: new Date(Date.now() + 10 * 60000).toISOString(),
          deliveryMethod: method,
          deliveryStatus: 'sent',
        }),
      })
      if (res.ok) {
        await fetchOtp()
      }
    } catch (e) {
      console.error('Error generating OTP', e)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    const otpString = enteredOtp.join('')
    if (otpString.length !== 6) return

    setLoading(true)
    try {
      if (otpData && otpData.otp === otpString) {
        // Mark OTP as verified
        await fetch(`/api/trip-otps/${otpData.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ verified: true }),
        })

        // Update Booking tripStatus and otpVerified
        await fetch(`/api/bookings/${bookingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tripStatus: 'started',
            otpVerified: true,
          }),
        })

        alert('OTP Verified! Trip Started.')
        onUpdate()
      } else {
        alert('Invalid OTP. Please try again.')
      }
    } catch (e) {
      console.error('Error verifying OTP', e)
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0]
    const newOtp = [...enteredOtp]
    newOtp[index] = value
    setEnteredOtp(newOtp)

    // Auto focus next
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`)
      next?.focus()
    }
  }

  const copySharingLink = () => {
    const url = `${window.location.origin}/live-tracking?token=${sharingToken}`
    navigator.clipboard.writeText(url)
    alert('Sharing link copied to clipboard!')
  }

  if (status !== 'confirmed' && status !== 'completed') {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none', bgcolor: '#f8fafc' }}>
        <Typography color="text.secondary">OTP controls will be available once the booking is confirmed.</Typography>
      </Paper>
    )
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        {/* OTP GENERATION SECTION */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#fff', border: '1px solid #e2e8f0', height: '100%' }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>Generate Ride OTP</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>Authenticate a secure trip session by creating a unique 6-digit verification code.</Typography>

            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>SELECT TRIP ID</Typography>
                <TextField 
                  fullWidth 
                  size="small" 
                  value={bookingCode} 
                  disabled 
                  InputProps={{
                    startAdornment: <InputAdornment position="start">TRP-</InputAdornment>,
                  }}
                />
              </Box>

              <Box>
                <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>PASSENGER NAME</Typography>
                <TextField fullWidth size="small" value={customerName} disabled />
              </Box>

              <Box>
                <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>DELIVERY METHOD</Typography>
                <Stack direction="row" spacing={1}>
                  {[
                    { id: 'sms', icon: <SmsIcon fontSize="small" />, label: 'SMS' },
                    { id: 'whatsapp', icon: <WhatsAppIcon fontSize="small" />, label: 'WhatsApp' },
                    { id: 'email', icon: <EmailIcon fontSize="small" />, label: 'Email' },
                  ].map((m) => (
                    <Button
                      key={m.id}
                      variant={method === m.id ? 'contained' : 'outlined'}
                      onClick={() => setMethod(m.id as any)}
                      sx={{ flex: 1, textTransform: 'none', py: 1, borderRadius: 2 }}
                      startIcon={m.icon}
                    >
                      {m.label}
                    </Button>
                  ))}
                </Stack>
              </Box>

              <Button
                fullWidth
                variant="contained"
                onClick={handleGenerateOtp}
                disabled={loading || otpVerified}
                sx={{ bgcolor: '#0f172a', py: 1.5, borderRadius: 2, fontWeight: 700 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate OTP'}
              </Button>
            </Stack>

            {otpData && !otpVerified && (
              <Box sx={{ mt: 3, p: 2, bgcolor: '#0f172a', borderRadius: 2, color: '#fff', textAlign: 'center' }}>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>GENERATED OTP</Typography>
                <Stack direction="row" spacing={1} justifyContent="center" mt={1}>
                  {otpData.otp.split('').map((char: string, i: number) => (
                    <Box key={i} sx={{ width: 40, height: 50, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700 }}>
                      {char}
                    </Box>
                  ))}
                </Stack>
                <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7 }}>
                  Expires in {Math.max(0, Math.floor((new Date(otpData.expiresAt).getTime() - Date.now()) / 60000))} minutes
                </Typography>
              </Box>
            )}

            {otpVerified && (
              <Box sx={{ mt: 3, p: 2, bgcolor: '#f0fdf4', borderRadius: 2, border: '1px solid #bbf7d0', textAlign: 'center' }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography fontWeight={700} color="#166534">OTP Verified Successfully</Typography>
                <Typography variant="caption" color="#166534">Trip started at {new Date().toLocaleTimeString()}</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* VERIFY / LIVE SHARING SECTION */}
        <Grid size={{ xs: 12, md: 6 }}>
          {!otpVerified ? (
            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#fff', border: '1px solid #e2e8f0', textAlign: 'center', height: '100%' }}>
              <Box sx={{ mb: 4 }}>
                <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', mb: 2 }}>
                  <SmsIcon color="primary" />
                </Box>
                <Typography variant="h6" fontWeight={700}>Verify Ride</Typography>
                <Typography variant="body2" color="text.secondary">Enter the 6-digit code sent to the passenger to start the trip.</Typography>
              </Box>

              <Stack direction="row" spacing={1} justifyContent="center" mb={4}>
                {enteredOtp.map((digit, i) => (
                  <TextField
                    key={i}
                    id={`otp-${i}`}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    sx={{ width: 50 }}
                    inputProps={{ style: { textAlign: 'center', fontWeight: 700, fontSize: 20 } }}
                  />
                ))}
              </Stack>

              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleVerifyOtp}
                disabled={loading || enteredOtp.join('').length !== 6}
                sx={{ py: 1.5, borderRadius: 2, fontWeight: 700 }}
              >
                Verify & Start Ride
              </Button>

              <Typography variant="caption" color="text.secondary" display="block" mt={3}>
                Didn&apos;t receive the code? <Button variant="text" size="small" onClick={handleGenerateOtp}>Resend</Button>
              </Typography>
            </Paper>
          ) : (
            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#fff', border: '1px solid #e2e8f0', height: '100%' }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Live Trip Sharing</Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>The trip is currently in progress. Share the live tracking link for safety.</Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>SHARING LINK</Typography>
                <Stack direction="row" spacing={1}>
                  <TextField
                    fullWidth
                    size="small"
                    value={`${window.location.origin}/live-tracking?token=${sharingToken}`}
                    disabled
                  />
                  <IconButton onClick={copySharingLink} sx={{ bgcolor: '#f1f5f9' }}>
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>

              <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <MapIcon color="primary" />
                  <Box>
                    <Typography variant="body2" fontWeight={700}>Live Tracking Active</Typography>
                    <Typography variant="caption" color="text.secondary">Real-time GPS updates enabled</Typography>
                  </Box>
                  <Box sx={{ ml: 'auto' }}>
                    <Chip label="In Transit" color="primary" size="small" />
                  </Box>
                </Stack>
              </Box>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<ShareIcon />}
                onClick={copySharingLink}
                sx={{ py: 1.5, borderRadius: 2, fontWeight: 700 }}
              >
                Share with Emergency Contacts
              </Button>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}
