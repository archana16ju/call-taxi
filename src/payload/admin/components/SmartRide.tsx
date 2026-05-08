// src/payload/admin/components/SmartRide.tsx

'use client'

import React from 'react'
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
} from '@mui/material'

const SmartRide = () => {
  return (
    <Box p={3} bgcolor="#f5f7fb" minHeight="100vh">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography fontSize={28} fontWeight={700}>
            Ride Personalization
          </Typography>

          <Typography color="text.secondary">
            Configure passenger presets and global fleet requirements.
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button variant="outlined">Discard Changes</Button>

          <Button variant="contained">Save Preferences</Button>
        </Stack>
      </Stack>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src="https://i.pravatar.cc/150?img=12"
            sx={{ width: 70, height: 70 }}
          />

          <Box flex={1}>
            <Typography fontSize={24} fontWeight={700}>
              Alex Thompson
            </Typography>

            <Typography color="text.secondary">
              alex.thompson@corporateride.com
            </Typography>

            <Stack direction="row" spacing={2} mt={1}>
              <Paper sx={{ p: 1.5 }}>
                <Typography fontSize={12}>MOST USED PRESET</Typography>

                <Typography fontWeight={700}>Office Ride</Typography>
              </Paper>

              <Paper sx={{ p: 1.5 }}>
                <Typography fontSize={12}>TOTAL RIDES</Typography>

                <Typography fontWeight={700}>1,284</Typography>
              </Paper>

              <Paper sx={{ p: 1.5 }}>
                <Typography fontSize={12}>AVG. RATING</Typography>

                <Typography fontWeight={700}>4.9 ★</Typography>
              </Paper>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      <Grid container spacing={3} mt={1}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography fontSize={20} fontWeight={700} mb={2}>
              Ride Requirements
            </Typography>

            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography fontWeight={600}>Child Seat</Typography>

                  <Typography fontSize={13} color="text.secondary">
                    Safety compliance required
                  </Typography>
                </Box>

                <Switch />
              </Stack>

              <Divider />

              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography fontWeight={600}>Pet Friendly</Typography>

                  <Typography fontSize={13} color="text.secondary">
                    Standard household pets
                  </Typography>
                </Box>

                <Switch defaultChecked />
              </Stack>

              <Divider />

              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography fontWeight={600}>Luggage Support</Typography>

                  <Typography fontSize={13} color="text.secondary">
                    Heavy lifting assistance
                  </Typography>
                </Box>

                <Switch defaultChecked />
              </Stack>

              <Divider />

              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography fontWeight={600}>Wheelchair Access</Typography>

                  <Typography fontSize={13} color="text.secondary">
                    Ramp or lift equipped vehicle
                  </Typography>
                </Box>

                <Switch />
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography fontSize={20} fontWeight={700} mb={2}>
              Comfort Settings
            </Typography>

            <Typography mb={1}>AC Level</Typography>

            <Stack direction="row" spacing={1} mb={3}>
              <Button variant="outlined">Low</Button>

              <Button variant="contained">Med</Button>

              <Button variant="outlined">High</Button>
            </Stack>

            <Typography mb={1}>Ride Mode</Typography>

            <Stack direction="row" spacing={1} mb={3}>
              <Button variant="contained">Office</Button>

              <Button variant="outlined">Relax</Button>

              <Button variant="outlined">Night</Button>
            </Stack>

            <Typography mb={1}>Music Preference</Typography>

            <Select fullWidth defaultValue="classical">
              <MenuItem value="classical">
                Classical Focus
              </MenuItem>

              <MenuItem value="soft">
                Soft Music
              </MenuItem>

              <MenuItem value="podcast">
                Podcast
              </MenuItem>
            </Select>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography fontSize={20} fontWeight={700} mb={2}>
              Smart Automation
            </Typography>

            <Stack spacing={3}>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography fontWeight={700}>Auto-Apply</Typography>

                  <Typography fontSize={13} color="text.secondary">
                    Automatically apply ride settings to new bookings.
                  </Typography>
                </Box>

                <Switch defaultChecked />
              </Stack>

              <Divider />

              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography fontWeight={700}>Share with Driver</Typography>

                  <Typography fontSize={13} color="text.secondary">
                    Driver receives ride preferences before pickup.
                  </Typography>
                </Box>

                <Switch defaultChecked />
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Paper
        sx={{
          mt: 4,
          p: 2,
          borderRadius: 3,
          bgcolor: '#0f172a',
          color: 'white',
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography fontWeight={700}>
              Unsaved changes detected
            </Typography>

            <Typography fontSize={13}>
              Last saved on Oct 24, 2025
            </Typography>
          </Box>

          <Button variant="contained">
            Save All Preferences
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}

export default SmartRide