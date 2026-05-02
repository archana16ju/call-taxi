'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  Switch,
  FormControlLabel,
  MenuItem,
  Grid,
  Divider,
  IconButton,
  Paper,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

type PaymentMethodFormProps = {
  paymentMethodId?: string | null
  onSuccess: () => void
}

export const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ paymentMethodId, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<any>({
    name: '',
    type: 'cash',
    isActive: true,
    processingFee: 0,
    minimumAmount: 0,
    maximumAmount: '',
    currency: 'INR',
    config: {
      upiId: '',
      merchantId: '',
      apiKey: '',
      apiSecret: '',
    },
    supportedBanks: [],
    icon: '',
    description: '',
  })

  useEffect(() => {
    if (paymentMethodId) {
      fetch(`/api/payment-methods/${paymentMethodId}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            ...data,
            config: data.config || {},
            supportedBanks: data.supportedBanks || [],
          })
        })
    }
  }, [paymentMethodId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const url = paymentMethodId ? `/api/payment-methods/${paymentMethodId}` : '/api/payment-methods'
      const method = paymentMethodId ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        onSuccess()
      } else {
        const err = await res.json()
        alert(err.errors?.[0]?.message || 'Something went wrong')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const addBank = () => {
    setFormData({
      ...formData,
      supportedBanks: [...formData.supportedBanks, { bankName: '' }],
    })
  }

  const removeBank = (index: number) => {
    const newBanks = [...formData.supportedBanks]
    newBanks.splice(index, 1)
    setFormData({ ...formData, supportedBanks: newBanks })
  }

  const updateBank = (index: number, value: string) => {
    const newBanks = [...formData.supportedBanks]
    newBanks[index].bankName = value
    setFormData({ ...formData, supportedBanks: newBanks })
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Stack spacing={3}>
        <TextField
          label="Payment Method Name"
          fullWidth
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <TextField
          select
          label="Payment Type"
          fullWidth
          required
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        >
          <MenuItem value="cash">Cash</MenuItem>
          <MenuItem value="upi">UPI</MenuItem>
          <MenuItem value="card">Credit/Debit Card</MenuItem>
          <MenuItem value="netbanking">Net Banking</MenuItem>
          <MenuItem value="wallet">Wallet</MenuItem>
        </TextField>

        <FormControlLabel
          control={
            <Switch
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            />
          }
          label="Enable Method"
        />

        <Grid container spacing={2}>
          <Grid size={6}>
            <TextField
              label="Processing Fee (%)"
              type="number"
              fullWidth
              value={formData.processingFee}
              onChange={(e) => setFormData({ ...formData, processingFee: Number(e.target.value) })}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label="Currency"
              fullWidth
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={6}>
            <TextField
              label="Min Amount"
              type="number"
              fullWidth
              value={formData.minimumAmount}
              onChange={(e) => setFormData({ ...formData, minimumAmount: Number(e.target.value) })}
            />
          </Grid>
          <Grid size={6}>
            <TextField
              label="Max Amount"
              type="number"
              fullWidth
              value={formData.maximumAmount}
              onChange={(e) => setFormData({ ...formData, maximumAmount: e.target.value ? Number(e.target.value) : undefined })}
            />
          </Grid>
        </Grid>

        <Divider>Configuration</Divider>

        {formData.type === 'upi' && (
          <TextField
            label="UPI ID"
            fullWidth
            value={formData.config.upiId}
            onChange={(e) => setFormData({ ...formData, config: { ...formData.config, upiId: e.target.value } })}
          />
        )}

        <TextField
          label="Merchant ID"
          fullWidth
          value={formData.config.merchantId}
          onChange={(e) => setFormData({ ...formData, config: { ...formData.config, merchantId: e.target.value } })}
        />

        <TextField
          label="API Key"
          fullWidth
          value={formData.config.apiKey}
          onChange={(e) => setFormData({ ...formData, config: { ...formData.config, apiKey: e.target.value } })}
        />

        <TextField
          label="API Secret"
          fullWidth
          type="password"
          value={formData.config.apiSecret}
          onChange={(e) => setFormData({ ...formData, config: { ...formData.config, apiSecret: e.target.value } })}
        />

        {formData.type === 'netbanking' && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Supported Banks</Typography>
            {formData.supportedBanks.map((bank: any, index: number) => (
              <Stack key={index} direction="row" spacing={1} sx={{ mb: 1 }}>
                <TextField
                  label="Bank Name"
                  size="small"
                  fullWidth
                  value={bank.bankName}
                  onChange={(e) => updateBank(index, e.target.value)}
                />
                <IconButton onClick={() => removeBank(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Stack>
            ))}
            <Button startIcon={<AddIcon />} onClick={addBank} size="small">
              Add Bank
            </Button>
          </Box>
        )}

        <TextField
          label="Icon URL"
          fullWidth
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
        />

        <TextField
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        {formData.type === 'upi' && formData.config.upiId && (
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              textAlign: 'center',
              backgroundColor: '#f8fafc',
              borderStyle: 'dashed',
              borderColor: '#0ea5e9',
            }}
          >
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 1 }}>
              UPI QR CODE PREVIEW
            </Typography>
            <Box
              component="img"
              src={`https:/api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                `upi:/pay?pa=${formData.config.upiId}&pn=${formData.name}&cu=INR`
              )}`}
              alt="UPI QR Code"
              sx={{ width: 150, height: 150, mb: 1, borderRadius: '8px' }}
            />
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
              {formData.config.upiId}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Scan to pay via any UPI app
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  const url = `https:/api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(
                    `upi:/pay?pa=${formData.config.upiId}&pn=${formData.name}&cu=INR`
                  )}`
                  window.open(url, '_blank')
                }}
                sx={{ textTransform: 'none', fontSize: '0.75rem' }}
              >
                Open QR
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  const qrUrl = `https:/api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
                    `upi:/pay?pa=${formData.config.upiId}&pn=${formData.name}&cu=INR`
                  )}`
                  const printWindow = window.open('', '_blank')
                  if (printWindow) {
                    printWindow.document.write(`
                      <html>
                        <head>
                          <title>Print QR Card - ${formData.name}</title>
                          <style>
                            body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f0f0f0; }
                            .card { background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); text-align: center; width: 350px; border: 2px solid #0ea5e9; }
                            .header { color: #1e293b; font-size: 24px; font-weight: 800; margin-bottom: 5px; }
                            .subheader { color: #64748b; font-size: 14px; margin-bottom: 20px; }
                            .qr-container { margin: 20px 0; padding: 20px; background: #f8fafc; border-radius: 12px; }
                            .upi-id { font-family: monospace; font-size: 16px; font-weight: 700; color: #0ea5e9; margin-top: 15px; }
                            .footer { margin-top: 30px; font-size: 12px; color: #94a3b8; }
                            @media print {
                              body { background: white; }
                              .card { box-shadow: none; border: 1px solid #ccc; }
                              .no-print { display: none; }
                            }
                          </style>
                        </head>
                        <body>
                          <div class="card">
                            <div class="header">KANI TAXI</div>
                            <div class="subheader">Scan to Pay using UPI</div>
                            <div class="qr-container">
                              <img src="${qrUrl}" width="250" height="250" />
                            </div>
                            <div class="header" style="font-size: 18px;">${formData.name}</div>
                            <div class="upi-id">${formData.config.upiId}</div>
                            <div class="footer">Thank you for choosing Kani Taxi</div>
                            <button class="no-print" onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #0ea5e9; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Now</button>
                          </div>
                        </body>
                      </html>
                    `)
                    printWindow.document.close()
                  }
                }}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  backgroundColor: '#0ea5e9',
                  '&:hover': { backgroundColor: '#0284c7' },
                }}
              >
                Print QR Card
              </Button>
            </Box>
          </Paper>
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            backgroundColor: '#0ea5e9',
            '&:hover': { backgroundColor: '#0284c7' },
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          {loading ? 'Saving...' : paymentMethodId ? 'Update Payment Method' : 'Create Payment Method'}
        </Button>
      </Stack>
    </Box>
  )
}
