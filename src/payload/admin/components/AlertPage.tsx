'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Chip,
  IconButton,
  Badge,
  Drawer,
  TextField,
  MenuItem,
  Divider
} from '@mui/material'

import NotificationsIcon from '@mui/icons-material/Notifications'
import CloseIcon from '@mui/icons-material/Close'

type AlertType = 'info' | 'warning' | 'emergency' | 'payment_fail'  | "booking" | "system"

interface Alert {
  id: string
  title: string
  message: string
  type: AlertType
  triggeredBy: any
  isRead: boolean
  createdAt: string
}

export default function AlertPage() {

  // ================= STATE =================
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | AlertType>('all')

  const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true)
}, [])

  const [form, setForm] = useState({
    title: '',
    message: '',
    type: 'info' as AlertType,
    triggeredBy: '',
    isRead: false
  })

  // ================= LOAD STORAGE =================
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch('/api/alerts?limit=100&sort=-createdAt')
        const data = await res.json()
        setAlerts(data.docs)
      } catch (e) {
        console.log('fetch alerts error', e)
      }
    }
    fetchAlerts()
  }, [])

  // ================= CREATE ALERT =================
  const createAlert = async (data: Partial<Alert>) => {
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title || '',
          message: data.message || '',
          type: data.type || 'info',
          triggeredBy: data.triggeredBy || null,
          isRead: false,
        })
      })
      const newAlert = (await res.json()).doc
      setAlerts(prev => [newAlert, ...prev])
    } catch (e) {
      console.log('Error creating alert', e)
    }
  }

  // ================= UI CREATE =================
  const handleCreate = () => {
    if (!form.title || !form.message) return

    createAlert(form)

    setOpen(false)
    setForm({
      title: '',
      message: '',
      type: 'info',
      triggeredBy: '',
      isRead: false
    })
  }

  // ================= MARK READ =================
  const markRead = async (id: string) => {
    try {
      const res = await fetch(`/api/alerts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true })
      })
      const updatedAlert = (await res.json()).doc
      setAlerts(prev => prev.map(a => a.id === id ? updatedAlert : a))
    } catch (e) {
      console.log('Error marking as read', e)
    }
  }

  // ================= FILTER =================
  const filtered = useMemo(() => {
    if (filter === 'all') return alerts
    return alerts.filter(a => a.type === filter)
  }, [alerts, filter])

  // ================= BELL COUNT =================
  const unread = alerts.filter(a => !a.isRead).length

  // ================= COLOR MAP =================
  const colorMap: Record<AlertType, string> = {
    info: '#3b82f6',
    warning: '#f59e0b',
    emergency: '#ef4444',
    payment_fail: '#f97316',
    booking: '#16A34A',
    system: '#2563EB',
  }

  if (!mounted) {
    return null
  }

  return (
    <Box sx={{ p: 3, bgcolor: '#f6f7fb', minHeight: '100vh' }}>

      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight={700}>
          Alert System
        </Typography>

        <Stack direction="row" spacing={2}>

          {/* BELL ICON */}
          <IconButton sx={{ bgcolor: '#fff' }}>
            <Badge badgeContent={unread} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Button variant="contained" onClick={() => setOpen(true)}>
            Create Alert
          </Button>
        </Stack>
      </Stack>

      {/* FILTER CHIPS */}
      <Stack direction="row" spacing={1} mt={3}>
        {['all', 'info', 'warning', 'emergency', 'payment_fail'].map((t) => (
          <Chip
            key={t}
            label={t.toUpperCase()}
            clickable
            onClick={() => setFilter(t as any)}
            sx={{
              bgcolor: filter === t ? '#111827' : '#fff',
              color: filter === t ? '#fff' : '#111827',
              border: '1px solid #e5e7eb'
            }}
          />
        ))}
      </Stack>

      {/* TABLE */}
      <Paper sx={{ mt: 3, borderRadius: 3, overflow: 'hidden' }}>

  {filtered.length === 0 ? (
    <Box p={3} textAlign="center">No alerts found</Box>
  ) : (

    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      
      {/* TABLE HEADER */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 1fr',
          bgcolor: '#111827',
          color: '#fff',
          p: 2,
          fontWeight: 600,
          fontSize: 14
        }}
      >
        <div>Title</div>
        <div>Message</div>
        <div>Type</div>
        <div>Triggered By</div>
        <div>Status</div>
        <div>Time</div>
      </Box>

      {/* TABLE BODY */}
      {filtered.map(alert => (
        <Box
          key={alert.id}
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 1fr',
            p: 2,
            borderBottom: '1px solid #eee',
            alignItems: 'center',
            bgcolor: alert.isRead ? '#fff' : '#eff6ff'
          }}
        >

          {/* TITLE */}
          <div style={{ fontWeight: 600 }}>
            {alert.title}
          </div>

          {/* MESSAGE */}
          <div style={{ fontSize: 13, color: '#555' }}>
            {alert.message}
          </div>

          {/* TYPE */}
          <Chip
            label={alert.type}
            size="small"
            sx={{
              bgcolor: colorMap[alert.type],
              color: '#fff'
            }}
          />

          {/* TRIGGERED BY */}
          <div>
            {alert.triggeredBy}
          </div>

          {/* STATUS */}
          <div>
            {alert.isRead ? (
              <span style={{ color: 'green', fontWeight: 600 }}>Read</span>
            ) : (
              <span style={{ color: 'red', fontWeight: 600 }}>Unread</span>
            )}
          </div>

          {/* TIME */}
          <div style={{ fontSize: 12 }}>
            {new Date(alert.createdAt).toLocaleString()}
          </div>

        </Box>
      ))}

    </Box>
  )}

</Paper>
      {/* DRAWER */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 380, p: 3 }}>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6">Create Alert</Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={2}>

            <TextField
              label="Title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />

            <TextField
              label="Message"
              multiline
              rows={3}
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
            />

            <TextField
              select
              label="Type"
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value as AlertType })}
            >
              <MenuItem value="info">Info</MenuItem>
              <MenuItem value="warning">Warning</MenuItem>
              <MenuItem value="emergency">Emergency</MenuItem>
              <MenuItem value="payment_fail">Payment Fail</MenuItem>
            </TextField>

            <TextField
              label="Triggered By"
              value={form.triggeredBy}
              onChange={e => setForm({ ...form, triggeredBy: e.target.value })}
            />

            <Button variant="contained" onClick={handleCreate}>
              Save Alert
            </Button>

          </Stack>

        </Box>
      </Drawer>

    </Box>
  )
}