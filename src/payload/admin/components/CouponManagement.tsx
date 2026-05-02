'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  TextField,
  InputAdornment,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Drawer,
  Switch,
  FormControlLabel,
  MenuItem,
  Divider,
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import FilterListIcon from '@mui/icons-material/FilterList'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import CloseIcon from '@mui/icons-material/Close'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import AltRouteIcon from '@mui/icons-material/AltRoute'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import EventBusyIcon from '@mui/icons-material/EventBusy'

type Coupon = {
  id: string
  name: string
  percentage: number
  tariffScope: string
  vehicleScope: string
  startDate?: string
  expiryDate?: string
  usageLimit?: number
  active: boolean
  createdAt: string
}

export default function CouponManagement() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [redemptions, setRedemptions] = useState(0)
  const [openDrawer, setOpenDrawer] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState<Partial<Coupon>>({
    name: '',
    percentage: 10,
    tariffScope: 'all',
    vehicleScope: 'all',
    usageLimit: 100,
    active: true,
    startDate: '',
    expiryDate: '',
  })

  useEffect(() => {
    fetchCoupons()
    fetchRedemptions()
  }, [])

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/coupons?limit=100&sort=-createdAt')
      const data = await res.json()
      if (data.docs) setCoupons(data.docs)
    } catch (e) { console.error(e) }
  }

  const fetchRedemptions = async () => {
    try {
      const res = await fetch('/api/bookings?limit=0&where[couponCode][exists]=true')
      const data = await res.json()
      setRedemptions(data.totalDocs || 0)
    } catch (e) { console.error(e) }
  }

  const handleEdit = (coupon: Coupon) => {
    setEditingId(coupon.id)
    setForm({
      ...coupon,
      startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split('T')[0] : '',
      expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '',
    })
    setOpenDrawer(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return
    try {
      await fetch(`/api/coupons/${id}`, { method: 'DELETE' })
      fetchCoupons()
    } catch (e) { console.error(e) }
  }

  const handleSave = async () => {
    setLoading(true)
    const url = editingId ? `/api/coupons/${editingId}` : '/api/coupons'
    const method = editingId ? 'PATCH' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
          expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString() : undefined,
        }),
      })

      if (res.ok) {
        setOpenDrawer(false)
        fetchCoupons()
      } else {
        const err = await res.json()
        alert('Error saving coupon: ' + JSON.stringify(err))
      }
    } catch (e) { console.error(e) } finally {
      setLoading(false)
    }
  }

  const filteredCoupons = useMemo(() => {
    return coupons.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [coupons, searchTerm])

  const getStatus = (c: Coupon) => {
    if (!c.active) return { label: 'INACTIVE', color: '#64748b', bg: '#f1f5f9' }
    const now = new Date()
    if (c.expiryDate && new Date(c.expiryDate) < now) return { label: 'EXPIRED', color: '#ef4444', bg: '#fee2e2' }
    if (c.startDate && new Date(c.startDate) > now) return { label: 'SCHEDULED', color: '#f59e0b', bg: '#fef3c7' }
    return { label: 'ACTIVE', color: '#10b981', bg: '#dcfce7' }
  }

  return (
    <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5" fontWeight={800} color="#0f172a">Offer Management</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => { setEditingId(null); setForm({ name: '', percentage: 10, tariffScope: 'all', vehicleScope: 'all', usageLimit: 100, active: true }); setOpenDrawer(true); }}
          sx={{ bgcolor: '#0f172a', textTransform: 'none', fontWeight: 600, px: 3, borderRadius: 2 }}
        >
          + Add Coupon
        </Button>
      </Stack>

      {/* STATS CARDS */}
      <Grid container spacing={3} mb={4}>
        {[
          { label: 'TOTAL COUPONS', value: coupons.length.toLocaleString(), change: '+12%', icon: <LocalOfferIcon sx={{ color: '#64748b' }} />, trend: 'up' },
          { label: 'ACTIVE OFFERS', value: coupons.filter(c => getStatus(c).label === 'ACTIVE').length, change: 'Stable', icon: <FlashOnIcon sx={{ color: '#3b82f6' }} />, trend: 'stable' },
          { label: 'TOTAL REDEMPTIONS', value: redemptions.toLocaleString(), change: '+8.4k', icon: <CardGiftcardIcon sx={{ color: '#a855f7' }} />, trend: 'up' },
        ].map((stat, i) => (
          <Grid size={{ xs: 12, md: 4 }} key={i}>
            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
              <Stack direction="row" justifyContent="space-between" mb={2}>
                <Avatar sx={{ bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2 }}>{stat.icon}</Avatar>
                <Typography variant="caption" fontWeight={700} color={stat.trend === 'up' ? '#10b981' : '#64748b'}>{stat.change}</Typography>
              </Stack>
              <Typography variant="caption" fontWeight={700} color="#64748b" display="block">{stat.label}</Typography>
              <Typography variant="h4" fontWeight={800} color="#0f172a">{stat.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* TABLE SECTION */}
      <Paper sx={{ borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden' }}>
        <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search by name, code or scope..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { bgcolor: '#f8fafc', borderRadius: 2 } }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
          />
          <Button variant="outlined" startIcon={<FilterListIcon />} sx={{ textTransform: 'none', borderRadius: 2, borderColor: '#e2e8f0', color: '#0f172a' }}>Filter</Button>
          <Button variant="outlined" startIcon={<FileDownloadIcon />} sx={{ textTransform: 'none', borderRadius: 2, borderColor: '#e2e8f0', color: '#0f172a' }}>Export</Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: 11 }}>COUPON IDENTITY</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: 11 }}>VALUE</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: 11 }}>SCOPE CONFIG</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: 11 }}>STATUS</TableCell>
                <TableCell align="right" sx={{ color: '#64748b', fontWeight: 700, fontSize: 11 }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCoupons.map((c) => {
                const status = getStatus(c)
                return (
                  <TableRow key={c.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2, color: '#64748b' }}>
                          {status.label === 'EXPIRED' ? <EventBusyIcon fontSize="small" /> : <CardGiftcardIcon fontSize="small" />}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={800} color="#0f172a">{c.name}</Typography>
                          <Typography variant="caption" color="#64748b">
                            {status.label === 'EXPIRED' ? `Expired: ${new Date(c.expiryDate!).toLocaleDateString()}` : `Created: ${new Date(c.createdAt).toLocaleDateString()}`}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip label={`${c.percentage}% OFF`} size="small" sx={{ bgcolor: '#eef2ff', color: '#4f46e5', fontWeight: 700, borderRadius: 1 }} />
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <AltRouteIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                          <Typography variant="caption" fontWeight={600} color="#475569">{c.tariffScope === 'all' ? 'Global Tariff' : 'Regional Tariff'}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <DirectionsCarIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                          <Typography variant="caption" fontWeight={600} color="#475569">{c.vehicleScope === 'all' ? 'All Fleet' : 'Specific Fleet'}</Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={`\u2022 ${status.label}`} 
                        size="small" 
                        sx={{ 
                          bgcolor: status.bg, 
                          color: status.color, 
                          fontWeight: 800, 
                          fontSize: 10,
                          borderRadius: 1,
                          '& .MuiChip-label': { px: 1 }
                        }} 
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleEdit(c)} sx={{ mr: 1 }}><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => handleDelete(c.id)} sx={{ color: '#f43f5e' }}><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <Typography variant="caption" color="#64748b" fontWeight={600}>Showing {filteredCoupons.length} of {coupons.length} entries</Typography>
           <Stack direction="row" spacing={1}>
             <Button variant="outlined" size="small" disabled sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 700 }}>Previous</Button>
             <Button variant="outlined" size="small" sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 700, bgcolor: '#0f172a', color: '#fff', '&:hover': { bgcolor: '#1e293b' } }}>Next</Button>
           </Stack>
        </Box>
      </Paper>

      {/* CREATE/EDIT DRAWER */}
      <Drawer anchor="right" open={openDrawer} onClose={() => setOpenDrawer(false)} PaperProps={{ sx: { width: 500, p: 4, bgcolor: '#f8fafc' } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h5" fontWeight={800}>Create New Coupon</Typography>
          <IconButton onClick={() => setOpenDrawer(false)}><CloseIcon /></IconButton>
        </Stack>
        <Typography variant="body2" color="#64748b" mb={4}>Configure your discount rules for the fleet services.</Typography>
        
        <Stack spacing={4}>
          <Box>
            <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>Coupon Code</Typography>
            <TextField 
              fullWidth 
              size="small" 
              placeholder="WELCOME10" 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value.toUpperCase()})} 
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: 2 } }}
            />
          </Box>

          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>Discount Percentage (%)</Typography>
              <TextField 
                fullWidth 
                type="number" 
                size="small" 
                value={form.percentage} 
                onChange={e => setForm({...form, percentage: Number(e.target.value)})}
                InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: 2 } }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>Usage Limit (Total)</Typography>
              <TextField 
                fullWidth 
                type="number" 
                size="small" 
                value={form.usageLimit} 
                onChange={e => setForm({...form, usageLimit: Number(e.target.value)})}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: 2 } }}
              />
              <Typography variant="caption" color="#94a3b8">Maximum number of times this coupon can be used</Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>Tariff Scope</Typography>
              <TextField 
                select 
                fullWidth 
                size="small" 
                value={form.tariffScope} 
                onChange={e => setForm({...form, tariffScope: e.target.value})}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: 2 } }}
              >
                <MenuItem value="all">All Tariffs</MenuItem>
                <MenuItem value="oneway">One Way</MenuItem>
                <MenuItem value="roundtrip">Round Trip</MenuItem>
                <MenuItem value="packages">Packages</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>Vehicle Scope</Typography>
              <TextField 
                select 
                fullWidth 
                size="small" 
                value={form.vehicleScope} 
                onChange={e => setForm({...form, vehicleScope: e.target.value})}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: 2 } }}
              >
                <MenuItem value="all">All Vehicles</MenuItem>
                <MenuItem value="specific">Specific Vehicles</MenuItem>
              </TextField>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>Start Date</Typography>
              <TextField 
                type="date" 
                fullWidth 
                size="small" 
                value={form.startDate} 
                onChange={e => setForm({...form, startDate: e.target.value})}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: 2 } }}
                InputProps={{ startAdornment: <InputAdornment position="start"><CalendarTodayIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment> }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>Expiry Date</Typography>
              <TextField 
                type="date" 
                fullWidth 
                size="small" 
                value={form.expiryDate} 
                onChange={e => setForm({...form, expiryDate: e.target.value})}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: 2 } }}
                InputProps={{ startAdornment: <InputAdornment position="start"><CalendarTodayIcon fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment> }}
              />
            </Box>
          </Stack>

          <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="subtitle2" fontWeight={800}>Coupon Status</Typography>
                <Typography variant="caption" color="#64748b">Decide if this coupon is immediately redeemable</Typography>
              </Box>
              <FormControlLabel
                control={<Switch checked={form.active} onChange={e => setForm({...form, active: e.target.checked})} color="primary" />}
                label={form.active ? "Active" : "Inactive"}
                labelPlacement="start"
                sx={{ m: 0, '& .MuiTypography-root': { fontWeight: 700, fontSize: 12, mr: 1 } }}
              />
            </Stack>
          </Paper>

          <Button 
            variant="contained" 
            fullWidth 
            onClick={handleSave}
            disabled={loading}
            sx={{ bgcolor: '#0f172a', py: 1.5, borderRadius: 2, fontWeight: 800, textTransform: 'none', mt: 4 }}
          >
            {loading ? 'Processing...' : 'Save Coupon'}
          </Button>
        </Stack>
      </Drawer>

    </Box>
  )
}

// Helper components
function Avatar({ children, sx, ...props }: any) {
  return (
    <Box 
      sx={{ 
        width: 40, 
        height: 40, 
        borderRadius: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        ...sx 
      }} 
      {...props}
    >
      {children}
    </Box>
  )
}
