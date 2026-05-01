'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  Grid,
  Divider,
  MenuItem,
  IconButton,
  Avatar,
  Chip,
  LinearProgress,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import PersonIcon from '@mui/icons-material/Person'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import MapIcon from '@mui/icons-material/Map'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import ReceiptIcon from '@mui/icons-material/Receipt'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import dayjs from 'dayjs'

type InvoiceFormProps = {
  invoiceId?: string | null
  onSuccess: () => void
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoiceId, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [formData, setFormData] = useState<any>({
    invoiceNumber: '',
    date: dayjs().toISOString(),
    customer: null,
    driver: null,
    booking: null,
    baseFare: 0,
    tax: 0,
    totalAmount: 0,
    paymentMethod: '',
    status: 'pending',
    pickupLocation: '',
    dropoffLocation: '',
    distance: 0,
    receiptNumber: '',
  })

  useEffect(() => {
    // Fetch payment methods for the dropdown
    fetch('/api/payment-methods?limit=0')
      .then(res => res.json())
      .then(data => setPaymentMethods(data.docs || []))

    if (invoiceId) {
      setFetching(true)
      fetch(`/api/invoices/${invoiceId}?depth=1`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            ...data,
            customer: data.customer?.id || data.customer,
            driver: data.driver?.id || data.driver,
            booking: data.booking?.id || data.booking,
            paymentMethod: data.paymentMethod?.id || data.paymentMethod,
          })
          setFetching(false)
        })
    }
  }, [invoiceId])

  // Recalculate totals when baseFare changes
  useEffect(() => {
    const tax = (formData.baseFare || 0) * 0.05
    const total = (formData.baseFare || 0) + tax
    if (formData.tax !== tax || formData.totalAmount !== total) {
      setFormData((prev: any) => ({ ...prev, tax, totalAmount: total }))
    }
  }, [formData.baseFare])

  const handleSubmit = async (isFinalizing = false) => {
    setLoading(true)
    try {
      const url = invoiceId ? `/api/invoices/${invoiceId}` : '/api/invoices'
      const method = invoiceId ? 'PATCH' : 'POST'
      
      const payload = { ...formData }
      if (isFinalizing && formData.status === 'pending') {
        payload.status = 'paid'
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        onSuccess()
      } else {
        const err = await res.json()
        alert(err.errors?.[0]?.message || 'Failed to save invoice')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <Box sx={{ p: 4 }}><LinearProgress /></Box>

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 3, borderBottom: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>
            {invoiceId ? `Invoice: #${formData.invoiceNumber}` : 'New Invoice Entry'}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Create a new financial record for a completed trip
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={onSuccess} sx={{ textTransform: 'none', borderRadius: '8px', color: '#1e293b', borderColor: '#e2e8f0' }}>
            CANCEL
          </Button>
          <Button variant="contained" onClick={() => handleSubmit(false)} disabled={loading} sx={{ textTransform: 'none', borderRadius: '8px', backgroundColor: '#1e293b', color: '#fff', boxShadow: 'none' }}>
            SAVE INVOICE
          </Button>
        </Stack>
      </Stack>

      <Box sx={{ p: 4, flexGrow: 1, overflowY: 'auto' }}>
        <Grid container spacing={4}>
          {/* Left Column: Form Details */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={4}>
              {/* Identification Section */}
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <ReceiptIcon sx={{ color: '#0ea5e9', fontSize: '1.2rem' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>Identification</Typography>
                </Stack>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      label="INVOICE NUMBER"
                      fullWidth
                      size="small"
                      disabled
                      value={formData.invoiceNumber || 'AUTO-GENERATED'}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      label="RIDE DATE"
                      type="date"
                      fullWidth
                      size="small"
                      value={dayjs(formData.date).format('YYYY-MM-DD')}
                      onChange={(e) => setFormData({ ...formData, date: dayjs(e.target.value).toISOString() })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="RECEIPT NUMBER"
                      fullWidth
                      size="small"
                      disabled
                      value={formData.receiptNumber || 'Pending Payment Success...'}
                      placeholder="Receipt ID will be automatically generated upon payment confirmation."
                      sx={{ '& .MuiInputBase-input': { fontStyle: formData.receiptNumber ? 'normal' : 'italic', color: formData.receiptNumber ? '#1e293b' : '#94a3b8' } }}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Stakeholder Relationships */}
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <PersonIcon sx={{ color: '#0ea5e9', fontSize: '1.2rem' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>Stakeholder Relationships</Typography>
                </Stack>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 4 }}>
                    <TextField
                      label="CUSTOMER"
                      fullWidth
                      size="small"
                      value={formData.customer || ''}
                      onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                      placeholder="Search customer..."
                    />
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <TextField
                      label="DRIVER"
                      fullWidth
                      size="small"
                      value={formData.driver || ''}
                      onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                      placeholder="Assign driver..."
                    />
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <TextField
                      label="TRIP / BOOKING ID"
                      fullWidth
                      size="small"
                      value={formData.booking || ''}
                      onChange={(e) => setFormData({ ...formData, booking: e.target.value })}
                      placeholder="TX-88219..."
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Route Details */}
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <MapIcon sx={{ color: '#0ea5e9', fontSize: '1.2rem' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>Route Details</Typography>
                </Stack>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 5 }}>
                    <TextField
                      label="PICKUP LOCATION"
                      fullWidth
                      size="small"
                      value={formData.pickupLocation || ''}
                      onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                      placeholder="Enter origin address"
                    />
                  </Grid>
                  <Grid size={{ xs: 5 }}>
                    <TextField
                      label="DROPOFF LOCATION"
                      fullWidth
                      size="small"
                      value={formData.dropoffLocation || ''}
                      onChange={(e) => setFormData({ ...formData, dropoffLocation: e.target.value })}
                      placeholder="Enter destination address"
                    />
                  </Grid>
                  <Grid size={{ xs: 2 }}>
                    <TextField
                      label="DISTANCE"
                      fullWidth
                      size="small"
                      type="number"
                      value={formData.distance || ''}
                      onChange={(e) => setFormData({ ...formData, distance: Number(e.target.value) })}
                      InputProps={{ endAdornment: <Typography variant="caption" sx={{ color: '#94a3b8' }}>KM</Typography> }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Stack>
          </Grid>

          {/* Right Column: Summary Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={4}>
              {/* Financial Summary Card */}
              <Paper sx={{ p: 3, backgroundColor: '#1e293b', color: '#fff', borderRadius: '12px' }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                  <AttachMoneyIcon sx={{ color: '#0ea5e9' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Financial Summary</Typography>
                </Stack>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>BASE FARE</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>₹ {formData.baseFare?.toLocaleString()}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>TAX (5%)</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>₹ {formData.tax?.toLocaleString()}</Typography>
                  </Stack>
                  <Divider sx={{ borderColor: '#334155', my: 1 }} />
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>TOTAL AMOUNT</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#fff' }}>₹ {formData.totalAmount?.toLocaleString()}</Typography>
                  </Stack>
                </Stack>
              </Paper>

              {/* Configuration Section */}
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <AttachMoneyIcon sx={{ color: '#0ea5e9', fontSize: '1.2rem' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>Configuration</Typography>
                </Stack>
                <Stack spacing={3}>
                  <TextField
                    select
                    label="PAYMENT METHOD"
                    fullWidth
                    size="small"
                    value={formData.paymentMethod || ''}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  >
                    {paymentMethods.map(pm => (
                      <MenuItem key={pm.id} value={pm.id}>{pm.name}</MenuItem>
                    ))}
                  </TextField>

                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, mb: 1, display: 'block' }}>PAYMENT STATUS</Typography>
                    <Chip
                      label={formData.status === 'paid' ? 'Payment Success' : 'Pending Receipt'}
                      icon={formData.status === 'paid' ? <CheckCircleIcon sx={{ color: '#10b981 !important' }} /> : undefined}
                      sx={{
                        width: '100%',
                        justifyContent: 'flex-start',
                        backgroundColor: formData.status === 'paid' ? '#dcfce7' : '#fff',
                        border: '1px solid',
                        borderColor: formData.status === 'paid' ? '#10b981' : '#e2e8f0',
                        color: formData.status === 'paid' ? '#166534' : '#f59e0b',
                        fontWeight: 700,
                        height: 45,
                        borderRadius: '8px',
                        '& .MuiChip-label': { flexGrow: 1, textAlign: 'left' },
                      }}
                    />
                  </Box>

                  <Box sx={{ p: 2, backgroundColor: '#dcfce7', borderRadius: '8px', border: '1px solid #10b981', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon sx={{ color: '#10b981', fontSize: '1rem' }} />
                    <Typography variant="caption" sx={{ color: '#166534', fontWeight: 800, textTransform: 'uppercase' }}>System Validated</Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Footer Actions */}
      <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ p: 3, borderTop: '1px solid #e2e8f0', backgroundColor: '#fff' }}>
        <Button variant="outlined" sx={{ textTransform: 'none', borderRadius: '8px', color: '#1e293b', borderColor: '#e2e8f0', px: 4 }}>
          DISCARD DRAFT
        </Button>
        <Button
          variant="contained"
          onClick={() => handleSubmit(true)}
          disabled={loading || formData.status === 'paid'}
          sx={{
            textTransform: 'none',
            borderRadius: '8px',
            backgroundColor: formData.status === 'paid' ? '#10b981' : '#1e293b',
            color: '#fff',
            boxShadow: 'none',
            px: 4,
            '&:hover': { backgroundColor: formData.status === 'paid' ? '#059669' : '#334155' },
          }}
        >
          {formData.status === 'paid' ? 'PAID & FINALIZED' : 'FINALIZE & ISSUE INVOICE'}
        </Button>
      </Stack>
    </Box>
  )
}
