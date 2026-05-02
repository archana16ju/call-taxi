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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  Drawer,
  Select,
  MenuItem,
  Grid,
  Divider,
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import FilterListIcon from '@mui/icons-material/FilterList'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CloseIcon from '@mui/icons-material/Close'
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi'
import LuxuryIcon from '@mui/icons-material/Diamond'
import EconomyIcon from '@mui/icons-material/DirectionsCar'
import LogisticsIcon from '@mui/icons-material/LocalShipping'
import EVIcon from '@mui/icons-material/EvStation'
import GridViewIcon from '@mui/icons-material/GridView'
import ListIcon from '@mui/icons-material/List'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'

type Tariff = {
  id: string
  name: string
  description?: string
  status: 'active' | 'draft' | 'pending_review'
  vehicleType: any
  oneway: {
    perKmRate: number
    bata: number
    minDistance: number
    extras: number
  }
  roundtrip: {
    perKmRate: number
    bata: number
    minDistance: number
    extras: number
  }
  packages: {
    hours: number
    km: number
    baseRate: number
    baseBata: number
    extraKmRate: number
    extraHourRate: number
    nightBata: number
    otherExtras: number
  }
  updatedAt: string
}

export default function TariffManagement() {
  const [tariffs, setTariffs] = useState<Tariff[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid')
  
  const [openDrawer, setDrawerOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Tariff>>({
    name: '',
    description: '',
    status: 'active',
    vehicleType: '',
    oneway: { perKmRate: 0, bata: 0, minDistance: 130, extras: 0 },
    roundtrip: { perKmRate: 0, bata: 0, minDistance: 250, extras: 0 },
    packages: { hours: 4, km: 40, baseRate: 0, baseBata: 0, extraKmRate: 0, extraHourRate: 0, nightBata: 0, otherExtras: 0 }
  })

  useEffect(() => {
    fetchData()
    fetchVehicles()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/tariffs?limit=100&depth=1')
      const data = await res.json()
      if (data.docs) setTariffs(data.docs)
    } catch (e) { console.error(e) }
  }

  const fetchVehicles = async () => {
    try {
      const res = await fetch('/api/vehicles?limit=100')
      const data = await res.json()
      if (data.docs) setVehicles(data.docs)
    } catch (e) { console.error(e) }
  }

  const handleEdit = (t: Tariff) => {
    setEditingId(t.id)
    setForm({
      name: t.name,
      description: t.description || '',
      status: t.status,
      vehicleType: typeof t.vehicleType === 'object' ? t.vehicleType.id : t.vehicleType,
      oneway: { ...t.oneway },
      roundtrip: { ...t.roundtrip },
      packages: { ...t.packages }
    })
    setDrawerOpen(true)
  }

  const handleCreate = () => {
    setEditingId(null)
    setForm({
      name: '',
      description: '',
      status: 'active',
      vehicleType: '',
      oneway: { perKmRate: 0, bata: 0, minDistance: 130, extras: 0 },
      roundtrip: { perKmRate: 0, bata: 0, minDistance: 250, extras: 0 },
      packages: { hours: 4, km: 40, baseRate: 0, baseBata: 0, extraKmRate: 0, extraHourRate: 0, nightBata: 0, otherExtras: 0 }
    })
    setDrawerOpen(true)
  }

  const handleSave = async () => {
    try {
      const url = editingId ? `/api/tariffs/${editingId}` : '/api/tariffs'
      const method = editingId ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) {
        const err = await res.json()
        alert('Error saving tariff: ' + JSON.stringify(err))
        return
      }
      setDrawerOpen(false)
      fetchData()
    } catch (e) { console.error(e); alert('Error saving tariff') }
  }

  const filteredTariffs = useMemo(() => {
    return tariffs.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [tariffs, searchTerm])

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'active': return <Chip label="• Active" size="small" sx={{ bgcolor: '#dcfce7', color: '#166534', fontWeight: 700, fontSize: 10, borderRadius: 1 }} />
      case 'pending_review': return <Chip label="• Pending Review" size="small" sx={{ bgcolor: '#fef3c7', color: '#92400e', fontWeight: 700, fontSize: 10, borderRadius: 1 }} />
      case 'draft': return <Chip label="• Draft" size="small" sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 700, fontSize: 10, borderRadius: 1 }} />
      default: return null
    }
  }

  return (
    <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Box>
          <Typography variant="h5" fontWeight={800} color="#0f172a" mb={0.5}>Tariff Management</Typography>
          <Typography variant="body2" color="#64748b">Configure operational rates, regional surcharges, and fleet-specific pricing tiers.</Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <ToggleButtonGroup
            size="small"
            value={viewType}
            exclusive
            onChange={(_, val) => val && setViewType(val)}
            sx={{ bgcolor: '#fff' }}
          >
            <ToggleButton value="grid"><GridViewIcon fontSize="small" /></ToggleButton>
            <ToggleButton value="list"><ListIcon fontSize="small" /></ToggleButton>
          </ToggleButtonGroup>
          <Button variant="outlined" startIcon={<FilterListIcon />} sx={{ bgcolor: '#fff', borderColor: '#e2e8f0', color: '#0f172a', textTransform: 'none', fontWeight: 600 }}>Filter</Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate} sx={{ bgcolor: '#0f172a', color: '#fff', textTransform: 'none', fontWeight: 600, px: 3 }}>Add Tariff</Button>
        </Stack>
      </Stack>

      {/* CONTENT AREA */}
      {viewType === 'grid' ? (
        <Grid container spacing={3}>
          {filteredTariffs.map((t, idx) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={t.id}>
              <Paper 
                sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  border: '1px solid #e2e8f0', 
                  boxShadow: 'none', 
                  position: 'relative',
                  transition: '0.2s',
                  '&:hover': { borderColor: '#3b82f6', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
                  cursor: 'pointer'
                }}
                onClick={() => handleEdit(t)}
              >
                <Box sx={{ position: 'absolute', top: 16, right: 16 }}>{getStatusChip(t.status)}</Box>
                <Avatar sx={{ bgcolor: '#f1f5f9', color: '#0f172a', mb: 2, borderRadius: 1 }}>
                  {t.name.toLowerCase().includes('luxury') ? <LuxuryIcon /> : 
                   t.name.toLowerCase().includes('economy') ? <EconomyIcon /> : 
                   t.name.toLowerCase().includes('heavy') ? <LogisticsIcon /> : <LocalTaxiIcon />}
                </Avatar>
                <Typography variant="subtitle1" fontWeight={700} color="#0f172a">{t.name}</Typography>
                <Typography variant="caption" color="#64748b" display="block" mb={2} sx={{ minHeight: 18 }}>{t.description || 'Standard rate plan'}</Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                  <Typography variant="body2" color="#64748b">Base Rate</Typography>
                  <Typography variant="h6" fontWeight={800} color="#0f172a">
                    ${t.oneway.perKmRate.toFixed(2)}
                    <Typography variant="caption" color="#64748b" sx={{ ml: 0.5 }}>/km</Typography>
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 0, borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
            <Typography variant="subtitle1" fontWeight={700} color="#0f172a">All Tariffs Detail</Typography>
            <TextField
              size="small"
              placeholder="Search tariffs..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
              sx={{ width: 250, '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }}
            />
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: 11 }}>TARIFF NAME</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: 11 }}>VEHICLE TYPE</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: 11 }}>BASE RATE</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: 11 }}>STATUS</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: 11 }}>LAST MODIFIED</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTariffs.map(t => (
                  <TableRow key={t.id} hover sx={{ cursor: 'pointer' }} onClick={() => handleEdit(t)}>
                    <TableCell><Typography variant="body2" fontWeight={600}>{t.name}</Typography></TableCell>
                    <TableCell><Typography variant="body2" color="#64748b">{typeof t.vehicleType === 'object' ? t.vehicleType.name : 'Unknown'}</Typography></TableCell>
                    <TableCell><Typography variant="body2" fontWeight={700}>${t.oneway.perKmRate.toFixed(2)} / km</Typography></TableCell>
                    <TableCell>{getStatusChip(t.status)}</TableCell>
                    <TableCell><Typography variant="body2" color="#64748b">{new Date(t.updatedAt).toLocaleDateString()}</Typography></TableCell>
                    <TableCell align="right">
                      <IconButton size="small"><MoreVertIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* REGISTRY DRAWER */}
      <Drawer anchor="right" open={openDrawer} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: '80%', bgcolor: '#f8fafc' } }}>
        <Box sx={{ p: 4, height: '100%', overflowY: 'auto' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h5" fontWeight={800}>Tariff Management</Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={() => setDrawerOpen(false)} sx={{ bgcolor: '#fff', color: '#0f172a', borderColor: '#e2e8f0', textTransform: 'none', fontWeight: 600 }}>Reset All</Button>
              <Button variant="contained" onClick={handleSave} sx={{ bgcolor: '#0f172a', color: '#fff', textTransform: 'none', fontWeight: 600, px: 4 }}>Save Tariffs</Button>
              <IconButton onClick={() => setDrawerOpen(false)}><CloseIcon /></IconButton>
            </Stack>
          </Stack>

          <Paper sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>TARIFF NAME*</Typography>
                <TextField fullWidth size="small" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Luxury Fleet" />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>STATUS</Typography>
                <TextField select fullWidth size="small" value={form.status} onChange={e => setForm({...form, status: e.target.value as any})}>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="pending_review">Pending Review</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>DESCRIPTION</Typography>
                <TextField fullWidth size="small" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="e.g. Premium sedans & SUVs" />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>SELECT VEHICLE TYPE*</Typography>
                <TextField select fullWidth size="small" value={form.vehicleType} onChange={e => setForm({...form, vehicleType: e.target.value})}>
                  {vehicles.map(v => <MenuItem key={v.id} value={v.id}>{v.name} - {v.number}</MenuItem>)}
                </TextField>
              </Grid>
            </Grid>
          </Paper>

          <Grid container spacing={3} mb={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <Typography variant="subtitle1" fontWeight={700} color="#3b82f6" mb={3}>→ One Way Trip</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>PER KM RATE ($)</Typography>
                    <TextField fullWidth size="small" type="number" value={form.oneway?.perKmRate} onChange={e => setForm({...form, oneway: {...form.oneway!, perKmRate: parseFloat(e.target.value) || 0}})} />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>DRIVER BATA ($)</Typography>
                    <TextField fullWidth size="small" type="number" value={form.oneway?.bata} onChange={e => setForm({...form, oneway: {...form.oneway!, bata: parseFloat(e.target.value) || 0}})} />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>MIN DIST (KM)</Typography>
                    <TextField fullWidth size="small" type="number" value={form.oneway?.minDistance} onChange={e => setForm({...form, oneway: {...form.oneway!, minDistance: parseFloat(e.target.value) || 0}})} />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>EXTRAS/TOLLS ($)</Typography>
                    <TextField fullWidth size="small" type="number" value={form.oneway?.extras} onChange={e => setForm({...form, oneway: {...form.oneway!, extras: parseFloat(e.target.value) || 0}})} />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <Typography variant="subtitle1" fontWeight={700} color="#3b82f6" mb={3}>⇄ Round Trip</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>PER KM RATE ($)</Typography>
                    <TextField fullWidth size="small" type="number" value={form.roundtrip?.perKmRate} onChange={e => setForm({...form, roundtrip: {...form.roundtrip!, perKmRate: parseFloat(e.target.value) || 0}})} />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>DRIVER BATA ($)</Typography>
                    <TextField fullWidth size="small" type="number" value={form.roundtrip?.bata} onChange={e => setForm({...form, roundtrip: {...form.roundtrip!, bata: parseFloat(e.target.value) || 0}})} />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>MIN DIST (KM)</Typography>
                    <TextField fullWidth size="small" type="number" value={form.roundtrip?.minDistance} onChange={e => setForm({...form, roundtrip: {...form.roundtrip!, minDistance: parseFloat(e.target.value) || 0}})} />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>EXTRAS ($)</Typography>
                    <TextField fullWidth size="small" type="number" value={form.roundtrip?.extras} onChange={e => setForm({...form, roundtrip: {...form.roundtrip!, extras: parseFloat(e.target.value) || 0}})} />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          <Paper sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <Typography variant="subtitle1" fontWeight={700} color="#3b82f6" mb={3}>📋 Standard Package</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>PACKAGE HOURS</Typography>
                <TextField fullWidth size="small" type="number" value={form.packages?.hours} onChange={e => setForm({...form, packages: {...form.packages!, hours: parseFloat(e.target.value) || 0}})} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>PACKAGE KM</Typography>
                <TextField fullWidth size="small" type="number" value={form.packages?.km} onChange={e => setForm({...form, packages: {...form.packages!, km: parseFloat(e.target.value) || 0}})} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>BASE RATE ($)</Typography>
                <TextField fullWidth size="small" type="number" value={form.packages?.baseRate} onChange={e => setForm({...form, packages: {...form.packages!, baseRate: parseFloat(e.target.value) || 0}})} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>BASE BATA ($)</Typography>
                <TextField fullWidth size="small" type="number" value={form.packages?.baseBata} onChange={e => setForm({...form, packages: {...form.packages!, baseBata: parseFloat(e.target.value) || 0}})} />
              </Grid>
            </Grid>
          </Paper>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <Typography variant="subtitle1" fontWeight={700} color="#3b82f6" mb={3}>Overage Penalties</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>EXTRA KM RATE ($)</Typography>
                    <TextField fullWidth size="small" type="number" value={form.packages?.extraKmRate} onChange={e => setForm({...form, packages: {...form.packages!, extraKmRate: parseFloat(e.target.value) || 0}})} />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>EXTRA HR RATE ($)</Typography>
                    <TextField fullWidth size="small" type="number" value={form.packages?.extraHourRate} onChange={e => setForm({...form, packages: {...form.packages!, extraHourRate: parseFloat(e.target.value) || 0}})} />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                <Typography variant="subtitle1" fontWeight={700} color="#3b82f6" mb={3}>Special Conditions</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>NIGHT BATA ($)</Typography>
                    <TextField fullWidth size="small" type="number" value={form.packages?.nightBata} onChange={e => setForm({...form, packages: {...form.packages!, nightBata: parseFloat(e.target.value) || 0}})} />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" fontWeight={700} color="#64748b" display="block" mb={1}>OTHER EXTRAS ($)</Typography>
                    <TextField fullWidth size="small" type="number" value={form.packages?.otherExtras} onChange={e => setForm({...form, packages: {...form.packages!, otherExtras: parseFloat(e.target.value) || 0}})} />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>

        </Box>
      </Drawer>
    </Box>
  )
}
