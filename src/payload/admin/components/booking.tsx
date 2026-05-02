'use client'

import React, { useMemo, useState } from 'react'
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
  Divider
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import BookingForm, { BookingFormData } from './BookingForm'

type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'

type BookingForm = {
  customerName: string
  customerPhone: string
  vehicle: string
  tripType: string
  driver?: string
  pickupLocationName: string
  pickupLat: string
  pickupLng: string
  dropoffLocationName?: string
  dropLat?: string
  dropLng?: string
  pickupDateTime: string
  dropDateTime?: string
  estimatedFare?: string
  distanceKm?: string
  couponCode?: string
  discountAmount?: string
  status: string
  paymentStatus?: string
  paymentAmount?: string
  paymentType?: string
  sosTriggered?: boolean
  notes?: string
}

type BookingType = {
  id: string
  dbId: string
  customer: string
  phone: string
  pickup: string
  drop?: string
  date: string
  time: string
  amount: number
  status: BookingStatus
  _raw?: any
}

const statusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'confirmed': return 'info'
    case 'pending': return 'warning'
    case 'completed': return 'success'
    case 'cancelled': return 'error'
    default: return 'default'
  }
}

export default function Booking() {

  const [bookings, setBookings] = useState<BookingType[]>([])
  const [vehicles, setVehicles] = useState<{ id: string; name: string; number: string }[]>([])
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [form, setForm] = useState<BookingForm>({
    customerName: '',
    customerPhone: '',
    vehicle: '',
    tripType: '',
    driver: '',
    pickupLocationName: '',
    pickupLat: '',
    pickupLng: '',
    dropoffLocationName: '',
    dropLat: '',
    dropLng: '',
    pickupDateTime: '',
    dropDateTime: '',
    estimatedFare: '',
    distanceKm: '',
    couponCode: '',
    discountAmount: '',
    status: 'pending',
    paymentStatus: 'unpaid',
    paymentAmount: '',
    paymentType: '',
    sosTriggered: false,
    notes: '',
  })

  const stats = useMemo(() => ({
    total: bookings.length,
    pending: bookings.filter(b => b.status.toLowerCase() === 'pending').length,
    confirmed: bookings.filter(b => b.status.toLowerCase() === 'confirmed').length,
    completed: bookings.filter(b => b.status.toLowerCase() === 'completed').length
  }), [bookings])

  React.useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/bookings?limit=100&sort=-createdAt')
        const data = await res.json()
        const formatted = data.docs.map((b: any) => ({
          id: b.bookingCode || b.id,
          dbId: b.id,
          customer: b.customerName || b.customer?.name || 'Unknown',
          phone: b.customerPhone || b.customer?.phone || '',
          pickup: b.pickupLocationName || 'N/A',
          drop: b.dropoffLocationName || 'N/A',
          date: b.pickupDateTime?.split('T')[0] || '',
          time: b.pickupDateTime?.split('T')[1]?.substring(0, 5) || '',
          amount: b.estimatedFare || 0,
          status: b.status ? b.status.charAt(0).toUpperCase() + b.status.slice(1) : 'Pending',
          _raw: b
        }))
        setBookings(formatted)
      } catch (e) {
        console.log('fetch bookings error', e)
      }
    }

    const fetchVehicles = async () => {
      try {
        const res = await fetch('/api/vehicles?limit=100')
        const data = await res.json()
        if (data && data.docs) {
          setVehicles(data.docs.map((v: any) => ({ id: v.id, name: v.name, number: v.number })))
        }
      } catch (e) {
        console.log('fetch vehicles error', e)
      }
    }

    fetchBookings()
    fetchVehicles()
  }, [])

  const handleEdit = (b: BookingType) => {
    const raw = b._raw || {}
    setEditingId(b.dbId)
    setForm({
      customerName: raw.customerName || '',
      customerPhone: raw.customerPhone || '',
      vehicle: typeof raw.vehicle === 'object' ? raw.vehicle?.id : (raw.vehicle || ''),
      tripType: raw.tripType || 'oneway',
      driver: typeof raw.driver === 'object' ? raw.driver?.id : (raw.driver || ''),
      pickupLocationName: raw.pickupLocationName || '',
      pickupLat: raw.pickupLocation?.[1]?.toString() || '',
      pickupLng: raw.pickupLocation?.[0]?.toString() || '',
      dropoffLocationName: raw.dropoffLocationName || '',
      dropLat: raw.dropoffLocation?.[1]?.toString() || '',
      dropLng: raw.dropoffLocation?.[0]?.toString() || '',
      pickupDateTime: raw.pickupDateTime ? new Date(raw.pickupDateTime).toISOString().slice(0, 16) : '',
      dropDateTime: raw.dropDateTime ? new Date(raw.dropDateTime).toISOString().slice(0, 16) : '',
      estimatedFare: raw.estimatedFare?.toString() || '',
      distanceKm: raw.distanceKm?.toString() || '',
      couponCode: raw.couponCode || '',
      discountAmount: raw.discountAmount?.toString() || '',
      status: raw.status || 'pending',
      paymentStatus: raw.paymentStatus || 'unpaid',
      paymentAmount: raw.paymentAmount?.toString() || '',
      paymentType: raw.paymentType || '',
      sosTriggered: raw.sosTriggered || false,
      notes: raw.notes || '',
    })
    setOpen(true)
  }

  const handleAdd = async () => {
    try {
      const payloadData = {
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        vehicle: form.vehicle || undefined,
        tripType: form.tripType || 'oneway',
        driver: form.driver || undefined,
        
        pickupLocation: [Number(form.pickupLng) || 0, Number(form.pickupLat) || 0],
        dropoffLocation: form.dropLng && form.dropLat ? [Number(form.dropLng), Number(form.dropLat)] : undefined,
        
        pickupLocationName: form.pickupLocationName,
        dropoffLocationName: form.dropoffLocationName || undefined,
        
        pickupDateTime: form.pickupDateTime ? new Date(form.pickupDateTime).toISOString() : new Date().toISOString(),
        dropDateTime: form.dropDateTime ? new Date(form.dropDateTime).toISOString() : undefined,
        
        estimatedFare: Number(form.estimatedFare) || 0,
        distanceKm: Number(form.distanceKm) || 0,
        
        couponCode: form.couponCode || undefined,
        discountAmount: Number(form.discountAmount) || 0,
        
        status: form.status || 'pending',
        paymentStatus: form.paymentStatus || 'unpaid',
        paymentAmount: Number(form.paymentAmount) || 0,
        paymentType: form.paymentType || 'full',
        
        sosTriggered: form.sosTriggered || false,
        notes: form.notes || undefined,
      }

      console.log('SEND TO API 👉', payloadData)

      const url = editingId ? `/api/bookings/${editingId}` : '/api/bookings'
      const method = editingId ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadData)
      })

      if (!res.ok) {
        const err = await res.json()
        alert(`Error ${editingId ? 'updating' : 'creating'} booking: ` + JSON.stringify(err))
        return
      }

      const newB = await res.json()
      const b = newB.doc

      const newBooking: BookingType = {
        id: b.bookingCode || b.id,
        dbId: b.id,
        customer: b.customerName || 'Unknown',
        phone: b.customerPhone || '',
        pickup: b.pickupLocationName || 'N/A',
        drop: b.dropoffLocationName || 'N/A',
        date: b.pickupDateTime?.split('T')[0] || '',
        time: b.pickupDateTime?.split('T')[1]?.substring(0, 5) || '',
        amount: b.estimatedFare || 0,
        status: b.status ? (b.status.charAt(0).toUpperCase() + b.status.slice(1) as BookingStatus) : 'Pending',
        _raw: b
      }

      if (editingId) {
        setBookings(prev => prev.map(item => item.dbId === editingId ? newBooking : item))
        alert("Booking Updated Successfully 🎉")
      } else {
        setBookings(prev => [newBooking, ...prev])
        alert("Booking Created Successfully 🎉")
      }

      setOpen(false)
      setEditingId(null)

      setForm({
        customerName: '',
        customerPhone: '',
        vehicle: '',
        tripType: '',
        driver: '',
        pickupLocationName: '',
        pickupLat: '',
        pickupLng: '',
        dropoffLocationName: '',
        dropLat: '',
        dropLng: '',
        pickupDateTime: '',
        dropDateTime: '',
        estimatedFare: '',
        distanceKm: '',
        couponCode: '',
        discountAmount: '',
        status: 'pending',
        paymentStatus: 'unpaid',
        paymentAmount: '',
        paymentType: '',
        sosTriggered: false,
        notes: '',
      })
    } catch (e) {
      alert("Error: " + e)
    }
  }

  return (
    <Box sx={{ p: 3, bgcolor: '#f6f7fb', minHeight: '100vh' }}>
      
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Booking Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage all taxi bookings in one place
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingId(null)
            setForm({
              customerName: '',
              customerPhone: '',
              vehicle: '',
              tripType: '',
              driver: '',
              pickupLocationName: '',
              pickupLat: '',
              pickupLng: '',
              dropoffLocationName: '',
              dropLat: '',
              dropLng: '',
              pickupDateTime: '',
              dropDateTime: '',
              estimatedFare: '',
              distanceKm: '',
              couponCode: '',
              discountAmount: '',
              status: 'pending',
              paymentStatus: 'unpaid',
              paymentAmount: '',
              paymentType: '',
              sosTriggered: false,
              notes: '',
            })
            setOpen(true)
          }}
        >
          New Booking
        </Button>
      </Stack>

      {/* STATS */}
      <Grid container spacing={2} mt={2}>
        {[
          { label: 'Total', value: stats.total, color: '#6366f1' },
          { label: 'Pending', value: stats.pending, color: '#f59e0b' },
          { label: 'Confirmed', value: stats.confirmed, color: '#3b82f6' },
          { label: 'Completed', value: stats.completed, color: '#10b981' }
        ].map((item, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <Paper sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="body2" color="text.secondary">
                {item.label}
              </Typography>
              <Typography variant="h5" fontWeight={700} sx={{ color: item.color }}>
                {item.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* TABLE */}
      <Paper sx={{ mt: 3, borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#eef2ff' }}>
              <TableRow>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>Customer</b></TableCell>
                <TableCell><b>Route</b></TableCell>
                <TableCell><b>Date</b></TableCell>
                <TableCell><b>Amount</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell align="right"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {bookings.map(b => (
                <TableRow key={b.id}>
                  <TableCell>{b.id}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography fontWeight={600}>{b.customer}</Typography>
                      <Typography variant="caption">{b.phone}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {b.pickup} → {b.drop}
                  </TableCell>
                  <TableCell>
                    {b.date} {b.time}
                  </TableCell>
                  <TableCell>₹{b.amount}</TableCell>
                  <TableCell>
                    <Chip
                      label={b.status}
                      color={statusColor(b.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleEdit(b)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* DRAWER FORM */}
     {/* DRAWER */}
<Drawer anchor="right" open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: '80%', bgcolor: '#f8fafc' } }}>
  <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', bgcolor: '#fff' }}>
    <Typography variant="h6" fontWeight={700}>{editingId ? 'Edit Booking' : 'Create Booking'}</Typography>
    <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
  </Box>
  <BookingForm 
    initialData={form as any} 
    onCancel={() => setOpen(false)} 
    onSave={(data) => {
      // Convert BookingFormData back to the internal form state if needed, 
      // but we can just use the data directly for the API call
      setForm(data as any)
      handleAdd() 
    }}
    isEditing={!!editingId}
  />
</Drawer>
    </Box>
  )
}