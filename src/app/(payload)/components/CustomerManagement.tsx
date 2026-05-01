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
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  Pagination,
  Grid,
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import FilterListIcon from '@mui/icons-material/FilterList'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CloseIcon from '@mui/icons-material/Close'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import BookingForm from './BookingForm'

type Customer = {
  id: string
  name: string
  phone: string
  email?: string
  accountType?: 'individual' | 'corporate'
  bookings?: any[]
  updatedAt: string
}

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [sortOrder, setSortOrder] = useState('Recent Activity')
  
  const [openDrawer, setDrawerOpen] = useState(false)
  const [openBookingDrawer, setBookingDrawerOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Customer>>({
    name: '',
    phone: '',
    email: '',
    accountType: 'individual'
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/customers?limit=100&depth=1')
      const data = await res.json()
      if (data.docs) {
        setCustomers(data.docs)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleEdit = (c: Customer) => {
    setEditingId(c.id)
    setForm({
      name: c.name,
      phone: c.phone,
      email: c.email || '',
      accountType: c.accountType || 'individual',
      bookings: c.bookings || []
    })
    setDrawerOpen(true)
  }

  const handleCreate = () => {
    setEditingId(null)
    setForm({
      name: '',
      phone: '',
      email: '',
      accountType: 'individual'
    })
    setDrawerOpen(true)
  }

  const handleBookingSave = async (data: any) => {
    try {
      const payloadData = {
        ...data,
        customer: editingId,
        customerName: form.name,
        customerPhone: form.phone,
        pickupDateTime: data.pickupDateTime ? new Date(data.pickupDateTime).toISOString() : new Date().toISOString(),
        dropDateTime: data.dropDateTime ? new Date(data.dropDateTime).toISOString() : undefined,
      }

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadData)
      })

      if (!res.ok) {
        const err = await res.json()
        alert('Error creating booking: ' + JSON.stringify(err))
        return
      }

      alert('Booking created successfully')
      setBookingDrawerOpen(false)
      fetchData() // Refresh customer data to show new booking
    } catch (e) {
      console.error(e)
      alert('Error creating booking')
    }
  }

  const handleSave = async () => {
    try {
      const url = editingId ? `/api/customers/${editingId}` : '/api/customers'
      const method = editingId ? 'PATCH' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (!res.ok) {
        const err = await res.json()
        alert('Error saving customer: ' + JSON.stringify(err))
        return
      }

      setDrawerOpen(false)
      fetchData()
    } catch (e) {
      console.error(e)
      alert('Error saving customer')
    }
  }

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const q = searchTerm.toLowerCase()
      return (c.name || '').toLowerCase().includes(q) || 
             (c.phone || '').includes(q) || 
             (c.email || '').toLowerCase().includes(q)
    })
  }, [customers, searchTerm])

  const getInitials = (name: string) => {
    if (!name) return '?'
    const parts = name.split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return name.substring(0, 2).toUpperCase()
  }

  const getAvatarColor = (index: number) => {
    const colors = ['#e0e7ff', '#dbeafe', '#f1f5f9', '#fee2e2', '#0f172a']
    const textColors = ['#4f46e5', '#2563eb', '#475569', '#dc2626', '#ffffff']
    return { bg: colors[index % colors.length], color: textColors[index % textColors.length] }
  }

  return (
    <Box sx={{ p: 4, bgcolor: '#f4f6f8', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* HEADER TABS (MOCK) */}
      <Stack direction="row" spacing={4} sx={{ mb: 4, borderBottom: '1px solid #e2e8f0', pb: 2 }}>
        <Typography variant="h5" fontWeight={600}>
              Customer Management
            </Typography>
      </Stack>

      <Paper sx={{ p: 4, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={4}>
          <Box>
            <Typography variant="h5" fontWeight={800} color="#0f172a" mb={0.5}>Customer Directory</Typography>
            <Typography variant="body2" color="#64748b">Manage your fleet's customer base and booking history.</Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleCreate}
            sx={{ bgcolor: '#0f172a', color: '#fff', textTransform: 'none', fontWeight: 600, px: 3, borderRadius: 1 }}
          >
            ADD CUSTOMER
          </Button>
        </Stack>

        {/* TOOLBAR */}
        <Stack direction="row" spacing={2} mb={3}>
          <TextField
            size="small"
            placeholder="Search by name, phone, or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { bgcolor: '#f8fafc' } }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
            }}
          />
          <Select size="small" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} sx={{ minWidth: 140, bgcolor: '#f8fafc' }}>
            <MenuItem value="All Statuses">All Statuses</MenuItem>
          </Select>
          <Select size="small" value={sortOrder} onChange={e => setSortOrder(e.target.value)} sx={{ minWidth: 180, bgcolor: '#f8fafc' }}>
            <MenuItem value="Recent Activity">Sort: Recent Activity</MenuItem>
          </Select>
          <Button variant="outlined" sx={{ minWidth: 40, p: 0, borderColor: '#e2e8f0', bgcolor: '#f8fafc' }}>
            <FilterListIcon fontSize="small" sx={{ color: '#475569' }} />
          </Button>
        </Stack>

        {/* TABLE */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: 11 }}>CUSTOMER NAME</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: 11 }}>CONTACT INFORMATION</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: 11 }}>UNIQUE ID / PHONE</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: 11 }}>LAST BOOKING</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', fontSize: 11 }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.map((c, idx) => {
                const colors = getAvatarColor(idx)
                return (
                  <TableRow key={c.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: colors.bg, color: colors.color, width: 36, height: 36, fontSize: 14, fontWeight: 700 }} variant="rounded">
                          {getInitials(c.name)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600} color="#0f172a">{c.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{c.accountType === 'corporate' ? 'Corporate Fleet' : 'Standard User'}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="#475569">{c.email || '—'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="#475569">{c.phone}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        {c.bookings && c.bookings.length > 0 ? (
                          <>
                            <Chip label="COMPLETED" size="small" sx={{ bgcolor: '#dcfce7', color: '#166534', fontWeight: 700, fontSize: 10, borderRadius: 1, mb: 0.5 }} />
                            <Typography variant="caption" display="block" color="text.secondary">RECENT</Typography>
                          </>
                        ) : (
                          <>
                            <Chip label="NO BOOKINGS" size="small" sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 700, fontSize: 10, borderRadius: 1, mb: 0.5 }} />
                            <Typography variant="caption" display="block" color="text.secondary">N/A</Typography>
                          </>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleEdit(c)}>
                        <MoreVertIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack direction="row" justifyContent="space-between" alignItems="center" mt={3}>
          <Typography variant="body2" color="text.secondary">Showing 1 to {filteredCustomers.length} of {filteredCustomers.length} customers</Typography>
          <Pagination count={1} shape="rounded" size="small" />
        </Stack>
      </Paper>


      {/* ADD/EDIT CUSTOMER DRAWER */}
      <Drawer anchor="right" open={openDrawer} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: { xs: '100%', md: 800 }, bgcolor: '#f8fafc' } }}>
        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          <Stack direction="row" justifyContent="flex-end" alignItems="center" mb={4}>
            <Button variant="contained" onClick={handleSave} sx={{ bgcolor: '#0f172a', color: '#fff', px: 4, textTransform: 'none', fontWeight: 600 }}>
              Save Customer
            </Button>
            <IconButton onClick={() => setDrawerOpen(false)} sx={{ ml: 2 }}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Grid container spacing={3}>
            
            {/* LEFT COLUMN */}
            <Grid size={{ xs: 12, md: 8 }}>
              
              <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <Typography variant="h6" fontWeight={700} color="#0f172a" mb={3}>Customer Details</Typography>
                
                <Typography variant="caption" fontWeight={600} color="#475569" display="block" mb={1}>Customer Name</Typography>
                <TextField fullWidth size="small" placeholder="e.g. John Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} sx={{ mb: 3, bgcolor: '#f8fafc' }} />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack direction="row" justifyContent="space-between" mb={1}>
                      <Typography variant="caption" fontWeight={600} color="#475569">Phone Number</Typography>
                      <Chip label="REQUIRED & UNIQUE" size="small" sx={{ height: 16, fontSize: 8, bgcolor: '#e0e7ff', color: '#4f46e5', fontWeight: 700 }} />
                    </Stack>
                    <TextField fullWidth size="small" placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} sx={{ bgcolor: '#f8fafc' }} />
                    <Typography variant="caption" color="text.secondary" display="block" mt={1}>Used for SMS tracking updates.</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" fontWeight={600} color="#475569" display="block" mb={1}>Email Address</Typography>
                    <TextField fullWidth size="small" placeholder="john@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} sx={{ bgcolor: '#f8fafc' }} />
                  </Grid>
                </Grid>
              </Paper>

              <Paper sx={{ p: 4, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <ReceiptLongIcon sx={{ color: '#64748b' }} />
                  <Typography variant="h6" fontWeight={700} color="#0f172a">Bookings</Typography>
                </Stack>
                
                {form.bookings && form.bookings.length > 0 ? (
                  <Stack spacing={2} mb={3}>
                    {form.bookings.map((b: any) => (
                      <Box key={b.id} sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{b.pickupLocation || 'Booking'}</Typography>
                          <Typography variant="caption" color="text.secondary">{new Date(b.createdAt).toLocaleDateString()}</Typography>
                        </Box>
                        <Chip label={b.status?.toUpperCase() || 'PENDING'} size="small" sx={{ fontWeight: 700, fontSize: 10 }} />
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="body2" color="text.secondary" mb={3}>No Bookings found</Typography>
                  </Box>
                )}

                <Button 
                  variant="outlined" 
                  fullWidth
                  startIcon={<AddIcon />} 
                  sx={{ color: '#475569', borderColor: '#cbd5e1', textTransform: 'none', fontWeight: 600 }}
                  onClick={() => setBookingDrawerOpen(true)}
                >
                  Create new Booking
                </Button>
              </Paper>

            </Grid>

            {/* RIGHT COLUMN */}
            <Grid size={{ xs: 12, md: 4 }}>
              
              <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <Typography variant="subtitle1" fontWeight={700} color="#0f172a" mb={2}>Account Type</Typography>
                <RadioGroup value={form.accountType} onChange={e => setForm({...form, accountType: e.target.value as 'individual'|'corporate'})}>
                  <FormControlLabel 
                    value="individual" 
                    control={<Radio size="small" sx={{ color: '#0f172a', '&.Mui-checked': { color: '#0f172a' } }} />} 
                    label={<Typography variant="body2" fontWeight={500}>Individual</Typography>} 
                    sx={{ border: '1px solid #e2e8f0', borderRadius: 1, p: 1, mb: 1.5, mx: 0 }}
                  />
                  <FormControlLabel 
                    value="corporate" 
                    control={<Radio size="small" sx={{ color: '#0f172a', '&.Mui-checked': { color: '#0f172a' } }} />} 
                    label={<Typography variant="body2" fontWeight={500}>Corporate</Typography>} 
                    sx={{ border: '1px solid #e2e8f0', borderRadius: 1, p: 1, mx: 0 }}
                  />
                </RadioGroup>
              </Paper>

              <Paper sx={{ p: 3, borderRadius: 2, bgcolor: '#0f172a', color: '#fff', position: 'relative', overflow: 'hidden' }}>
                <Typography variant="subtitle1" fontWeight={700} mb={1} sx={{ position: 'relative', zIndex: 2 }}>Fleet Integration</Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8', position: 'relative', zIndex: 2, lineHeight: 1.4 }}>
                  Assign this customer to specific delivery zones for optimized routing.
                </Typography>
              </Paper>

            </Grid>
          </Grid>

        </Box>
      </Drawer>

      <Drawer anchor="right" open={openBookingDrawer} onClose={() => setBookingDrawerOpen(false)} PaperProps={{ sx: { width: '80%', bgcolor: '#f8fafc' } }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', bgcolor: '#fff' }}>
          <Typography variant="h6" fontWeight={700}>Create New Booking</Typography>
          <IconButton onClick={() => setBookingDrawerOpen(false)}><CloseIcon /></IconButton>
        </Box>
        <BookingForm 
          initialData={{ customerName: form.name, customerPhone: form.phone, customer: editingId || undefined }} 
          onCancel={() => setBookingDrawerOpen(false)} 
          onSave={handleBookingSave}
        />
      </Drawer>
    </Box>
  )
}
