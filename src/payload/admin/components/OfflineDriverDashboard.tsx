'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material'
import SyncIcon from '@mui/icons-material/Sync'
import CloudDoneIcon from '@mui/icons-material/CloudDone'
import MapIcon from '@mui/icons-material/Map'
import InfoIcon from '@mui/icons-material/Info'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'

export default function OfflineDriverDashboard() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/driver-offline-logs?sort=-syncedAt&limit=50&depth=2')
        const data = await res.json()
        setLogs(data.docs || [])
        setLoading(false)
      } catch (e) {
        console.error(e)
        setLoading(false)
      }
    }
    fetchLogs()
  }, [])

  return (
    <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={900} color="#1e293b" sx={{ letterSpacing: '-0.02em' }}>
            Offline Sync Monitor
          </Typography>
          <Typography color="text.secondary" fontWeight={500}>
            Tracking data recovery from rural and weak signal zones
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Paper sx={{ px: 3, py: 1.5, borderRadius: 3, bgcolor: '#fff', border: '1px solid #e2e8f0' }}>
            <Typography variant="caption" fontWeight={800} color="#64748b" display="block">TOTAL RECOVERED POINTS</Typography>
            <Typography variant="h5" fontWeight={900} color="#3b82f6">
              {logs.reduce((acc, log) => acc + (log.batchSize || 0), 0)}
            </Typography>
          </Paper>
          <Paper sx={{ px: 3, py: 1.5, borderRadius: 3, bgcolor: '#fff', border: '1px solid #e2e8f0' }}>
            <Typography variant="caption" fontWeight={800} color="#64748b" display="block">SYNC STATUS</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <CloudDoneIcon sx={{ color: '#10b981' }} />
              <Typography variant="h6" fontWeight={900} color="#10b981">HEALTHY</Typography>
            </Stack>
          </Paper>
        </Stack>
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f1f5f9' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: '#475569' }}>DRIVER / VEHICLE</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#475569' }}>SYNC TIMESTAMP</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#475569' }}>TRIP ID</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#475569' }}>DATA LOAD</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#475569' }}>STATUS</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#475569' }} align="right">ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6} sx={{ p: 0 }}>
                  <LinearProgress sx={{ height: 2 }} />
                </TableCell>
              </TableRow>
            )}
            {logs.map((log) => (
              <TableRow key={log.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ p: 1, bgcolor: '#eff6ff', borderRadius: 2 }}>
                      <DirectionsCarIcon sx={{ color: '#3b82f6' }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight={800}>{log.driver?.name || 'Unknown Driver'}</Typography>
                      <Typography variant="caption" color="text.secondary">{log.driver?.phone || 'No phone'}</Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {log.syncedAt ? new Date(log.syncedAt).toLocaleString() : 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={log.trip?.bookingCode || 'Standby'} 
                    size="small" 
                    sx={{ fontWeight: 700, bgcolor: '#f1f5f9', color: '#475569' }} 
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" fontWeight={700}>{log.batchSize || 0}</Typography>
                    <Typography variant="caption" color="text.secondary">Coordinates</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip 
                    icon={<SyncIcon sx={{ fontSize: '14px !important' }} />}
                    label="Synced Successfully" 
                    size="small" 
                    sx={{ bgcolor: '#ecfdf5', color: '#059669', fontWeight: 700, border: '1px solid #10b981' }} 
                  />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title="View Path on Map">
                      <IconButton size="small" sx={{ bgcolor: '#fff', border: '1px solid #e2e8f0' }}>
                        <MapIcon fontSize="small" sx={{ color: '#3b82f6' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Log Details">
                      <IconButton size="small" sx={{ bgcolor: '#fff', border: '1px solid #e2e8f0' }}>
                        <InfoIcon fontSize="small" sx={{ color: '#64748b' }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {logs.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                  <Typography variant="body2" color="text.secondary">No offline sync events recorded yet.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
