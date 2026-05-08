'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Stack,
  Avatar,
  Switch,
  Divider,
  Button,
  Grid,
  MenuItem,
  Select,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Alert,
} from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly'
import PetsIcon from '@mui/icons-material/Pets'
import LuggageIcon from '@mui/icons-material/BusinessCenter'
import AccessibleIcon from '@mui/icons-material/Accessible'
import WorkIcon from '@mui/icons-material/Work'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import NightlifeIcon from '@mui/icons-material/Nightlife'
import AddIcon from '@mui/icons-material/Add'
import StarIcon from '@mui/icons-material/Star'
import MapIcon from '@mui/icons-material/Map'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ShareIcon from '@mui/icons-material/Share'

const SmartRide = () => {
  const [acLevel, setAcLevel] = useState('med')
  const [rideMode, setRideMode] = useState('office')
  const [hasChanges, setHasChanges] = useState(false)

  const handleToggle = () => {
    setHasChanges(true)
  }

  return (
    <Box 
      sx={{ 
        p: { xs: 2, md: 4 }, 
        bgcolor: '#f8fafc', 
        minHeight: '100vh',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* Header Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
            Ride Personalization
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Configure passenger presets and global fleet requirements.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            sx={{ 
              borderRadius: '8px', 
              borderColor: '#e2e8f0', 
              color: '#475569',
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Discard Changes
          </Button>
          <Button 
            variant="contained" 
            sx={{ 
              borderRadius: '8px', 
              bgcolor: '#0f172a', 
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { bgcolor: '#1e293b' }
            }}
          >
            Save Preferences
          </Button>
        </Stack>
      </Stack>

      {/* User Profile Card Section */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper 
            sx={{ 
              p: 3, 
              borderRadius: '16px', 
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
              border: '1px solid #f1f5f9'
            }}
          >
            <Stack direction="row" spacing={3} alignItems="center">
              <Avatar 
                src="https://i.pravatar.cc/150?u=alex" 
                sx={{ width: 80, height: 80, borderRadius: '12px' }} 
              />
              <Box sx={{ flexGrow: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    Alex Thompson
                  </Typography>
                  <Chip 
                    label="PREMIUM MEMBER" 
                    size="small" 
                    sx={{ 
                      bgcolor: '#eff6ff', 
                      color: '#3b82f6', 
                      fontSize: '0.65rem', 
                      fontWeight: 800,
                      borderRadius: '4px'
                    }} 
                  />
                </Stack>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                  alex.thompson@corporateride.com • +1 (555) 012-3456
                </Typography>
                
                <Stack direction="row" spacing={4}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Most Used Preset
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#334155' }}>
                      Office Ride
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Total Rides
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#334155' }}>
                      1,284
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Avg. Rating
                    </Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Typography variant="body1" sx={{ fontWeight: 700, color: '#334155' }}>
                        4.9
                      </Typography>
                      <StarIcon sx={{ color: '#f59e0b', fontSize: '1rem' }} />
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper 
            sx={{ 
              p: 0, 
              borderRadius: '16px', 
              overflow: 'hidden',
              height: '100%',
              position: 'relative',
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
              border: '1px solid #f1f5f9'
            }}
          >
            <Box 
              component="img" 
              src="https://maps.googleapis.com/maps/api/staticmap?center=New+York&zoom=13&size=600x300&key=YOUR_API_KEY"
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <Box 
              sx={{ 
                position: 'absolute', 
                bottom: 12, 
                left: 12, 
                bgcolor: 'rgba(255,255,255,0.9)', 
                backdropFilter: 'blur(4px)',
                p: 1, 
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}
            >
              <Typography variant="caption" sx={{ display: 'block', fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>
                ACTIVE REGION
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                New York, Manhattan
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Presets Section */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
          Quick Presets
        </Typography>
        <Button variant="text" sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600 }}>
          View All →
        </Button>
      </Stack>

      <Grid container spacing={2} mb={4}>
        {[
          { id: 'office', name: 'Office Ride', desc: 'Morning commute settings with news radio and high AC.', icon: <WorkIcon />, active: true },
          { id: 'airport', name: 'Airport Run', desc: 'Luggage support enabled, silent cabin, direct route.', icon: <FlightTakeoffIcon />, active: false },
          { id: 'date', name: 'Date Night', desc: 'Ambient lighting, premium audio, temperature 72°F.', icon: <NightlifeIcon />, active: false },
        ].map((preset) => (
          <Grid key={preset.id} size={{ xs: 12, md: 3 }}>
            <Paper 
              sx={{ 
                p: 2.5, 
                borderRadius: '12px', 
                cursor: 'pointer',
                border: preset.active ? '2px solid #0f172a' : '1px solid #f1f5f9',
                transition: 'all 0.2s',
                '&:hover': { borderColor: '#cbd5e1' }
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box sx={{ p: 1, bgcolor: '#f1f5f9', borderRadius: '8px', color: '#1e293b' }}>
                  {preset.icon}
                </Box>
                {preset.active && (
                  <Chip 
                    label="ACTIVE" 
                    size="small" 
                    sx={{ bgcolor: '#0f172a', color: '#fff', fontSize: '0.6rem', height: '18px', fontWeight: 800 }} 
                  />
                )}
              </Stack>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {preset.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8rem', mt: 0.5 }}>
                {preset.desc}
              </Typography>
            </Paper>
          </Grid>
        ))}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper 
            variant="outlined"
            sx={{ 
              p: 2.5, 
              borderRadius: '12px', 
              border: '2px dashed #e2e8f0', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              cursor: 'pointer',
              color: '#94a3b8',
              '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1', color: '#64748b' }
            }}
          >
            <IconButton sx={{ bgcolor: '#f1f5f9', mb: 1 }}>
              <AddIcon />
            </IconButton>
            <Typography sx={{ fontWeight: 600 }}>Create New</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Detailed Settings Section */}
      <Grid container spacing={3} mb={10}>
        {/* Ride Requirements */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, borderRadius: '16px', border: '1px solid #f1f5f9', height: '100%' }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={3}>
              <Box sx={{ p: 0.5, bgcolor: '#f1f5f9', borderRadius: '6px' }}>
                <WorkIcon sx={{ fontSize: '1.2rem', color: '#475569' }} />
              </Box>
              <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>Ride Requirements</Typography>
            </Stack>
            
            <Stack spacing={2}>
              {[
                { label: 'Child Seat', sub: 'ISOFIX compatible required', icon: <ChildFriendlyIcon /> },
                { label: 'Pet Friendly', sub: 'Standard household pets', icon: <PetsIcon />, defaultChecked: true },
                { label: 'Luggage Support', sub: 'Heavy lifting assistance', icon: <LuggageIcon />, defaultChecked: true },
                { label: 'Wheelchair Access', sub: 'Ramp or lift equipped vehicle', icon: <AccessibleIcon /> },
              ].map((item) => (
                <Stack key={item.label} direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography sx={{ fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>{item.label}</Typography>
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>{item.sub}</Typography>
                  </Box>
                  <Switch defaultChecked={item.defaultChecked} size="small" onChange={handleToggle} />
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Comfort Settings */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, borderRadius: '16px', border: '1px solid #f1f5f9', height: '100%' }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={3}>
              <Box sx={{ p: 0.5, bgcolor: '#f1f5f9', borderRadius: '6px' }}>
                <StarIcon sx={{ fontSize: '1.2rem', color: '#475569' }} />
              </Box>
              <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>Comfort Settings</Typography>
            </Stack>

            <Box mb={3}>
              <Typography sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', mb: 1.5 }}>AC LEVEL</Typography>
              <ToggleButtonGroup
                value={acLevel}
                exclusive
                onChange={(_, val) => val && (setAcLevel(val), handleToggle())}
                sx={{ width: '100%', height: '40px' }}
              >
                {['low', 'med', 'high'].map(level => (
                  <ToggleButton key={level} value={level} sx={{ flex: 1, textTransform: 'capitalize', fontWeight: 600 }}>
                    {level}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>

            <Box mb={3}>
              <Typography sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', mb: 1.5 }}>RIDE MODE</Typography>
              <ToggleButtonGroup
                value={rideMode}
                exclusive
                onChange={(_, val) => val && (setRideMode(val), handleToggle())}
                sx={{ width: '100%', height: '40px' }}
              >
                {['office', 'relax', 'night'].map(mode => (
                  <ToggleButton key={mode} value={mode} sx={{ flex: 1, textTransform: 'capitalize', fontWeight: 600 }}>
                    {mode}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', mb: 1.5 }}>MUSIC PREFERENCE</Typography>
              <Select
                fullWidth
                size="small"
                defaultValue="classical"
                onChange={handleToggle}
                sx={{ borderRadius: '8px' }}
              >
                <MenuItem value="classical">Classical Focus</MenuItem>
                <MenuItem value="jazz">Smooth Jazz</MenuItem>
                <MenuItem value="pop">Today's Hits</MenuItem>
                <MenuItem value="none">No Music</MenuItem>
              </Select>
            </Box>
          </Paper>
        </Grid>

        {/* Smart Automation */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, borderRadius: '16px', border: '1px solid #f1f5f9', height: '100%' }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={3}>
              <Box sx={{ p: 0.5, bgcolor: '#f1f5f9', borderRadius: '6px' }}>
                <AutoAwesomeIcon sx={{ fontSize: '1.2rem', color: '#475569' }} />
              </Box>
              <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>Smart Automation</Typography>
            </Stack>

            <Stack spacing={3}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px', borderColor: '#f1f5f9' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ p: 1, bgcolor: '#0f172a', borderRadius: '8px', color: '#fff' }}>
                      <AutoAwesomeIcon sx={{ fontSize: '1.1rem' }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' }}>Auto-Apply</Typography>
                      <Typography sx={{ color: '#3b82f6', fontSize: '0.65rem', fontWeight: 800 }}>GLOBAL SYNC</Typography>
                    </Box>
                  </Stack>
                  <Switch defaultChecked size="small" onChange={handleToggle} />
                </Stack>
                <Typography sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                  Automatically apply these settings to any vehicle assigned to Alex Thompson across the fleet network.
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px', borderColor: '#f1f5f9' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ p: 1, bgcolor: '#f1f5f9', borderRadius: '8px', color: '#1e293b' }}>
                      <ShareIcon sx={{ fontSize: '1.1rem' }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' }}>Share with Driver</Typography>
                      <Typography sx={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: 800 }}>PRIVACY PROTECTED</Typography>
                    </Box>
                  </Stack>
                  <Switch defaultChecked size="small" onChange={handleToggle} />
                </Stack>
                <Typography sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                  Driver will receive a summary of cabin and ride requirements 15 minutes prior to pickup.
                </Typography>
              </Paper>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Sticky Bar */}
      {hasChanges && (
        <Paper 
          sx={{ 
            position: 'fixed', 
            bottom: 24, 
            left: { xs: 24, md: 300 }, // Account for sidebar width
            right: 24, 
            p: 2, 
            borderRadius: '16px', 
            bgcolor: '#0f172a', 
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ p: 1, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex' }}>
              <InfoOutlinedIcon sx={{ fontSize: '1.2rem' }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Unsaved changes detected</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>Last saved on Oct 24, 2023 at 09:12 AM</Typography>
            </Box>
          </Stack>
          <Button 
            variant="contained" 
            sx={{ 
              bgcolor: '#fff', 
              color: '#0f172a', 
              fontWeight: 700, 
              borderRadius: '8px',
              textTransform: 'none',
              '&:hover': { bgcolor: '#f1f5f9' }
            }}
            onClick={() => setHasChanges(false)}
          >
            Save All Preferences
          </Button>
        </Paper>
      )}
    </Box>
  )
}

export default SmartRide