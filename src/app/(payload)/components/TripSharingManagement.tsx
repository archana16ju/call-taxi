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
  Button,
  Tooltip,
} from '@mui/material'
import ShareIcon from '@mui/icons-material/Share'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import MapIcon from '@mui/icons-material/Map'
import VisibilityIcon from '@mui/icons-material/Visibility'

export default function TripSharingManagement() {
  const [links, setLinks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/trip-sharing?limit=100&sort=-createdAt&depth=1')
      .then((res) => res.json())
      .then((data) => {
        setLinks(data.docs || [])
        setLoading(false)
      })
  }, [])

  const copyToClipboard = (token: string) => {
    const url = `${window.location.origin}/live-tracking?token=${token}`
    navigator.clipboard.writeText(url)
    alert('Sharing link copied!')
  }

  return (
    <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="#0f172a">Live Trip Sharing Dashboard</Typography>
          <Typography color="text.secondary">Monitor active tracking links and passenger safety shares</Typography>
        </Box>
        <Button variant="contained" startIcon={<MapIcon />} sx={{ bgcolor: '#0f172a', borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>
          Global Fleet View
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>BOOKING</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>SHARING TOKEN</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>STATUS</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>VIEWS</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>EXPIRY</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {links.map((link) => (
              <TableRow key={link.id} hover>
                <TableCell>
                  <Typography fontWeight={700}>#{typeof link.booking === 'object' ? link.booking.bookingCode : 'N/A'}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: '#f1f5f9', px: 1, borderRadius: 1, display: 'inline-block' }}>
                    {link.shareToken.substring(0, 12)}...
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={link.active ? 'Active' : 'Inactive'} 
                    color={link.active ? 'success' : 'default'} 
                    size="small" 
                    sx={{ fontWeight: 700 }}
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <VisibilityIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                    <Typography variant="body2" fontWeight={600}>{link.views || 0}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(link.expiresAt).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title="Copy Link">
                      <IconButton size="small" onClick={() => copyToClipboard(link.shareToken)}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Open Live Tracking">
                      <IconButton size="small" component="a" href={`/live-tracking?token=${link.shareToken}`} target="_blank">
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
