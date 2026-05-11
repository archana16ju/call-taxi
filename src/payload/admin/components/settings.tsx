'use client'

import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Switch,
  Button,
  Chip,
  Stack,
  Divider,
} from '@mui/material'

type SettingsType = {
  siteName: string
  supportPhone: string
  supportEmail: string
  whatsappNumber: string
  currency: string
  bookingEnabled: boolean
  maintenanceMode: boolean
  voiceBookingEnabled: boolean
  aiChatEnabled: boolean
  liveTrackingEnabled: boolean
}

const ToggleCard = ({
  title,
  desc,
  value,
  onChange,
}: {
  title: string
  desc: string
  value: boolean
  onChange: (val: boolean) => void
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        height: '100%',
        border: '1px solid rgba(255,255,255,0.08)',
        background: value
          ? 'linear-gradient(135deg, rgba(251,191,36,0.12), rgba(251,191,36,0.04))'
          : 'rgba(255,255,255,0.02)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* TOP SECTION */}
      <Box>
        <Typography fontWeight={800} sx={{ color: '#fff', mb: 0.5 }}>
          {title}
        </Typography>

        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
          {desc}
        </Typography>
      </Box>

      {/* BOTTOM SECTION */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
      >
        <Chip
          label={value ? 'ACTIVE' : 'OFF'}
          size="small"
          sx={{
            fontWeight: 700,
            backgroundColor: value ? '#22c55e' : '#ef4444',
            color: '#fff',
          }}
        />

        <Switch checked={value} onChange={(e) => onChange(e.target.checked)} />
      </Stack>
    </Paper>
  )
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsType>({
    siteName: 'Taxi System',
    supportPhone: '',
    supportEmail: '',
    whatsappNumber: '',
    currency: 'INR',
    bookingEnabled: true,
    maintenanceMode: false,
    voiceBookingEnabled: true,
    aiChatEnabled: true,
    liveTrackingEnabled: true,
  })

  const handleChange = (key: keyof SettingsType, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Box
      sx={{
        p: 3,
        background: '#0a192f',
        minHeight: '100vh',
      }}
    >
      {/* HEADER */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          fontWeight={900}
          sx={{ color: '#fff', letterSpacing: '-0.5px' }}
        >
          ⚙️ System Settings
        </Typography>

        <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
          Manage system configuration, features, and business controls
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {/* LEFT PANEL */}
       <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: '#111c33',
              height: '100%',
            }}
          >
            <Typography
              fontWeight={800}
              sx={{ color: '#fff', mb: 2 }}
            >
              🏢 Business Info
            </Typography>

            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  Site Name
                </Typography>
                <Typography fontWeight={700} sx={{ color: '#fff' }}>
                  {settings.siteName}
                </Typography>
              </Box>

              <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  Support Phone
                </Typography>
                <Typography sx={{ color: '#fff' }}>
                  {settings.supportPhone || '-'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  Email
                </Typography>
                <Typography sx={{ color: '#fff' }}>
                  {settings.supportEmail || '-'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  Currency
                </Typography>
                <Typography sx={{ color: '#fff' }}>
                  {settings.currency}
                </Typography>
              </Box>
            </Stack>

            <Button
              fullWidth
              sx={{
                mt: 3,
                background: '#fbbf24',
                color: '#000',
                fontWeight: 800,
                borderRadius: 2,
                py: 1.2,
                '&:hover': { background: '#f59e0b' },
              }}
            >
              Save Settings
            </Button>
          </Paper>
        </Grid>

        {/* RIGHT PANEL */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography
            sx={{
              color: '#fff',
              fontWeight: 800,
              mb: 2,
              pl: 0.5,
            }}
          >
            🚀 Feature Controls
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <ToggleCard
                title="Booking System"
                desc="Enable ride booking for users"
                value={settings.bookingEnabled}
                onChange={(v) => handleChange('bookingEnabled', v)}
              />
            </Grid>

           <Grid size={{ xs: 12, sm: 6 }}>
              <ToggleCard
                title="Maintenance Mode"
                desc="Disable app for maintenance"
                value={settings.maintenanceMode}
                onChange={(v) => handleChange('maintenanceMode', v)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <ToggleCard
                title="Voice Booking"
                desc="Allow voice-based ride booking"
                value={settings.voiceBookingEnabled}
                onChange={(v) => handleChange('voiceBookingEnabled', v)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <ToggleCard
                title="AI Chat Support"
                desc="Enable AI assistant for users"
                value={settings.aiChatEnabled}
                onChange={(v) => handleChange('aiChatEnabled', v)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <ToggleCard
                title="Live Tracking"
                desc="Enable GPS tracking system"
                value={settings.liveTrackingEnabled}
                onChange={(v) => handleChange('liveTrackingEnabled', v)}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}