'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Stack,
  Button,
  Chip,
  Divider,
  CircularProgress,
} from '@mui/material'
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'
import AccessTimeFilledOutlinedIcon from '@mui/icons-material/AccessTimeFilledOutlined'
import LocalTaxiOutlinedIcon from '@mui/icons-material/LocalTaxiOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import Link from 'next/link'

type Props = {
  booking?: any
}

const OTPDashboard: React.FC<Props> = ({ booking }) => {
  const [otp, setOtp] = useState<string>('')
  const [seconds, setSeconds] = useState<number>(300)
  const [loading, setLoading] = useState<boolean>(false)
  const [method, setMethod] = useState<'sms' | 'whatsapp' | 'email'>('sms')

  useEffect(() => {
    if (booking) {
      generateOTP()
    }
  }, [booking])

  useEffect(() => {
    if (seconds <= 0) return

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [seconds])

  const generateOTP = async () => {
    setLoading(true)

    try {
      const res = await fetch('/api/generate-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: booking?.id,
          method,
        }),
      })

      const data = await res.json()

      setOtp(data.otp || '')
      setSeconds(300)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (value: number) => {
    const mins = Math.floor(value / 60)
    const secs = value % 60

    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Box p={3}>
      <Typography
        variant="h5"
        fontWeight={700}
        mb={1}
      >
        Generate Ride OTP
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        mb={3}
      >
        Authenticate secure trip session using auto generated booking OTP.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            elevation={0}
            sx={{
              border: '1px solid #E5E7EB',
              borderRadius: 3,
              p: 3,
            }}
          >
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#6B7280',
                    fontWeight: 600,
                    letterSpacing: 1,
                  }}
                >
                  BOOKING ID
                </Typography>

                <Paper
                  variant="outlined"
                  sx={{
                    mt: 1,
                    p: 2,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <LocalTaxiOutlinedIcon fontSize="small" />

                  <Link href={`/bookings/${booking?.id || ''}`} style={{ textDecoration: 'none', color: 'inherit' }}>
  <Typography fontWeight={600} sx={{ cursor: 'pointer' }}>
    {booking?.bookingID || 'N/A'}
  </Typography>
</Link>
                </Paper>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#6B7280',
                    fontWeight: 600,
                    letterSpacing: 1,
                  }}
                >
                  PASSENGER NAME
                </Typography>

                <Paper
                  variant="outlined"
                  sx={{
                    mt: 1,
                    p: 2,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <PersonOutlineOutlinedIcon fontSize="small" />

                  <Link href={`/bookings/${booking?.id || ''}`} style={{ textDecoration: 'none', color: 'inherit' }}>
  <Typography fontWeight={600} sx={{ cursor: 'pointer' }}>
    {booking?.customerName || 'Passenger'}
  </Typography>
</Link>
                </Paper>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#6B7280',
                    fontWeight: 600,
                    letterSpacing: 1,
                  }}
                >
                  DELIVERY METHOD
                </Typography>

                <Stack
                  direction="row"
                  spacing={2}
                  mt={1.5}
                >
                  <Button
                    variant={method === 'sms' ? 'contained' : 'outlined'}
                    startIcon={<SmsOutlinedIcon />}
                    onClick={() => setMethod('sms')}
                    sx={{
                      borderRadius: 2,
                      height: 54,
                      textTransform: 'none',
                      minWidth: 120,
                    }}
                  >
                    SMS
                  </Button>

                  <Button
                    variant={method === 'whatsapp' ? 'contained' : 'outlined'}
                    startIcon={<WhatsAppIcon />}
                    onClick={() => setMethod('whatsapp')}
                    sx={{
                      borderRadius: 2,
                      height: 54,
                      textTransform: 'none',
                      minWidth: 120,
                    }}
                  >
                    WhatsApp
                  </Button>

                  <Button
                    variant={method === 'email' ? 'contained' : 'outlined'}
                    startIcon={<EmailOutlinedIcon />}
                    onClick={() => setMethod('email')}
                    sx={{
                      borderRadius: 2,
                      height: 54,
                      textTransform: 'none',
                      minWidth: 120,
                    }}
                  >
                    Email
                  </Button>
                </Stack>
              </Box>

              <Button
                fullWidth
                variant="contained"
                onClick={generateOTP}
                disabled={loading}
                sx={{
                  height: 52,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 700,
                  background: '#081B44',
                }}
              >
                {loading ? (
                  <CircularProgress size={22} sx={{ color: '#fff' }} />
                ) : (
                  'Generate OTP'
                )}
              </Button>
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              mt: 3,
              borderRadius: 3,
              border: '1px solid #D6E4FF',
              background: '#F4F8FF',
              p: 3,
            }}
          >
            <Stack direction="row" spacing={2}>
              <VerifiedOutlinedIcon color="info" />

              <Box>
                <Typography fontWeight={700}>
                  Security Protocol
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  mt={1}
                >
                  OTP codes are auto generated after booking confirmation and
                  remain valid for only 5 minutes.
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              background: '#081B44',
              color: '#fff',
              p: 3,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                letterSpacing: 2,
                opacity: 0.7,
              }}
            >
              GENERATED OTP
            </Typography>

            <Stack
              direction="row"
              spacing={1.2}
              mt={3}
              mb={3}
            >
              {(otp || '000000').split('').map((digit, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 48,
                    height: 58,
                    borderRadius: 2,
                    background: 'rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 30,
                    fontWeight: 800,
                  }}
                >
                  {digit}
                </Box>
              ))}
            </Stack>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

            <Stack
              direction="row"
              spacing={1}
              mt={2}
              alignItems="center"
            >
              <AccessTimeFilledOutlinedIcon fontSize="small" />

              <Typography variant="body2">
                Expires in {formatTime(seconds)} minutes
              </Typography>
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              mt: 3,
              borderRadius: 3,
              border: '1px solid #E5E7EB',
              p: 3,
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight={700}
              mb={3}
            >
              DELIVERY STATUS
            </Typography>

            <Stack spacing={3}>
              <Stack direction="row" spacing={2}>
                <Chip
                  color="success"
                  size="small"
                  label="✓"
                />

                <Box>
                  <Typography fontWeight={600}>
                    OTP Generated
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Booking confirmation completed
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={2}>
                <Chip
                  color="success"
                  size="small"
                  label="✓"
                />

                <Box>
                  <Typography fontWeight={600}>
                    OTP Sent Successfully
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Delivered via {method.toUpperCase()}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={2}>
                <Chip
                  color="primary"
                  size="small"
                  label="⏳"
                />

                <Box>
                  <Typography fontWeight={600}>
                    Waiting For Verification
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Driver verification pending
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default OTPDashboard