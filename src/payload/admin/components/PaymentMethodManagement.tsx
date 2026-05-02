'use client'

import React, { useEffect, useState, useCallback } from 'react'
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Stack,
  Pagination,
  Grid,
  Drawer,
} from '@mui/material'
import PaymentsIcon from '@mui/icons-material/Payments'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import QrCodeIcon from '@mui/icons-material/QrCode'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import MoneyIcon from '@mui/icons-material/Money'
import Tooltip from '@mui/material/Tooltip'
import { PaymentMethodForm } from './PaymentMethodCreate'

type PaymentMethod = {
  id: string
  name: string
  type: string
  isActive: boolean
  processingFee: number
  currency: string
  config?: {
    upiId?: string
  }
  updatedAt: string
}

const StatCard = ({ title, value, icon, color }: any) => (
  <Paper
    sx={{
      p: 3,
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
    }}
  >
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Box>
        <Typography
          variant="caption"
          sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}
        >
          {title}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mt: 1 }}>
          {value}
        </Typography>
      </Box>
      <Box sx={{ color: color || '#0ea5e9' }}>{icon}</Box>
    </Stack>
  </Paper>
)

export default function PaymentMethodManagement() {
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [totalDocs, setTotalDocs] = useState(0)
  const [openDrawer, setOpenDrawer] = useState(false)
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null)

  const fetchMethods = useCallback(async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams({
        limit: perPage.toString(),
        page: page.toString(),
        sort: '-updatedAt',
      })
      const res = await fetch(`/api/payment-methods?${query.toString()}`)
      const data = await res.json()
      setMethods(data.docs || [])
      setTotalDocs(data.totalDocs || 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, perPage])

  useEffect(() => {
    fetchMethods()
  }, [fetchMethods])

  const openCreate = () => {
    setSelectedMethodId(null)
    setOpenDrawer(true)
  }

  const openEdit = (id: string) => {
    setSelectedMethodId(id)
    setOpenDrawer(true)
  }

  const closeDrawer = () => {
    setOpenDrawer(false)
    fetchMethods()
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cash': return <MoneyIcon />
      case 'upi': return <QrCodeIcon />
      case 'card': return <CreditCardIcon />
      case 'netbanking': return <AccountBalanceIcon />
      case 'wallet': return <AccountBalanceWalletIcon />
      default: return <PaymentsIcon />
    }
  }

  return (
    <Box sx={{ p: 4, backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
          Payment Methods
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
          sx={{
            backgroundColor: '#0ea5e9',
            textTransform: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#0284c7' },
          }}
        >
          Add Payment Method
        </Button>
      </Stack>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            title="Total Methods"
            value={totalDocs.toString()}
            icon={<PaymentsIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            title="Active Methods"
            value={methods.filter(m => m.isActive).length.toString()}
            icon={<PaymentsIcon />}
            color="#10b981"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            title="Primary Currency"
            value="INR"
            icon={<PaymentsIcon />}
            color="#6366f1"
          />
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: 'none', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Processing Fee</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4 }}>Loading...</TableCell></TableRow>
            ) : methods.length === 0 ? (
              <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4 }}>No payment methods found.</TableCell></TableRow>
            ) : (
              methods.map((method) => (
                <TableRow key={method.id} sx={{ '&:hover': { backgroundColor: '#f1f5f9' }, transition: 'background-color 0.2s' }}>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ p: 1, borderRadius: '8px', backgroundColor: '#f1f5f9', color: '#0ea5e9', display: 'flex' }}>
                        {getTypeIcon(method.type)}
                      </Box>
                      <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>{method.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ color: '#64748b', textTransform: 'capitalize' }}>{method.type}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ color: '#64748b' }}>{method.processingFee}%</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={method.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      sx={{
                        backgroundColor: method.isActive ? '#dcfce7' : '#fee2e2',
                        color: method.isActive ? '#166534' : '#991b1b',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        borderRadius: '6px',
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      {method.type === 'upi' && method.config?.upiId && (
                        <Tooltip title="View QR Code">
                          <IconButton
                            size="small"
                            onClick={() => openEdit(method.id)}
                            sx={{ color: '#0ea5e9', backgroundColor: '#f0f9ff' }}
                          >
                            <QrCodeIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <IconButton onClick={() => openEdit(method.id)} size="small" sx={{ color: '#64748b' }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Showing {methods.length} methods
          </Typography>
          <Pagination
            count={Math.ceil(totalDocs / perPage)}
            page={page}
            onChange={(_, v) => setPage(v)}
            size="small"
            sx={{
              '& .Mui-selected': { backgroundColor: '#1e293b !important', color: '#fff' },
            }}
          />
        </Stack>
      </TableContainer>

      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        PaperProps={{ sx: { width: 450, p: 4 } }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: '#1e293b' }}>
          {selectedMethodId ? 'Edit Payment Method' : 'Add Payment Method'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
          Configure payment gateway details and preferences for passengers.
        </Typography>
        <PaymentMethodForm paymentMethodId={selectedMethodId} onSuccess={closeDrawer} />
      </Drawer>
    </Box>
  )
}
