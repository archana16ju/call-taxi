'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
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
  TextField,
  InputAdornment,
  Drawer,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import AddIcon from '@mui/icons-material/Add'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import dayjs from 'dayjs'
import { InvoiceForm } from './InvoiceCreate'

type Invoice = {
  id: string
  invoiceNumber: string
  customer: {
    name: string
    email?: string
  } | string
  date: string
  totalAmount: number
  status: string
  paymentMethod?: {
    name: string
  } | string
}

const StatCard = ({ title, value, subValue, icon, color }: any) => (
  <Paper
    sx={{
      p: 3,
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
      height: '100%',
    }}
  >
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {title}
      </Typography>
      <Box sx={{ color: color || '#0ea5e9', backgroundColor: `${color || '#0ea5e9'}15`, p: 0.5, borderRadius: '6px', display: 'flex' }}>
        {icon}
      </Box>
    </Stack>
    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
      {value}
    </Typography>
    {subValue && (
      <Typography variant="caption" sx={{ color: subValue.startsWith('+') ? '#10b981' : '#ef4444', fontWeight: 700, mt: 0.5, display: 'block' }}>
        {subValue}
      </Typography>
    )}
  </Paper>
)

export default function InvoiceManagement() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [totalDocs, setTotalDocs] = useState(0)
  const [search, setSearch] = useState('')
  const [openDrawer, setOpenDrawer] = useState(false)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)

  const fetchInvoices = useCallback(async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams({
        limit: perPage.toString(),
        page: page.toString(),
        sort: '-createdAt',
        depth: '1',
      })
      if (search) {
        query.append('where[invoiceNumber][contains]', search)
      }
      const res = await fetch(`/api/invoices?${query.toString()}`)
      const data = await res.json()
      setInvoices(data.docs || [])
      setTotalDocs(data.totalDocs || 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, perPage, search])

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  const stats = useMemo(() => {
    const total = invoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0)
    const pending = invoices.filter(inv => inv.status === 'pending').reduce((acc, inv) => acc + (inv.totalAmount || 0), 0)
    const overdueCount = invoices.filter(inv => inv.status === 'overdue').length

    return {
      total: `₹${total.toLocaleString()}`,
      pending: `₹${pending.toLocaleString()}`,
      overdue: overdueCount,
    }
  }, [invoices])

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid': return { bg: '#dcfce7', text: '#166534', label: 'PAID' }
      case 'pending': return { bg: '#fef9c3', text: '#854d0e', label: 'PENDING' }
      case 'overdue': return { bg: '#fee2e2', text: '#991b1b', label: 'OVERDUE' }
      default: return { bg: '#f1f5f9', text: '#475569', label: status.toUpperCase() }
    }
  }

  const openCreate = () => {
    setSelectedInvoiceId(null)
    setOpenDrawer(true)
  }

  const openEdit = (id: string) => {
    setSelectedInvoiceId(id)
    setOpenDrawer(true)
  }

  const closeDrawer = () => {
    setOpenDrawer(false)
    fetchInvoices()
  }

  return (
    <Box sx={{ p: 4, backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
            Invoice Data Store
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Manage and track fleet transaction records.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
          sx={{
            backgroundColor: '#1e293b',
            color: '#fff',
            textTransform: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            px: 2,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#334155' },
          }}
        >
          ADD INVOICE
        </Button>
      </Stack>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            title="TOTAL RECEIVABLES"
            value={stats.total}
            subValue="+12.5% from last month"
            icon={<AccountBalanceWalletIcon />}
            color="#0ea5e9"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            title="PENDING PAYMENTS"
            value={stats.pending}
            subValue={`${stats.overdue} invoices overdue`}
            icon={<ErrorOutlineIcon />}
            color="#f59e0b"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            title="MONTHLY REVENUE"
            value="₹1,12,400.00"
            subValue="75% of target reached"
            icon={<TrendingUpIcon />}
            color="#10b981"
          />
        </Grid>
      </Grid>

      <Paper sx={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden' }}>
        <Stack direction="row" spacing={2} sx={{ p: 2, borderBottom: '1px solid #e2e8f0' }} alignItems="center">
          <TextField
            size="small"
            placeholder="Search invoices, clients or IDs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { borderRadius: '8px', backgroundColor: '#f8fafc' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="outlined" startIcon={<FilterListIcon />} sx={{ textTransform: 'none', borderRadius: '8px', borderColor: '#e2e8f0', color: '#475569' }}>
            Filter
          </Button>
          <Button variant="outlined" startIcon={<FileDownloadIcon />} sx={{ textTransform: 'none', borderRadius: '8px', borderColor: '#e2e8f0', color: '#475569' }}>
            Export
          </Button>
        </Stack>

        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase' }}>INVOICE ID</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase' }}>RECIPIENT</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase' }}>DATE</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase' }}>TOTAL AMOUNT</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase' }}>METHOD</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase' }}>STATUS</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}>Loading...</TableCell></TableRow>
              ) : invoices.length === 0 ? (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}>No invoices found.</TableCell></TableRow>
              ) : (
                invoices.map((inv) => {
                  const status = getStatusStyle(inv.status)
                  return (
                    <TableRow key={inv.id} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                      <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>#{inv.invoiceNumber}</TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>
                          {typeof inv.customer === 'object' ? inv.customer.name : 'Unknown Customer'}
                        </Typography>
                        <Typography sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                          {typeof inv.customer === 'object' && inv.customer.email ? inv.customer.email : ''}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: '#475569' }}>{dayjs(inv.date).format('MMM DD, YYYY')}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#1e293b' }}>₹{inv.totalAmount?.toLocaleString()}</TableCell>
                      <TableCell sx={{ color: '#475569', fontSize: '0.875rem' }}>
                        {typeof inv.paymentMethod === 'object' ? inv.paymentMethod.name : (inv.paymentMethod || '---')}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={status.label}
                          size="small"
                          sx={{
                            backgroundColor: status.bg,
                            color: status.text,
                            fontWeight: 800,
                            fontSize: '0.65rem',
                            borderRadius: '6px',
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => openEdit(inv.id)}>
                          <MoreVertIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, totalDocs)} of {totalDocs} invoices
          </Typography>
          <Pagination
            count={Math.ceil(totalDocs / perPage)}
            page={page}
            onChange={(_, v) => setPage(v)}
            size="small"
            sx={{ '& .Mui-selected': { backgroundColor: '#1e293b !important', color: '#fff' } }}
          />
        </Stack>
      </Paper>

      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={closeDrawer}
        PaperProps={{ sx: { width: 600, p: 0, backgroundColor: '#f8fafc' } }}
      >
        <InvoiceForm invoiceId={selectedInvoiceId} onSuccess={closeDrawer} />
      </Drawer>
    </Box>
  )
}
