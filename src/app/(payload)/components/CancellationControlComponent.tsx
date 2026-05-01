'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Stack,
  Switch,
  IconButton,
  Avatar,
  Divider,
  CircularProgress,
  Grid,
} from '@mui/material'

import PaymentsIcon from '@mui/icons-material/Payments'
import SettingsIcon from '@mui/icons-material/Settings'
import CloseIcon from '@mui/icons-material/Close'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'

export default function CancellationControlComponent() {
  const [data, setData] = useState({
    penaltyAmount: 50,
    allowGracePeriod: true,
    trackingEnabled: true,
    rules: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/globals/cancellation-control')
      const d = await res.json()
      setData({
        penaltyAmount: d.penaltyAmount || 50,
        allowGracePeriod: d.allowGracePeriod ?? true,
        trackingEnabled: d.trackingEnabled ?? true,
        rules: d.rules || '',
      })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/globals/cancellation-control', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        alert('Rules saved successfully!')
      } else {
        alert('Failed to save rules.')
      }
    } catch (e) {
      console.error(e)
      alert('Error saving rules.')
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
      
      <Grid container spacing={3}>
        
        {/* TOP LEFT: Penalty Configuration */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none', position: 'relative' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Box>
                <Typography variant="h5" fontWeight={800} color="#0f172a">Penalty Configuration</Typography>
                <Typography variant="body2" color="#64748b">Define the standard monetary penalty for late cancellations.</Typography>
              </Box>
              <Avatar sx={{ bgcolor: '#e0f2fe', borderRadius: 1.5, color: '#0ea5e9' }}>
                <AccountBalanceWalletIcon />
              </Avatar>
            </Stack>

            <Box sx={{ mt: 4 }}>
              <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>PENALTY AMOUNT (₹)</Typography>
              <TextField 
                fullWidth
                value={data.penaltyAmount}
                onChange={(e) => setData({ ...data, penaltyAmount: Number(e.target.value) })}
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    bgcolor: '#f1f5f9', 
                    borderRadius: 2, 
                    '& fieldset': { border: 'none' },
                    fontSize: 18,
                    fontWeight: 700
                  } 
                }}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1, fontWeight: 700, color: '#0f172a' }}>₹</Typography>
                }}
              />
              <Typography variant="caption" color="#94a3b8" sx={{ mt: 2, display: 'block' }}>
                This amount is deducted from the customer's wallet or added to the next trip invoice.
              </Typography>
            </Box>
          </Paper>

          {/* BOTTOM LEFT: Cancellation Rules */}
          <Paper sx={{ p: 4, mt: 3, borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <Typography variant="subtitle1" fontWeight={800} color="#0f172a" mb={4}>Cancellation Rules</Typography>
            
            <Stack spacing={0} divider={<Divider />}>
              {[
                { 
                  id: '01', 
                  title: 'Free cancellation within 5 minutes of booking.', 
                  desc: 'Policy to ensure customers have a window to rectify accidental bookings.',
                  color: '#10b981',
                  bg: '#dcfce7'
                },
                { 
                  id: '02', 
                  title: 'Cancellation after 5 minutes incurs a penalty.', 
                  desc: 'Automated trigger for penalty deduction once the grace period expires.',
                  color: '#f43f5e',
                  bg: '#fee2e2'
                },
                { 
                  id: '03', 
                  title: 'Driver cancellation after arriving incurs a penalty.', 
                  desc: 'Protects operator logistics when drivers arrive at pickup and the user cancels.',
                  color: '#f43f5e',
                  bg: '#fee2e2'
                },
              ].map((rule) => (
                <Box key={rule.id} sx={{ py: 3, display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                  <Avatar sx={{ width: 28, height: 28, fontSize: 12, fontWeight: 800, bgcolor: rule.bg, color: rule.color, border: `1px solid ${rule.color}` }}>
                    {rule.id}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight={800} color="#0f172a">{rule.title}</Typography>
                    <Typography variant="caption" color="#64748b" display="block" mt={0.5}>{rule.desc}</Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* TOP RIGHT: Operational Controls */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <Typography variant="subtitle1" fontWeight={800} color="#0f172a" mb={4}>Operational Controls</Typography>
            
            <Stack spacing={4} divider={<Divider />}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" fontWeight={800} color="#0f172a">Allow Grace Period (5 mins)</Typography>
                  <Typography variant="caption" color="#64748b">Exempt first 300 seconds from penalty.</Typography>
                </Box>
                <Switch 
                  checked={data.allowGracePeriod} 
                  onChange={(e) => setData({ ...data, allowGracePeriod: e.target.checked })} 
                  color="primary" 
                />
              </Stack>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" fontWeight={800} color="#0f172a">Track All Cancellations</Typography>
                  <Typography variant="caption" color="#64748b">Enable detailed logging for audits.</Typography>
                </Box>
                <Switch 
                  checked={data.trackingEnabled} 
                  onChange={(e) => setData({ ...data, trackingEnabled: e.target.checked })} 
                  color="primary" 
                />
              </Stack>
            </Stack>
          </Paper>
        </Grid>

      </Grid>

      {/* FOOTER ACTIONS */}
      <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button 
          variant="outlined" 
          onClick={fetchData}
          sx={{ textTransform: 'none', borderRadius: 2, px: 4, py: 1, fontWeight: 700, borderColor: '#e2e8f0', color: '#0f172a' }}
        >
          Discard Changes
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSave}
          disabled={saving}
          sx={{ textTransform: 'none', borderRadius: 2, px: 4, py: 1, fontWeight: 700, bgcolor: '#000', color: '#fff', '&:hover': { bgcolor: '#333' } }}
        >
          {saving ? 'Saving...' : 'Save Rules'}
        </Button>
      </Box>

    </Box>
  )
}
