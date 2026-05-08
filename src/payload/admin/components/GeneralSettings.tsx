"use client";

import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Divider,
  Alert,
  Snackbar,
  Chip,
  IconButton,
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import RefreshIcon from '@mui/icons-material/Refresh'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import EmailIcon from '@mui/icons-material/Email'
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee'

export default function GeneralSettings() {
  const [form, setForm] = useState({
    systemName: '',
    whatsappNumber: '',
    supportEmail: '',
    currencySymbol: '',
  })
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // LOAD DATA FROM PAYLOAD
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/globals/general-settings')
        const data = await res.json()

        setForm({
          systemName: data.systemName || 'Kani Taxi',
          whatsappNumber: data.whatsappNumber || '',
          supportEmail: data.supportEmail || '',
          currencySymbol: data.currencySymbol || '₹',
        })
      } catch (err) {
        console.error('Failed to fetch settings:', err)
      }
    }

    fetchData()
  }, [])

  // HANDLE INPUT CHANGE
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  // SAVE TO PAYLOAD
  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/globals/general-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setSuccess(true)
      } else {
        alert('Save failed')
      }
    } catch (err) {
      alert('Error saving configuration')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '800px', mx: 'auto' }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          borderRadius: '16px', 
          border: '1px solid var(--theme-border-color)',
          backgroundColor: 'var(--theme-bg-card)',
          backgroundImage: 'none'
        }}
      >
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--theme-text)' }}>
              General Settings
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--theme-text-secondary)', mt: 0.5 }}>
              Manage global support and platform parameters
            </Typography>
          </Box>
          <Chip 
            label="Live Sync Active" 
            color="primary" 
            size="small" 
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        </Stack>

        <Divider sx={{ mb: 4, borderColor: 'var(--theme-border-color)' }} />

        {/* Form Fields */}
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="System Name"
            name="systemName"
            value={form.systemName}
            onChange={handleChange}
            variant="outlined"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />

          <TextField
            fullWidth
            label="WhatsApp Support Number"
            name="whatsappNumber"
            placeholder="91XXXXXXXXXX"
            value={form.whatsappNumber}
            onChange={handleChange}
            helperText="Include country code (e.g. 91)"
            InputProps={{
              startAdornment: <WhatsAppIcon sx={{ mr: 1, color: '#25D366' }} />,
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />

          <TextField
            fullWidth
            label="Support Email"
            name="supportEmail"
            value={form.supportEmail}
            onChange={handleChange}
            InputProps={{
              startAdornment: <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />,
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />

          <Box sx={{ width: '150px' }}>
            <TextField
              fullWidth
              label="Currency Symbol"
              name="currencySymbol"
              value={form.currencySymbol}
              onChange={handleChange}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
          </Box>
        </Stack>

        <Alert 
          severity="info" 
          sx={{ 
            mt: 4, 
            borderRadius: '12px',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            color: 'var(--theme-text)',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}
        >
          Real-time database sync is enabled. Changes will reflect instantly across the platform.
        </Alert>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={4}>
          <Button
            variant="outlined"
            onClick={() => window.location.reload()}
            sx={{ borderRadius: '12px', px: 3 }}
          >
            Discard
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={loading}
            sx={{ 
              borderRadius: '12px', 
              px: 4,
              backgroundColor: '#fbbf24',
              color: '#000',
              '&:hover': { backgroundColor: '#f59e0b' }
            }}
          >
            {loading ? 'Saving...' : 'Save Configuration'}
          </Button>
        </Stack>
      </Paper>

      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={() => setSuccess(false)}
        message="Configuration saved successfully"
      />
    </Box>
  );
}