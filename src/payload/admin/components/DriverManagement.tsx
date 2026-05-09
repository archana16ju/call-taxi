'use client'

import React, { useEffect, useMemo, useState, useCallback } from 'react'
import {
  Box,
  Typography,
  Button,
  Drawer,
  Paper,
  TextField,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  IconButton,
  Chip,
  Checkbox,
  Pagination,
  Menu
} from '@mui/material'

import PersonAddIcon from '@mui/icons-material/PersonAdd'
import EditIcon from '@mui/icons-material/Edit'
import FilterListIcon from '@mui/icons-material/FilterList'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import AssessmentIcon from '@mui/icons-material/Assessment'
import GroupIcon from '@mui/icons-material/Group'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import Avatar from '@mui/material/Avatar'
import { Grid } from '@mui/material'


// ---------------- TYPES ----------------
type Driver = {
  id?: string
  name: string
  phone: string
  address: string
  experience: number | ''
  aadharNo: string
  panNo: string
  license: string
  status: string
  profilePic?: string 
  photo?: any
}

// ---------------- DRIVER FORM ----------------
function DriverForm({
  driverId,
  onSuccess,
}: {
  driverId?: string | null
  onSuccess?: () => void
}) {
  const isEdit = Boolean(driverId)

  const [form, setForm] = useState<Driver>({
    name: '',
    phone: '',
    address: '',
    experience: '',
    aadharNo: '',
    panNo: '',
    license: '',
    status: 'available',
    profilePic: '',
    photo: null,
  })

  const [loading, setLoading] = useState(false)
  const [imgLoading, setImgLoading] = useState(false)
  const [preview, setPreview] = useState<string>('')

  useEffect(() => {
    if (!driverId) return

    fetch(`/api/drivers/${driverId}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          name: data.name || '',
          phone: data.phone || '',
          address: data.address || '',
          experience: data.experience ?? '',
          aadharNo: data.aadharNo || '',
          panNo: data.panNo || '',
          license: data.license || '',
          status: data.status || 'available',
          profilePic: typeof data.photo === 'object' ? data.photo?.url : '',
          photo: typeof data.photo === 'object' ? data.photo?.id : data.photo,
        })
      })
  }, [driverId])

  const handleChange = (k: keyof Driver, v: any) => {
    setForm((p) => ({ ...p, [k]: v }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImgLoading(true)
    const previewUrl = URL.createObjectURL(file)
    setPreview(previewUrl)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('_payload', JSON.stringify({
        alt: form.name || 'Driver Photo',
        title: `Driver - ${form.name || 'Unknown'}`,
        category: 'drivers',
        ...(driverId ? { sourceId: driverId } : {}),
      }))

      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (!res.ok) {
        let errorMsg = 'Upload failed';
        try {
          const errorData = await res.json();
          console.error('Upload error details (JSON):', errorData);
          errorMsg = errorData.errors?.[0]?.message || errorMsg;
        } catch (e) {
          const errorText = await res.text();
          console.error('Upload error details (Text):', errorText);
          errorMsg = errorText || errorMsg;
        }
        throw new Error(errorMsg);
      }
      
      const data = await res.json()

      setForm((prev) => ({
        ...prev,
        profilePic: data.doc?.url,
        photo: data.doc?.id,
      }))
    } catch (err) {
      console.error(err)
      alert('Failed to upload image')
    } finally {
      setImgLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.address || form.experience === '') {
      alert('Please fill all required fields')
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...form,
        experience: Number(form.experience),
        photo: form.photo,
      }

      const res = await fetch(isEdit ? `/api/drivers/${driverId}` : '/api/drivers', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.errors?.[0]?.message || 'Failed to save driver')
      }

      onSuccess?.()
    } catch (err: any) {
      console.error(err)
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ p: 1 }}>
      {/* PROFILE PIC SECTION */}
      <Stack alignItems="center" spacing={2} mb={4}>
        <Box sx={{ position: 'relative' }}>
          <Avatar 
            src={form.profilePic || preview} 
            sx={{ 
              width: 140, 
              height: 140, 
              bgcolor: '#f1f5f9',
              border: '2px dashed #cbd5e1'
            }} 
          >
            {!form.profilePic && !preview && <GroupIcon sx={{ fontSize: 60, color: '#94a3b8' }} />}
          </Avatar>
          {imgLoading && (
            <CircularProgress 
              size={140} 
              sx={{ position: 'absolute', top: 0, left: 0, color: '#3b82f6' }} 
            />
          )}
        </Box>

        <Button 
          variant="outlined" 
          component="label" 
          sx={{ 
            textTransform: 'none', 
            borderRadius: 2, 
            px: 3,
            borderColor: '#3b82f6',
            color: '#3b82f6',
            fontWeight: 600
          }}
        >
          UPLOAD IMAGE
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageUpload}
          />
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Grid>

        <Grid size={{ xs: 6 }}>
          <TextField
            fullWidth
            label="Phone"
            variant="outlined"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Grid>

        <Grid size={{ xs: 6 }}>
          <TextField
            fullWidth
            label="Experience (Years)"
            type="number"
            variant="outlined"
            value={form.experience}
            onChange={(e) => handleChange('experience', e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Address"
            multiline
            rows={3}
            variant="outlined"
            value={form.address}
            onChange={(e) => handleChange('address', e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Grid>

        <Grid size={{ xs: 6 }}>
          <TextField
            fullWidth
            label="Aadhar No"
            variant="outlined"
            value={form.aadharNo}
            onChange={(e) => handleChange('aadharNo', e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Grid>

        <Grid size={{ xs: 6 }}>
          <TextField
            fullWidth
            label="PAN No"
            variant="outlined"
            value={form.panNo}
            onChange={(e) => handleChange('panNo', e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Driving License No"
            variant="outlined"
            value={form.license}
            onChange={(e) => handleChange('license', e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Status</InputLabel>
            <Select
              value={form.status}
              label="Status"
              onChange={(e) => handleChange('status', e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="onduty">On Duty</MenuItem>
              <MenuItem value="not_available">Not Available</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Stack direction="row" justifyContent="stretch" mt={5}>
        <Button 
          variant="contained" 
          fullWidth
          onClick={handleSubmit}
          disabled={loading || imgLoading}
          sx={{ 
            bgcolor: '#0f172a', 
            color: '#fff', 
            py: 1.5, 
            borderRadius: 2,
            fontWeight: 800,
            textTransform: 'none',
            fontSize: '1rem',
            '&:hover': { bgcolor: '#1e293b' }
          }}
        >
          {loading ? 'Processing...' : isEdit ? 'Update Driver Profile' : 'Save Driver Details'}
        </Button>
      </Stack>
    </Box>
  )
}

// ---------------- MAIN ----------------
export default function DriverManagement() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const [page, setPage] = useState(1)
  const [perPage] = useState(10)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')

  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null)
  const [columnAnchor, setColumnAnchor] = useState<null | HTMLElement>(null)

  const [columns, setColumns] = useState([
    'name',
    'phone',
    'experience',
    'status',
    'actions',
  ])

  const fetchDrivers = useCallback(async () => {
    const res = await fetch('/api/drivers?limit=100&depth=1')
    const data = await res.json()
    setDrivers(data.docs?.map((d: any) => ({
      ...d,
      profilePic: typeof d.photo === 'object' ? d.photo?.url : '',
    })) || [])
  }, [])

  useEffect(() => {
    fetchDrivers()
  }, [fetchDrivers])

  const stats = useMemo(() => {
    const total = drivers.length || 1
    return {
      total: drivers.length,
      active: drivers.filter((d) => d.status === 'available').length,
      onduty: drivers.filter((d) => d.status === 'onduty').length,
    }
  }, [drivers])

  const openCreate = () => {
    setEditId(null)
    setOpen(true)
  }

  const openEdit = (id: string) => {
    setEditId(id)
    setOpen(true)
  }

  const handleTrack = (driver: Driver) => {
  console.log("Track:", driver)
  alert(`Tracking ${driver.name}`)
}

const handleAssign = (driver: Driver) => {
  console.log("Assign:", driver)
  alert(`Assigning ride to ${driver.name}`)
}

const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'ONDUTY'>('ALL');

const filteredDrivers = useMemo(() => {
  if (filter === 'ALL') return drivers;

  if (filter === 'ACTIVE') {
    return drivers.filter((d) => d.status === 'available');
  }

  if (filter === 'ONDUTY') {
    return drivers.filter((d) => d.status === 'onduty');
  }

  return drivers;
}, [drivers, filter]);

  return (
    <Box sx={{ p: 3 }}>
      

      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" mb={3}>
  <Box>
    <Typography variant="h5" fontWeight={600}>
      Driver Management
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Managing {drivers.length} active drivers
    </Typography>
  </Box>

  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
  <Button
    variant={filter === 'ALL' ? 'contained' : 'outlined'}
    onClick={() => setFilter('ALL')}
  >
    All Drivers
  </Button>

  <Button
    variant={filter === 'ACTIVE' ? 'contained' : 'outlined'}
    color="success"
    onClick={() => setFilter('ACTIVE')}
  >
    Active
  </Button>

  <Button
    variant={filter === 'ONDUTY' ? 'contained' : 'outlined'}
    color="warning"
    onClick={() => setFilter('ONDUTY')}
  >
    On Duty
  </Button>

    <Button variant="contained" onClick={openCreate}>
      + Create New Driver
    </Button>
  </Stack>
</Stack>

      {/* STATS */}
     <Grid container spacing={2} mb={3}>
  <Grid size={4}>
    <Paper sx={{ p: 2, borderRadius: 3 }}>
      <Typography variant="caption">TOTAL DRIVERS</Typography>
      <Typography variant="h5">{stats.total}</Typography>
    </Paper>
  </Grid>

  <Grid size={4}>
    <Paper sx={{ p: 2, borderRadius: 3 }}>
      <Typography variant="caption">CURRENTLY ON DUTY</Typography>
      <Typography variant="h5">{stats.onduty}</Typography>
    </Paper>
  </Grid>

  <Grid size={4}>
    <Paper sx={{ p: 2, borderRadius: 3 }}>
      <Typography variant="caption">AVG. EXPERIENCE</Typography>
      <Typography variant="h5">
        {Math.round(
          drivers.reduce((a, b) => a + Number(b.experience || 0), 0) /
            (drivers.length || 1)
        )}{' '}
        yrs
      </Typography>
    </Paper>
  </Grid>
</Grid>

      {/* FILTERS */}
      <Stack direction="row" spacing={5} mb={5}>
        <TextField
          id="search-drivers"
          size="small"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Stack>

      {/* DRIVER CARDS (REPLACE TABLE) */}
     <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>

  <Box
  sx={{
    bgcolor: '#f5f7fb',
    borderRadius: 3,
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  }}
>
  {/* HEADER */}
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: '2fr 1.2fr 2fr 2fr 1fr 1fr',
      px: 3,
      py: 1.5,
      bgcolor:  '#3b82f6',
      color: '#fff',
      fontWeight: 600,
      position: 'sticky',
      top: 0,
      zIndex: 2,
    }}
  >
    <Box>Driver</Box>
    <Box>Phone</Box>
    <Box>Identity</Box>
    <Box>License</Box>
    <Box>Status</Box>
    <Box>Action</Box>
  </Box>

  {/* ROWS */}
{filteredDrivers.map((d, index) => (
      <Box
      key={d.id || d.phone}
      sx={{
        display: 'grid',
        gridTemplateColumns: '2fr 1.2fr 2fr 2fr 1fr 1fr',
        px: 3,
        py: 2,
        alignItems: 'center',
        bgcolor: index % 2 === 0 ? '#fff' : '#f9fafb',
        transition: 'all 0.2s ease',
        borderBottom: '1px solid #eee',
        '&:hover': {
          transform: 'scale(1.01)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          bgcolor: '#ffffff',
        },
      }}
    >
      {/* DRIVER */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          src={d.profilePic}
          sx={{
            width: 42,
            height: 42,
            border: '2px solid #e5e7eb',
          }}
        />
        <Box>
          <Typography fontWeight={700}>{d.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            ID: {d.id || 'N/A'}
          </Typography>
        </Box>
      </Stack>

      {/* PHONE */}
      <Typography fontWeight={500}>{d.phone || '-'}</Typography>

      {/* IDENTITY */}
      <Box>
        <Typography variant="body2">
          Aadhar: <b>{d.aadharNo || '-'}</b>
        </Typography>
        <Typography variant="body2">
          PAN: <b>{d.panNo || '-'}</b>
        </Typography>
      </Box>

      {/* LICENSE */}
      <Box>
        <Typography fontWeight={500}>{d.license || '-'}</Typography>
        <Typography variant="caption" color="text.secondary">
          {d.experience || 0} yrs exp
        </Typography>
      </Box>

      {/* STATUS */}
      <Chip
        label={d.status}
        size="small"
        sx={{
          fontWeight: 700,
          color: '#fff',
          bgcolor:
            d.status === 'available'
              ? '#16a34a'
              : d.status === 'onduty'
              ? '#f59e0b'
              : '#ef4444',
          boxShadow:
            d.status === 'available'
              ? '0 0 10px rgba(34,197,94,0.4)'
              : d.status === 'onduty'
              ? '0 0 10px rgba(245,158,11,0.4)'
              : '0 0 10px rgba(239,68,68,0.4)',
        }}
      />

      {/* ACTIONS */}
      <Stack direction="row" spacing={1}>
        <IconButton
          sx={{
            bgcolor: '#eef2ff',
            '&:hover': { bgcolor: '#e0e7ff' },
          }}
          onClick={() => openEdit(d.id!)}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Box>
  ))}
</Box>

</Paper>

      {/* DRAWER */}
      <Drawer open={open} onClose={() => setOpen(false)} anchor="right">
        <Box sx={{ width: 450, p: 2 }}>
          <Typography variant="h6" mb={2}>
            {editId ? 'Edit Driver' : 'Create Driver'}
          </Typography>
          <DriverForm driverId={editId} onSuccess={() => {
            setOpen(false)
            fetchDrivers()
          }} />
        </Box>
      </Drawer>

      {/* FILTER MENU */}
      <Menu anchorEl={filterAnchor} open={Boolean(filterAnchor)} onClose={() => setFilterAnchor(null)}>
        {['all', 'available', 'onduty', 'not_available'].map((s) => (
          <MenuItem key={s} onClick={() => {
  if (s === 'all') setFilter('ALL')
  else if (s === 'available') setFilter('ACTIVE')
  else if (s === 'onduty') setFilter('ONDUTY')
  setFilterAnchor(null)
}}>
  {s}
</MenuItem>
        ))}
      </Menu>

      {/* COLUMN MENU */}
      <Menu anchorEl={columnAnchor} open={Boolean(columnAnchor)} onClose={() => setColumnAnchor(null)}>
        {['name', 'phone', 'experience', 'status', 'actions'].map((c) => (
          <MenuItem key={c}>
            <Checkbox
              checked={columns.includes(c)}
              onChange={() =>
                setColumns((p) =>
                  p.includes(c) ? p.filter((x) => x !== c) : [...p, c],
                )
              }
            />
            {c}
          </MenuItem>
        ))}
      </Menu>

    </Box>
  )
}