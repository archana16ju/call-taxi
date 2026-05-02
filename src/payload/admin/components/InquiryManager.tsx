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
  MenuItem,
  Grid,
  Divider,
  LinearProgress,
  Tooltip,
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import FilterListIcon from '@mui/icons-material/FilterList'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CloseIcon from '@mui/icons-material/Close'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import InfoIcon from '@mui/icons-material/Info'
import SaveIcon from '@mui/icons-material/Save'

type Inquiry = {
  id: string
  name: string
  phone: string
  inquiryType: 'service' | 'billing' | 'partnership' | 'emergency'
  message: string
  status: 'new' | 'pending' | 'resolved' | 'urgent'
  createdAt: string
}

export default function InquiryManager() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  
  const [openDrawer, setDrawerOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Inquiry>>({
    name: '',
    phone: '',
    inquiryType: 'service',
    message: '',
    status: 'new',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/contacts?limit=100&sort=-createdAt')
      const data = await res.json()
      if (data.docs) setInquiries(data.docs)
    } catch (e) { console.error(e) }
  }

  const handleEdit = (i: Inquiry) => {
    setEditingId(i.id)
    setForm({ ...i })
    setDrawerOpen(true)
  }

  const handleCreate = () => {
    setEditingId(null)
    setForm({
      name: '',
      phone: '',
      inquiryType: 'service',
      message: '',
      status: 'new',
    })
    setDrawerOpen(true)
  }

  const handleSave = async () => {
    try {
      const url = editingId ? `/api/contacts/${editingId}` : '/api/contacts'
      const method = editingId ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) {
        const err = await res.json()
        alert('Error saving inquiry: ' + JSON.stringify(err))
        return
      }
      setDrawerOpen(false)
      fetchData()
    } catch (e) { console.error(e); alert('Error saving inquiry') }
  }

  const filteredInquiries = useMemo(() => {
    return inquiries.filter(i => {
      const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.phone.includes(searchTerm)
      const matchesStatus = statusFilter === 'All Statuses' || i.status === statusFilter.toLowerCase()
      return matchesSearch && matchesStatus
    })
  }, [inquiries, searchTerm, statusFilter])

  const getTypeChip = (type: string) => {
    switch (type) {
      case 'service': return <Chip label="Service Request" size="small" sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 600, fontSize: 10 }} />
      case 'billing': return <Chip label="Billing Inquiry" size="small" sx={{ bgcolor: '#fef3c7', color: '#92400e', fontWeight: 600, fontSize: 10 }} />
      case 'partnership': return <Chip label="Partnership" size="small" sx={{ bgcolor: '#f3e8ff', color: '#7e22ce', fontWeight: 600, fontSize: 10 }} />
      case 'emergency': return <Chip label="Emergency" size="small" sx={{ bgcolor: '#fee2e2', color: '#b91c1c', fontWeight: 600, fontSize: 10 }} />
      default: return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new': return <Typography variant="caption" sx={{ color: '#3b82f6', fontWeight: 700, display: 'flex', alignItems: 'center' }}><Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#3b82f6', mr: 1 }} /> New</Typography>
      case 'pending': return <Typography variant="caption" sx={{ color: '#f59e0b', fontWeight: 700, display: 'flex', alignItems: 'center' }}><Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#f59e0b', mr: 1 }} /> Pending</Typography>
      case 'resolved': return <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center' }}><Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10b981', mr: 1 }} /> Resolved</Typography>
      case 'urgent': return <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 700, display: 'flex', alignItems: 'center' }}><Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#ef4444', mr: 1 }} /> Urgent</Typography>
      default: return null
    }
  }

  return (
    <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h6" fontWeight={800} color="#0f172a">Inquiry Manager</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleCreate}
          sx={{ bgcolor: '#0f172a', color: '#fff', textTransform: 'none', fontWeight: 600, px: 3, borderRadius: 1.5 }}
        >
          Add Contact
        </Button>
      </Stack>

      {/* SEARCH & FILTERS */}
      <Stack direction="row" spacing={2} mb={4} alignItems="center">
        <TextField
          size="small"
          placeholder="Search Inquiries..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          sx={{ width: 400, '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: 2 } }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
        />
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="outlined" startIcon={<FilterListIcon />} sx={{ bgcolor: '#fff', color: '#0f172a', borderColor: '#e2e8f0', textTransform: 'none', borderRadius: 2 }}>Filters</Button>
        <TextField select size="small" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} sx={{ minWidth: 140, '& .MuiOutlinedInput-root': { bgcolor: '#eef2ff', borderRadius: 5, border: 'none', '& fieldset': { border: 'none' } } }}>
          <MenuItem value="All Statuses">All Statuses</MenuItem>
          <MenuItem value="New">New</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Resolved">Resolved</MenuItem>
          <MenuItem value="Urgent">Urgent</MenuItem>
        </TextField>
        <Typography variant="body2" color="#64748b" sx={{ bgcolor: '#fff', p: 1, borderRadius: 2, border: '1px solid #e2e8f0' }}>Last 30 Days</Typography>
      </Stack>

      {/* SUMMARY CARDS */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <Typography variant="caption" fontWeight={700} color="#64748b">TOTAL INQUIRIES</Typography>
            <Typography variant="h3" fontWeight={800} color="#0f172a" my={1}>{inquiries.length.toLocaleString()}</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <TrendingUpIcon sx={{ color: '#3b82f6', fontSize: 16 }} />
              <Typography variant="caption" fontWeight={700} color="#3b82f6">12.5% increase this month</Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 3.5 }}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <Typography variant="caption" fontWeight={700} color="#64748b">RESPONSE RATE</Typography>
            <Typography variant="h3" fontWeight={800} color="#0f172a" my={1}>94.2%</Typography>
            <LinearProgress variant="determinate" value={94.2} sx={{ height: 6, borderRadius: 3, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: '#0f172a' } }} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 3.5 }}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <Typography variant="caption" fontWeight={700} color="#64748b">URGENT TASKS</Typography>
            <Typography variant="h3" fontWeight={800} color="#ef4444" my={1}>{inquiries.filter(i => i.status === 'urgent').length}</Typography>
            <Typography variant="caption" color="#64748b">Requires immediate attention</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* TABLE */}
      <Paper sx={{ p: 0, borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none', mb: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: 11 }}>Customer Name</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: 11 }}>Phone Number</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: 11 }}>Inquiry Type</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: 11 }}>Message Preview</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: 11 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: 11 }} align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInquiries.map((i, idx) => (
                <TableRow key={i.id} hover sx={{ cursor: 'pointer', bgcolor: idx % 2 === 1 ? '#f8fafc' : '#fff' }} onClick={() => handleEdit(i)}>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ width: 32, height: 32, fontSize: 12, fontWeight: 700, bgcolor: ['#e0f2fe', '#fef3c7', '#f3e8ff', '#fee2e2'][idx % 4], color: ['#0369a1', '#92400e', '#7e22ce', '#b91c1c'][idx % 4] }}>
                        {i.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Typography variant="body2" fontWeight={600} color="#0f172a">{i.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell><Typography variant="body2" color="#64748b">{i.phone}</Typography></TableCell>
                  <TableCell>{getTypeChip(i.inquiryType)}</TableCell>
                  <TableCell sx={{ maxWidth: 300 }}><Typography variant="body2" color="#64748b" noWrap>"{i.message}"</Typography></TableCell>
                  <TableCell>{getStatusBadge(i.status)}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small"><MoreVertIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0' }}>
          <Typography variant="caption" color="#64748b">Showing 1-{filteredInquiries.length} of {inquiries.length} inquiries</Typography>
          <Stack direction="row" spacing={1}>
             <IconButton size="small" disabled><CloseIcon fontSize="small" sx={{ transform: 'rotate(90deg)' }} /></IconButton>
             <IconButton size="small"><CloseIcon fontSize="small" sx={{ transform: 'rotate(-90deg)' }} /></IconButton>
          </Stack>
        </Box>
      </Paper>

      {/* BOTTOM SECTION */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>

        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 'none', mb: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="subtitle1" fontWeight={700}>Quick Actions</Typography>
              <IconButton size="small"><TrendingUpIcon fontSize="small" /></IconButton>
            </Stack>
            <Stack spacing={1}>
              <Button fullWidth variant="text" startIcon={<GroupAddIcon />} sx={{ justifyContent: 'space-between', textAlign: 'center', color: '#0f172a', textTransform: 'none', fontWeight: 600, py: 1.5 }}>
                Assign Bulk Contacts <GroupAddIcon fontSize="small" sx={{ opacity: 0.5 }} />
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* CREATION DRAWER */}
      <Drawer anchor="right" open={openDrawer} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: 500, bgcolor: '#f8fafc' } }}>
        <Box sx={{ p: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h5" fontWeight={800}>Inquiry Manager</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}><CloseIcon /></IconButton>
          </Stack>
          
          <Typography variant="body2" color="#64748b" mb={4}>Manage customer, partner, and driver inquiries.</Typography>

          <Paper sx={{ p: 4, borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>INQUIRY TYPE*</Typography>
                <TextField select fullWidth size="small" value={form.inquiryType} onChange={e => setForm({...form, inquiryType: e.target.value as any})}>
                  <MenuItem value="service">Service Request</MenuItem>
                  <MenuItem value="billing">Billing Inquiry</MenuItem>
                  <MenuItem value="partnership">Partnership</MenuItem>
                  <MenuItem value="emergency">Emergency</MenuItem>
                </TextField>
              </Box>

              <Box>
                <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>NAME*</Typography>
                <TextField fullWidth size="small" placeholder="Enter full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </Box>

              <Box>
                <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>PHONE*</Typography>
                <TextField fullWidth size="small" placeholder="+91 00000 00000" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </Box>

              <Box>
                <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>MESSAGE*</Typography>
                <TextField fullWidth multiline rows={4} placeholder="Enter your message or inquiry details" value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
              </Box>

              <Box>
                <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>STATUS</Typography>
                <TextField select fullWidth size="small" value={form.status} onChange={e => setForm({...form, status: e.target.value as any})}>
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </TextField>
              </Box>

              <Button 
                variant="contained" 
                fullWidth 
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{ bgcolor: '#0f172a', color: '#fff', py: 1.5, textTransform: 'none', fontWeight: 800, mt: 2 }}
              >
                Save Inquiry
              </Button>
            </Stack>
          </Paper>

          <Box sx={{ mt: 4, p: 2, borderRadius: 2, bgcolor: '#dbeafe', color: '#1e40af', display: 'flex', alignItems: 'flex-start' }}>
            <InfoIcon sx={{ mr: 1.5, mt: 0.2, fontSize: 20 }} />
            <Typography variant="caption" fontWeight={500}>
              All inquiries are logged into the central fleet database and assigned to the relevant regional manager automatically based on the inquiry type.
            </Typography>
          </Box>
        </Box>
      </Drawer>

    </Box>
  )
}
