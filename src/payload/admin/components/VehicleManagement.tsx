'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Stack,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Drawer,
  TextField,
  MenuItem,
  IconButton,
  Divider,
  InputAdornment,
  Avatar,
  LinearProgress,
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import ViewListIcon from '@mui/icons-material/ViewList'

type VehicleStatus = 'available' | 'not_available' | 'driving'

type Vehicle = {
  id: string
  name: string
  number: string
  seatCount?: number
  ownerName: string
  driver?: any
  status: VehicleStatus
  lastFc: string
  category: string
  image?: any
  icon?: any
}

type Driver = {
  id: string
  name: string
}

const statusColors: Record<string, { bg: string; color: string }> = {
  available: { bg: '#e0f2f1', color: '#00695c' },
  not_available: { bg: '#ffebee', color: '#c62828' },
  driving: { bg: '#e3f2fd', color: '#1565c0' },
}

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const [form, setForm] = useState<Partial<Vehicle>>({
    name: '',
    number: '',
    seatCount: 4,
    ownerName: '',
    driver: '',
    status: 'available',
    lastFc: '',
    category: 'tariff',
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [iconFile, setIconFile] = useState<File | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [vRes, dRes] = await Promise.all([
        fetch('/api/vehicles?limit=100&depth=2'),
        fetch('/api/drivers?limit=100&depth=1'),
      ])
      const vData = await vRes.json()
      const dData = await dRes.json()
      if (vData.docs) setVehicles(vData.docs)
      if (dData.docs) setDrivers(dData.docs.map((d: any) => ({ id: d.id, name: d.name || 'Unknown' })))
    } catch (e) {
      console.error('Error fetching data', e)
    }
  }

  const handleEdit = (v: Vehicle) => {
    setEditingId(v.id)
    setForm({
      name: v.name,
      number: v.number,
      seatCount: v.seatCount,
      ownerName: v.ownerName,
      driver: typeof v.driver === 'object' ? v.driver?.id : v.driver,
      status: v.status,
      lastFc: v.lastFc ? new Date(v.lastFc).toISOString().split('T')[0] : '',
      category: v.category,
      image: v.image,
      icon: v.icon,
    })
    setImageFile(null)
    setIconFile(null)
    setOpen(true)
  }

  const handleSave = async () => {
    try {
      let imageId = typeof form.image === 'object' ? form.image?.id : form.image
      if (imageFile) {
        const formData = new FormData()
        formData.append('file', imageFile)
        formData.append('_payload', JSON.stringify({
          alt: form.name || 'Vehicle Image',
          title: `Vehicle - ${form.name || 'Unknown'}`,
          category: 'vehicles',
          ...(editingId ? { sourceId: editingId } : {}),
        }))
        const res = await fetch('/api/media', { 
          method: 'POST', 
          body: formData,
          credentials: 'include'
        })
        if (res.ok) {
          const data = await res.json()
          imageId = data.doc.id
        } else {
          const errText = await res.text()
          alert('Image upload failed: ' + errText)
        }
      }

      let iconId = typeof form.icon === 'object' ? form.icon?.id : form.icon
      if (iconFile) {
        const formData = new FormData()
        formData.append('file', iconFile)
        formData.append('_payload', JSON.stringify({
          alt: form.name || 'Vehicle Icon',
          title: `Vehicle Icon - ${form.name || 'Unknown'}`,
          category: 'vehicles',
          ...(editingId ? { sourceId: editingId } : {}),
        }))
        const res = await fetch('/api/media', { 
          method: 'POST', 
          body: formData,
          credentials: 'include'
        })
        if (res.ok) {
          const data = await res.json()
          iconId = data.doc.id
        } else {
          const errText = await res.text()
          alert('Icon upload failed: ' + errText)
        }
      }

      const payload = {
        name: form.name,
        number: form.number,
        seatCount: Number(form.seatCount),
        ownerName: form.ownerName,
        driver: form.driver || null,
        status: form.status,
        lastFc: form.lastFc ? new Date(form.lastFc).toISOString() : undefined,
        category: form.category,
        image: imageId,
        icon: iconId,
      }

      const url = editingId ? `/api/vehicles/${editingId}` : '/api/vehicles'
      const method = editingId ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        alert('Error saving vehicle: ' + JSON.stringify(err))
        return
      }

      alert(`Vehicle ${editingId ? 'updated' : 'created'} successfully!`)
      setOpen(false)
      fetchData()
    } catch (e) {
      console.error(e)
      alert('Error saving vehicle')
    }
  }

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const matchSearch = (v.name + v.number).toLowerCase().includes(searchTerm.toLowerCase())
      const matchStatus = filterStatus === 'all' || v.status === filterStatus
      return matchSearch && matchStatus
    })
  }, [vehicles, searchTerm, filterStatus])

  return (
    <Box sx={{ p: 4, bgcolor: '#f4f6f8', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5" fontWeight={800} color="#111827" letterSpacing="-0.5px">
          VEHICLE COLLECTION
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ bgcolor: '#0f172a', color: '#fff', textTransform: 'none', fontWeight: 600, px: 3, borderRadius: 2 }}
          onClick={() => {
            setEditingId(null)
            setForm({
              name: '',
              number: '',
              seatCount: 4,
              ownerName: '',
              driver: '',
              status: 'available',
              lastFc: '',
              category: 'tariff',
            })
            setImageFile(null)
            setIconFile(null)
            setOpen(true)
          }}
        >
          VEHICLE REGISTRY
        </Button>
      </Stack>

      {/* SEARCH & FILTERS */}
      <Paper sx={{ p: 2, mb: 4, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <TextField
          size="small"
          placeholder="Search by vehicle name, plate or driver..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, '& fieldset': { borderRadius: 2 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        
        <Button variant="outlined" startIcon={<FilterListIcon />} sx={{ textTransform: 'none', color: '#333', borderColor: '#e5e7eb' }}>
          Filters
        </Button>

        <Divider orientation="vertical" flexItem />
        
        <Typography variant="body2" color="text.secondary" mr={1}>Status:</Typography>
        <Stack direction="row" spacing={1}>
          {['all', 'available', 'driving', 'not_available'].map((s) => (
            <Chip
              key={s}
              label={s === 'all' ? 'All' : s === 'not_available' ? 'Maintenance' : s.charAt(0).toUpperCase() + s.slice(1)}
              onClick={() => setFilterStatus(s)}
              sx={{
                bgcolor: filterStatus === s ? (statusColors[s]?.bg || '#e2e8f0') : '#f8fafc',
                color: filterStatus === s ? (statusColors[s]?.color || '#0f172a') : '#64748b',
                fontWeight: 600,
                border: '1px solid',
                borderColor: filterStatus === s ? 'transparent' : '#e2e8f0',
                cursor: 'pointer'
              }}
            />
          ))}
        </Stack>

        <Box sx={{ flexGrow: 1 }} />
        
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, newMode) => { if (newMode) setViewMode(newMode) }}
          size="small"
        >
          <ToggleButton value="grid">
            <ViewModuleIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="list">
            <ViewListIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>

      {/* CARDS GRID */}
      {viewMode === 'grid' ? (
      <Grid container spacing={3} mb={4}>
        {filteredVehicles.map((v) => (
          <Grid size={{ xs: 12, md: 4 }} key={v.id}>
            <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', height: '100%' }}>
              <Box sx={{ 
                  height: 180, 
                  bgcolor: '#e2e8f0', 
                  backgroundImage: v.image?.url ? `url(${v.image.url})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}>
                <Chip 
                  label={v.status === 'not_available' ? 'Maintenance' : v.status} 
                  size="small" 
                  sx={{ position: 'absolute', top: 12, left: 12, bgcolor: statusColors[v.status]?.bg, color: statusColors[v.status]?.color, fontWeight: 700, fontSize: 10 }} 
                />
                <Chip 
                  label={v.category.toUpperCase()} 
                  size="small" 
                  sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.9)', color: '#333', fontWeight: 700, fontSize: 10 }} 
                />
              </Box>
              <Box sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="h6" fontWeight={700} color="#111827" sx={{ lineHeight: 1.2, mb: 0.5 }}>{v.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{v.number}</Typography>
                  </Box>
                  <IconButton size="small" onClick={() => handleEdit(v)} sx={{ bgcolor: '#f8fafc', border: '1px solid #e2e8f0', '&:hover': { bgcolor: '#f1f5f9' } }}>
                    <EditIcon fontSize="small" sx={{ color: '#64748b' }} />
                  </IconButton>
                </Stack>
                
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#f1f5f9', color: '#64748b' }}>
                      {typeof v.driver === 'object' && v.driver?.name ? v.driver.name.charAt(0) : <DirectionsCarIcon />}
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ lineHeight: 1 }}>Assigned Driver</Typography>
                      <Typography variant="body2" fontWeight={600}>{typeof v.driver === 'object' ? v.driver?.name : 'Unassigned'}</Typography>
                    </Box>
                  </Stack>
                  <Box sx={{ width: 60 }}>
                    <Typography variant="caption" color="text.secondary" display="block" textAlign="right">Fuel</Typography>
                    <LinearProgress variant="determinate" value={v.status === 'available' ? 85 : 42} sx={{ height: 4, borderRadius: 2, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: v.status === 'available' ? '#10b981' : '#f59e0b' } }} />
                  </Box>
                </Stack>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      ) : (
      <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight={600} color="#334155">Fleet Inventory Summary</Typography>
          <Typography variant="body2" color="text.secondary">Showing {filteredVehicles.length} vehicles</Typography>
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ color: '#64748b', fontWeight: 600, fontSize: 12 }}>VEHICLE DETAILS</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 600, fontSize: 12 }}>ASSIGNED DRIVER</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 600, fontSize: 12 }}>STATUS</TableCell>
                <TableCell sx={{ color: '#64748b', fontWeight: 600, fontSize: 12 }}>CATEGORY</TableCell>
                <TableCell align="right" sx={{ color: '#64748b', fontWeight: 600, fontSize: 12 }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVehicles.map((v) => (
                <TableRow key={v.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={v.image?.url} variant="rounded" sx={{ width: 40, height: 40, bgcolor: '#e2e8f0' }}>
                        <DirectionsCarIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{v.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{v.number}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ width: 28, height: 28, bgcolor: '#f1f5f9', color: '#64748b', fontSize: 14 }}>
                        {typeof v.driver === 'object' && v.driver?.name ? v.driver.name.charAt(0) : '?'}
                      </Avatar>
                      <Typography variant="body2" fontWeight={500}>
                        {typeof v.driver === 'object' ? v.driver?.name : 'Unassigned'}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={v.status === 'not_available' ? 'MAINTENANCE' : v.status.toUpperCase()} 
                      size="small"
                      sx={{ bgcolor: statusColors[v.status]?.bg, color: statusColors[v.status]?.color, fontWeight: 700, fontSize: 10, borderRadius: 1 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{v.category.charAt(0).toUpperCase() + v.category.slice(1)}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleEdit(v)}>
                      <EditIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      )}

      {/* DRAWER FORM */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: { xs: '100%', md: 800 }, bgcolor: '#f8fafc' } }}>
        <Box sx={{ p: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Box>
              <Typography variant="caption" color="text.secondary">Fleet Overview &gt; {editingId ? 'Edit Vehicle' : 'Add New Vehicle'}</Typography>
              <Typography variant="h5" fontWeight={800} color="#0f172a" mt={1}>
                {editingId ? 'Edit Vehicle' : 'Add New Vehicle'}
              </Typography>
            </Box>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Grid container spacing={3} mt={2}>
            
            {/* LEFT COLUMN */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={3}>
                
                {/* Vehicle Identification */}
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <Typography variant="subtitle1" fontWeight={700} mb={3} display="flex" alignItems="center" gap={1}>
                    <DirectionsCarIcon fontSize="small" color="action" /> Vehicle Identification
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" fontWeight={600} color="#475569" mb={1} display="block">VEHICLE NAME</Typography>
                      <TextField size="small" fullWidth placeholder="e.g. Heavy Duty Transporter" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" fontWeight={600} color="#475569" mb={1} display="block">VEHICLE NUMBER</Typography>
                      <TextField size="small" fullWidth placeholder="FL-2024-X9" value={form.number} onChange={e => setForm({...form, number: e.target.value})} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" fontWeight={600} color="#475569" mb={1} display="block">SEAT COUNT</Typography>
                      <TextField type="number" size="small" fullWidth value={form.seatCount} onChange={e => setForm({...form, seatCount: Number(e.target.value)})} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" fontWeight={600} color="#475569" mb={1} display="block">OWNER NAME</Typography>
                      <TextField size="small" fullWidth placeholder="Fleet Services Corp" value={form.ownerName} onChange={e => setForm({...form, ownerName: e.target.value})} />
                    </Grid>
                  </Grid>
                </Paper>

                {/* Vehicle Imagery */}
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <Typography variant="subtitle1" fontWeight={700} mb={3} display="flex" alignItems="center" gap={1}>
                    <CloudUploadIcon fontSize="small" color="action" /> Vehicle Imagery
                  </Typography>
                  <Grid container spacing={4}>
                    <Grid size={{ xs: 12, sm: 7 }}>
                      <Typography variant="caption" fontWeight={600} color="#475569" mb={1} display="block">VEHICLE IMAGE</Typography>
                      <Box sx={{ border: '2px dashed #cbd5e1', borderRadius: 2, p: 3, textAlign: 'center', bgcolor: '#f8fafc', mb: 2 }}>
                         <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} style={{ display: 'none' }} id="upload-image" />
                         <label htmlFor="upload-image">
                           <Button component="span" startIcon={<CloudUploadIcon />} color="inherit" sx={{ textTransform: 'none' }}>
                             {imageFile ? imageFile.name : (form.image?.url ? 'Change Existing Image' : 'Click to browse')}
                           </Button>
                         </label>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 5 }}>
                      <Typography variant="caption" fontWeight={600} color="#475569" mb={1} display="block">APP ICON</Typography>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ width: 80, height: 80, bgcolor: '#f1f5f9', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <DirectionsCarIcon color="action" />
                        </Box>
                        <Box>
                          <input type="file" accept="image/*" onChange={(e) => setIconFile(e.target.files?.[0] || null)} style={{ display: 'none' }} id="upload-icon" />
                          <label htmlFor="upload-icon">
                            <Button component="span" variant="contained" size="small" sx={{ bgcolor: '#0f172a', color: '#fff', textTransform: 'none', mb: 1 }}>
                              Change Icon
                            </Button>
                          </label>
                          <Typography variant="caption" color="text.secondary" display="block">SVG or PNG, max 100x100px</Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Compliance & Safety */}
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <Typography variant="subtitle1" fontWeight={700} mb={3} display="flex" alignItems="center" gap={1}>
                    <CloudUploadIcon fontSize="small" color="action" /> Compliance & Safety
                  </Typography>
                  <Typography variant="caption" fontWeight={600} color="#475569" mb={1} display="block">LAST FC (FITNESS CERTIFICATE)</Typography>
                  <TextField type="date" size="small" fullWidth value={form.lastFc} onChange={e => setForm({...form, lastFc: e.target.value})} sx={{ maxWidth: 300 }} />
                </Paper>

              </Stack>
            </Grid>

            {/* RIGHT COLUMN */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={3}>
                
                {/* Status & Assignment */}
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <Typography variant="subtitle1" fontWeight={700} mb={3} display="flex" alignItems="center" gap={1}>
                    <CloudUploadIcon fontSize="small" color="action" /> Status & Assignment
                  </Typography>
                  
                  <Typography variant="caption" fontWeight={600} color="#475569" mb={1} display="block">STATUS</Typography>
                  <TextField select size="small" fullWidth value={form.status} onChange={e => setForm({...form, status: e.target.value as VehicleStatus})} sx={{ mb: 3 }}>
                    <MenuItem value="available">Available</MenuItem>
                    <MenuItem value="not_available">Maintenance</MenuItem>
                    <MenuItem value="driving">Driving</MenuItem>
                  </TextField>

                  <Typography variant="caption" fontWeight={600} color="#475569" mb={1} display="block">ASSIGN DRIVER</Typography>
                  <TextField select size="small" fullWidth value={form.driver} onChange={e => setForm({...form, driver: e.target.value})} sx={{ mb: 1 }}>
                    <MenuItem value=""><em>Unassigned</em></MenuItem>
                    {drivers.map(d => (
                      <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                    ))}
                  </TextField>
                  <Typography variant="caption" color="text.secondary">Each driver can be assigned to only one vehicle.</Typography>
                </Paper>

                {/* Classification */}
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <Typography variant="subtitle1" fontWeight={700} mb={3} display="flex" alignItems="center" gap={1}>
                    <CloudUploadIcon fontSize="small" color="action" /> Classification
                  </Typography>
                  
                  <Typography variant="caption" fontWeight={600} color="#475569" mb={1} display="block">VEHICLE CATEGORY</Typography>
                  <TextField select size="small" fullWidth value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    <MenuItem value="tariff">Tariff</MenuItem>
                    <MenuItem value="attachment">Attachment</MenuItem>
                  </TextField>
                </Paper>

                {/* Actions */}
                <Button variant="contained" fullWidth size="large" onClick={handleSave} sx={{ bgcolor: '#0f172a', color: '#fff', py: 1.5, fontWeight: 700, textTransform: 'none' }}>
                  Save Vehicle
                </Button>
                <Button variant="outlined" fullWidth size="large" onClick={() => setOpen(false)} sx={{ color: '#475569', borderColor: '#cbd5e1', py: 1.5, fontWeight: 700, textTransform: 'none' }}>
                  Discard Changes
                </Button>

              </Stack>
            </Grid>

          </Grid>
        </Box>
      </Drawer>

    </Box>
  )
}
