'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  TextField,
  MenuItem,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'
import TripControls from './TripControls'

export type BookingFormData = {
  id?: string
  customerName: string
  customerPhone: string
  vehicle: string
  tripType: string
  pickupLocation: [number, number]
  pickupLocationName: string
  dropoffLocation?: [number, number]
  dropoffLocationName?: string
  pickupDateTime: string
  dropDateTime?: string
  estimatedFare: number
  distanceKm: number
  couponCode?: string
  discountAmount: number
  status: string
  paymentStatus: string
  paymentAmount: number
  paymentType: string
  sosTriggered: boolean
  notes?: string
  customer?: string
  driver?: string
  bookingCode?: string
  ridePreference?: string
}

type Props = {
  initialData?: Partial<BookingFormData>
  onSave: (data: BookingFormData) => void
  onCancel: () => void
  isEditing?: boolean
}

export default function BookingForm({ initialData, onSave, onCancel, isEditing }: Props) {
  const [formData, setFormData] = useState<BookingFormData>({
    ridePreference: initialData?.ridePreference || '',
    customerName: initialData?.customerName || '',
    customerPhone: initialData?.customerPhone || '',
    vehicle: initialData?.vehicle || '',
    tripType: initialData?.tripType || 'oneway',
    pickupLocation: initialData?.pickupLocation || [0, 0],
    pickupLocationName: initialData?.pickupLocationName || '',
    dropoffLocation: initialData?.dropoffLocation || [0, 0],
    dropoffLocationName: initialData?.dropoffLocationName || '',
    pickupDateTime: initialData?.pickupDateTime ? new Date(initialData.pickupDateTime).toISOString().slice(0, 16) : '',
    dropDateTime: initialData?.dropDateTime ? new Date(initialData.dropDateTime).toISOString().slice(0, 16) : '',
    estimatedFare: initialData?.estimatedFare || 0,
    distanceKm: initialData?.distanceKm || 0,
    couponCode: initialData?.couponCode || '',
    discountAmount: initialData?.discountAmount || 0,
    status: initialData?.status || 'pending',
    paymentStatus: initialData?.paymentStatus || 'unpaid',
    paymentAmount: initialData?.paymentAmount || 0,
    paymentType: initialData?.paymentType || 'full',
    sosTriggered: initialData?.sosTriggered || false,
    notes: initialData?.notes || '',
    customer: initialData?.customer || '',
    driver: initialData?.driver || '',
    bookingCode: initialData?.bookingCode || '',
  })

  const [vehicles, setVehicles] = useState<any[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/vehicles?limit=100').then(res => res.json()).then(data => setVehicles(data.docs || []))
    fetch('/api/drivers?limit=100').then(res => res.json()).then(data => setDrivers(data.docs || []))
    fetch('/api/customers?limit=100').then(res => res.json()).then(data => setCustomers(data.docs || []))
  }, [])

  const handleChange = (field: keyof BookingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleLocationChange = (type: 'pickup' | 'dropoff', axis: 0 | 1, value: string) => {
    const num = parseFloat(value) || 0
    if (type === 'pickup') {
      const newLoc = [...formData.pickupLocation] as [number, number]
      newLoc[axis] = num
      setFormData(prev => ({ ...prev, pickupLocation: newLoc }))
    } else {
      const newLoc = [...(formData.dropoffLocation || [0, 0])] as [number, number]
      newLoc[axis] = num
      setFormData(prev => ({ ...prev, dropoffLocation: newLoc }))
    }
  }

  return (
    <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* CORE DETAILS */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
        <Typography variant="subtitle1" fontWeight={700} color="#0f172a" mb={3}>Core Details</Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>CUSTOMER NAME*</Typography>
            <TextField fullWidth size="small" value={formData.customerName} onChange={e => handleChange('customerName', e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>CUSTOMER PHONE*</Typography>
            <TextField fullWidth size="small" value={formData.customerPhone} onChange={e => handleChange('customerPhone', e.target.value)} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>VEHICLE*</Typography>
            <TextField select fullWidth size="small" value={formData.vehicle} onChange={e => handleChange('vehicle', e.target.value)}>
              {vehicles.map(v => <MenuItem key={v.id} value={v.id}>{v.name} ({v.number})</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>TRIP TYPE*</Typography>
            <TextField select fullWidth size="small" value={formData.tripType} onChange={e => handleChange('tripType', e.target.value)}>
              <MenuItem value="oneway">One-way</MenuItem>
              <MenuItem value="roundtrip">Round-trip</MenuItem>
              <MenuItem value="packages">Packages</MenuItem>
              <MenuItem value="multilocation">Multi-location</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        
        {/* LOCATION INFORMATION */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <Typography variant="subtitle1" fontWeight={700} color="#0f172a" mb={3}>Location Information</Typography>
            <Grid container spacing={2} mb={2}>
              
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>PICKUP LOCATION - LONGITUDE*</Typography>
                <TextField fullWidth size="small" value={formData.pickupLocation[0]} onChange={e => handleLocationChange('pickup', 0, e.target.value)} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>PICKUP LOCATION - LATITUDE*</Typography>
                <TextField fullWidth size="small" value={formData.pickupLocation[1]} onChange={e => handleLocationChange('pickup', 1, e.target.value)} />
              </Grid>
            </Grid>
            <Box mb={2}>
              <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>PICKUP LOCATION NAME*</Typography>
              <TextField fullWidth size="small" value={formData.pickupLocationName} onChange={e => handleChange('pickupLocationName', e.target.value)} />
            </Box>
            <Grid container spacing={2} mb={2}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>DROPOFF LOCATION - LONGITUDE</Typography>
                <TextField fullWidth size="small" value={formData.dropoffLocation?.[0]} onChange={e => handleLocationChange('dropoff', 0, e.target.value)} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>DROPOFF LOCATION - LATITUDE</Typography>
                <TextField fullWidth size="small" value={formData.dropoffLocation?.[1]} onChange={e => handleLocationChange('dropoff', 1, e.target.value)} />
              </Grid>
            </Grid>
            <Box>
              <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>DROPOFF LOCATION NAME</Typography>
              <TextField fullWidth size="small" value={formData.dropoffLocationName} onChange={e => handleChange('dropoffLocationName', e.target.value)} />
            </Box>
          </Paper>

          {/* SCHEDULE & FARE */}
          <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <Typography variant="subtitle1" fontWeight={700} color="#0f172a" mb={3}>Schedule & Fare</Typography>
            <Grid container spacing={2} mb={2}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>PICKUP DATE TIME*</Typography>
                <TextField fullWidth size="small" type="datetime-local" value={formData.pickupDateTime} onChange={e => handleChange('pickupDateTime', e.target.value)} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>DROP DATE TIME</Typography>
                <TextField fullWidth size="small" type="datetime-local" value={formData.dropDateTime} onChange={e => handleChange('dropDateTime', e.target.value)} />
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={2}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>ESTIMATED FARE</Typography>
                <TextField fullWidth size="small" type="number" value={formData.estimatedFare} onChange={e => handleChange('estimatedFare', parseFloat(e.target.value) || 0)} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>DISTANCE KM</Typography>
                <TextField fullWidth size="small" type="number" value={formData.distanceKm} onChange={e => handleChange('distanceKm', parseFloat(e.target.value) || 0)} />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>COUPON CODE</Typography>
                <TextField fullWidth size="small" value={formData.couponCode} onChange={e => handleChange('couponCode', e.target.value)} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>DISCOUNT AMOUNT</Typography>
                <TextField fullWidth size="small" type="number" value={formData.discountAmount} onChange={e => handleChange('discountAmount', parseFloat(e.target.value) || 0)} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid size={{ xs: 12, md: 6 }}>
          
          {/* PAYMENT DETAILS */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <Typography variant="subtitle1" fontWeight={700} color="#0f172a" mb={3}>Payment Details</Typography>
            <Grid container spacing={2} mb={2}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>PAYMENT STATUS</Typography>
                <TextField select fullWidth size="small" value={formData.paymentStatus} onChange={e => handleChange('paymentStatus', e.target.value)}>
                  <MenuItem value="unpaid">unpaid</MenuItem>
                  <MenuItem value="partial">partial</MenuItem>
                  <MenuItem value="paid">paid</MenuItem>
                  <MenuItem value="failed">failed</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>PAYMENT AMOUNT</Typography>
                <TextField fullWidth size="small" type="number" value={formData.paymentAmount} onChange={e => handleChange('paymentAmount', parseFloat(e.target.value) || 0)} />
              </Grid>
            </Grid>
           <Grid container spacing={2} mb={3}>
  <Grid size={{ xs: 12 }}>
    <Typography
      variant="caption"
      fontWeight={700}
      color="#475569"
      display="block"
      mb={1}
    >
      PAYMENT TYPE
    </Typography>

    <TextField
      select
      fullWidth
      size="small"
      value={formData.paymentType}
      onChange={e => handleChange('paymentType', e.target.value)}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          bgcolor: '#fff',
        },
      }}
    >
      <MenuItem value="minimum">Minimum Payment</MenuItem>
      <MenuItem value="full">Full Payment</MenuItem>
    </TextField>
  </Grid>
</Grid>
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#fff5f5', border: '1px solid #fed7d7' }}>
              <FormControlLabel
                control={<Switch checked={formData.sosTriggered} onChange={e => handleChange('sosTriggered', e.target.checked)} color="error" />}
                label={<Typography variant="body2" fontWeight={700} color="#c53030">🚨 Trigger SOS / Emergency</Typography>}
              />
            </Box>
          </Paper>

          {/* ADMINISTRATION & ASSIGNMENTS */}
          <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>

            <Typography variant="subtitle1" fontWeight={700} color="#0f172a" mb={3}>Administration & Assignments</Typography>
            {/* RIDE PREFERENCES */}
<Box sx={{ mb: 2 }}>
  <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>
    RIDE PREFERENCES
  </Typography>

  <TextField
    select
    fullWidth
    size="small"
    value={(formData as any).ridePreference || ''}
    onChange={e => handleChange('ridePreference' as any, e.target.value)}
  >
    <MenuItem value="">None</MenuItem>
    <MenuItem value="auto">Auto Assign Driver</MenuItem>
    <MenuItem value="female_only">Female Driver Only</MenuItem>
    <MenuItem value="premium">Premium Priority</MenuItem>
  </TextField>
</Box>
            <Grid container spacing={2} mb={2}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>STATUS</Typography>
                <TextField select fullWidth size="small" value={formData.status} onChange={e => handleChange('status', e.target.value)}>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </TextField>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>BOOKING CODE</Typography>
                <TextField fullWidth size="small" value={formData.bookingCode} disabled />
              </Grid>
            </Grid>
            <Grid container spacing={2} mb={2}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>CUSTOMER</Typography>
                <TextField select fullWidth size="small" value={formData.customer} onChange={e => handleChange('customer', e.target.value)}>
                  {customers.map(c => <MenuItem key={c.id} value={c.id}>{c.name} ({c.id.substring(0, 8)})</MenuItem>)}
                </TextField>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>DRIVER</Typography>
                <TextField select fullWidth size="small" value={formData.driver} onChange={e => handleChange('driver', e.target.value)}>
                  <MenuItem value="">Select a value</MenuItem>
                  {drivers.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
                </TextField>
              </Grid>
            </Grid>
            <Box>
              <Typography variant="caption" fontWeight={700} color="#475569" display="block" mb={1}>NOTES</Typography>
              <TextField multiline rows={4} fullWidth placeholder="Enter booking instructions..." value={formData.notes} onChange={e => handleChange('notes', e.target.value)} />
            </Box>
          </Paper>

        </Grid>
      </Grid>

      {isEditing && formData.id && (
        <TripControls
          bookingId={formData.id}
          bookingCode={formData.bookingCode || ''}
          customerName={formData.customerName}
          customerPhone={formData.customerPhone}
          status={formData.status}
          tripStatus={(formData as any).tripStatus || 'not_started'}
          otpVerified={(formData as any).otpVerified || false}
          sharingToken={(formData as any).sharingToken}
          onUpdate={() => {
            // Optionally refresh form data here
            fetch(`/api/bookings/${formData.id}`).then(res => res.json()).then(data => {
              setFormData(prev => ({
                ...prev,
                status: data.status,
                tripStatus: data.tripStatus,
                otpVerified: data.otpVerified,
                sharingToken: data.sharingToken
              } as any))
            })
          }}
        />
      )}

      <Stack direction="row" spacing={2} justifyContent="flex-end" mt={4}>
        <Button variant="outlined" onClick={onCancel} sx={{ color: '#0f172a', borderColor: '#e2e8f0', bgcolor: '#fff', px: 4, textTransform: 'none', fontWeight: 600 }}>Discard Changes</Button>
        <Button variant="contained" onClick={() => onSave(formData)} sx={{ bgcolor: '#0f172a', color: '#fff', px: 4, textTransform: 'none', fontWeight: 600 }}>Save Booking</Button>
      </Stack>

    </Box>
  )
}
