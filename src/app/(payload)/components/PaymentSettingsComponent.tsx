'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Stack,
  Avatar,
  CircularProgress,
} from '@mui/material'

import PaymentsIcon from '@mui/icons-material/Payments'

export default function PaymentSettingsComponent() {
  const [minPayment, setMinPayment] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/globals/payment-settings')
      const data = await res.json()
      setMinPayment(data.minimumPayment || 0)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/globals/payment-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ minimumPayment: Number(minPayment) }),
      })
      if (res.ok) {
        alert('Deposit updated successfully!')
      } else {
        alert('Failed to update deposit.')
      }
    } catch (e) {
      console.error(e)
      alert('Error updating deposit.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* HEADER */}
      <Typography variant="h5" fontWeight={800} color="#0f172a" mb={6}>Payment Settings</Typography>

      {/* CENTERED CARD */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Paper 
          sx={{ 
            p: 5, 
            width: '100%', 
            maxWidth: 500, 
            borderRadius: 3, 
            border: '1px solid #e2e8f0', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)' 
          }}
        >
          <Stack spacing={3}>
            
            {/* ICON & TITLE */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar 
                sx={{ 
                  bgcolor: '#f8fafc', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: 1, 
                  width: 32, 
                  height: 32,
                  color: '#0f172a'
                }}
              >
                <PaymentsIcon sx={{ fontSize: 18 }} />
              </Avatar>
              <Typography variant="h6" fontWeight={800} color="#0f172a">Booking Deposit</Typography>
            </Stack>

            <Typography variant="body2" color="#64748b">
              Minimum amount required to confirm a booking
            </Typography>

            {/* INPUT FIELD */}
            <Box>
              <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1} letterSpacing={0.5}>
                MINIMUM PAYMENT (₹)
              </Typography>
              <TextField 
                fullWidth 
                type="number"
                value={minPayment}
                onChange={(e) => setMinPayment(Number(e.target.value))}
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    bgcolor: '#fff', 
                    borderRadius: 2,
                    fontSize: 18,
                    fontWeight: 700,
                    '& fieldset': { borderColor: '#e2e8f0' }
                  } 
                }}
              />
            </Box>

            {/* UPDATE BUTTON */}
            <Button 
              variant="contained" 
              fullWidth 
              onClick={handleUpdate}
              disabled={saving}
              sx={{ 
                bgcolor: '#0f172a', 
                color: '#fff', 
                py: 2, 
                borderRadius: 2, 
                fontWeight: 800, 
                textTransform: 'none',
                '&:hover': { bgcolor: '#1e293b' }
              }}
            >
              {saving ? 'UPDATING...' : 'UPDATE DEPOSIT'}
            </Button>

          </Stack>
        </Paper>
      </Box>

    </Box>
  )
}
