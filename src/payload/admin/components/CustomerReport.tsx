'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'

interface CustomerStat {
  name: string
  phone: string
  count: number
  totalAmount: number
}

interface Booking {
  id: string
  pickupDateTime: string
  pickupLocationName: string
  dropoffLocationName: string
  estimatedFare: number
  status: string
  tripType: string
}

const CustomerReport: React.FC = () => {
  const [data, setData] = useState<CustomerStat[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState<{ name: string; phone: string } | null>(
    null,
  )
  const [customerBookings, setCustomerBookings] = useState<Booking[]>([])
  const [bookingsLoading, setBookingsLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    setSelectedCustomer(null)
    setCustomerBookings([])
    try {
      const res = await fetch('/api/get-customer-report')
      if (res.ok) {
        const json = await res.json()
        setData(json)
      } else {
        console.error('Failed to fetch customer report')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomerBookings = async (phone: string, name: string) => {
    // If the same customer is clicked, deselect (toggle off)
    if (selectedCustomer?.phone === phone) {
      setSelectedCustomer(null)
      setCustomerBookings([])
      return
    }

    setSelectedCustomer({ name, phone })
    setBookingsLoading(true)
    try {
      const res = await fetch(`/api/get-booking-report?customerPhone=${phone}`)
      if (res.ok) {
        const json = await res.json()
        // Sort by date new to old
        const sorted = json.docs.sort(
          (a: { pickupDateTime: string }, b: { pickupDateTime: string }) =>
            new Date(b.pickupDateTime).getTime() - new Date(a.pickupDateTime).getTime(),
        )
        setCustomerBookings(sorted)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setBookingsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: 'var(--theme-bg-page)',
        minHeight: '100vh',
        color: 'var(--theme-text)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Customer Report
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchData}
          sx={{
            color: 'var(--theme-text)',
            borderColor: 'var(--theme-border-color)',
            '&:hover': { borderColor: 'var(--theme-elevation-500)' },
          }}
        >
          Refresh
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress sx={{ color: 'var(--theme-text)' }} />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          {/* Left Side: Customer List */}
          <TableContainer
            component={Paper}
            sx={{
              bgcolor: 'var(--theme-bg-card)',
              borderRadius: 2,
              width: '50%',
              maxHeight: '80vh',
              border: '1px solid var(--theme-border-color)',
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ bgcolor: 'var(--theme-bg-card)', borderBottom: '1px solid var(--theme-border-color)' }}>
                  <TableCell
                    sx={{
                      color: 'var(--theme-text-secondary, #aaa)',
                      fontWeight: 'bold',
                      textAlign: 'left',
                      bgcolor: 'var(--theme-bg-card)',
                      borderRight: '1px solid var(--theme-border-color)',
                      borderLeft: '1px solid var(--theme-border-color)',
                      borderBottom: '1px solid var(--theme-border-color)',
                    }}
                  >
                    S.NO
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'var(--theme-text-secondary, #aaa)',
                      fontWeight: 'bold',
                      textAlign: 'left',
                      bgcolor: 'var(--theme-bg-card)',
                      borderRight: '1px solid var(--theme-border-color)',
                      borderBottom: '1px solid var(--theme-border-color)',
                    }}
                  >
                    CUSTOMER NAME
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'var(--theme-text-secondary, #aaa)',
                      fontWeight: 'bold',
                      textAlign: 'left',
                      bgcolor: 'var(--theme-bg-card)',
                      borderRight: '1px solid var(--theme-border-color)',
                      borderBottom: '1px solid var(--theme-border-color)',
                    }}
                  >
                    PHONE
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'var(--theme-text-secondary, #aaa)',
                      fontWeight: 'bold',
                      textAlign: 'left',
                      bgcolor: 'var(--theme-bg-card)',
                      borderRight: '1px solid var(--theme-border-color)',
                      borderBottom: '1px solid var(--theme-border-color)',
                    }}
                  >
                    TRIP COUNT
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'var(--theme-text-secondary, #aaa)',
                      fontWeight: 'bold',
                      textAlign: 'left',
                      bgcolor: 'var(--theme-bg-card)',
                      borderRight: '1px solid var(--theme-border-color)',
                      borderBottom: '1px solid var(--theme-border-color)',
                    }}
                  >
                    TOTAL AMOUNT
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length > 0 ? (
                  data.map((row, index) => (
                    <TableRow
                      key={row.phone}
                      onClick={() => fetchCustomerBookings(row.phone, row.name)}
                      sx={{
                        backgroundColor:
                          selectedCustomer?.phone === row.phone
                            ? 'var(--theme-elevation-200)'
                            : index % 2 === 0
                              ? 'var(--theme-bg-input, var(--theme-elevation-50))'
                              : 'inherit',
                        borderBottom: '1px solid var(--theme-border-color)',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'var(--theme-elevation-100)',
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          color: 'var(--theme-text)',
                          textAlign: 'left',
                          borderRight: '1px solid var(--theme-border-color)',
                          borderLeft: '1px solid var(--theme-border-color)',
                        }}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: 'var(--theme-text)',
                          textAlign: 'left',
                          borderRight: '1px solid var(--theme-border-color)',
                        }}
                      >
                        <Typography variant="body2" fontWeight="bold">
                          {row.name.toUpperCase()}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          color: 'var(--theme-text)',
                          textAlign: 'left',
                          borderRight: '1px solid var(--theme-border-color)',
                        }}
                      >
                        <Typography variant="body2" fontWeight="bold">
                          {row.phone}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          color: 'var(--theme-text)',
                          textAlign: 'left',
                          borderRight: '1px solid var(--theme-border-color)',
                        }}
                      >
                        {row.count}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: 'var(--theme-text)',
                          textAlign: 'left',
                          borderRight: '1px solid var(--theme-border-color)',
                        }}
                      >
                        ₹{row.totalAmount.toLocaleString('en-IN')}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', color: 'var(--theme-text-secondary, #666)', py: 4 }}>
                      No data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Right Side: Detail View */}
          {selectedCustomer && (
            <Box sx={{ width: '50%' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Bookings for {selectedCustomer.name.toUpperCase()}
              </Typography>
              {bookingsLoading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                  <CircularProgress sx={{ color: 'var(--theme-text)' }} />
                </Box>
              ) : (
                <TableContainer
                  component={Paper}
                  sx={{
                    bgcolor: 'var(--theme-bg-card)',
                    borderRadius: 2,
                    maxHeight: '80vh',
                    border: '1px solid var(--theme-border-color)',
                  }}
                >
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'var(--theme-bg-card)', borderBottom: '1px solid var(--theme-border-color)' }}>
                        {['S.NO', 'DATE', 'TRIP TYPE', 'PICKUP', 'DROPOFF', 'AMOUNT', 'STATUS'].map(
                          (head) => (
                            <TableCell
                              key={head}
                              sx={{
                                color: 'var(--theme-text-secondary, #aaa)',
                                fontWeight: 'bold',
                                textAlign: 'left',
                                bgcolor: 'var(--theme-bg-card)',
                                borderRight: '1px solid var(--theme-border-color)',
                                borderBottom: '1px solid var(--theme-border-color)',
                                borderLeft: head === 'S.NO' ? '1px solid var(--theme-border-color)' : 'none',
                              }}
                            >
                              {head}
                            </TableCell>
                          ),
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {customerBookings.length > 0 ? (
                        customerBookings.map((booking, index) => (
                          <TableRow
                            key={booking.id}
                            sx={{
                              backgroundColor: index % 2 === 0 ? 'var(--theme-bg-input, var(--theme-elevation-50))' : 'inherit',
                              borderBottom: '1px solid var(--theme-border-color)',
                            }}
                          >
                            <TableCell
                              sx={{
                                color: 'var(--theme-text)',
                                borderRight: '1px solid var(--theme-border-color)',
                                borderLeft: '1px solid var(--theme-border-color)',
                              }}
                            >
                              {index + 1}
                            </TableCell>
                            <TableCell sx={{ color: 'var(--theme-text)', borderRight: '1px solid var(--theme-border-color)' }}>
                              {new Date(booking.pickupDateTime).toLocaleString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              })}
                            </TableCell>
                            <TableCell sx={{ color: 'var(--theme-text)', borderRight: '1px solid var(--theme-border-color)' }}>
                              {booking.tripType}
                            </TableCell>
                            <TableCell sx={{ color: 'var(--theme-text)', borderRight: '1px solid var(--theme-border-color)' }}>
                              {booking.pickupLocationName}
                            </TableCell>
                            <TableCell sx={{ color: 'var(--theme-text)', borderRight: '1px solid var(--theme-border-color)' }}>
                              {booking.dropoffLocationName || '-'}
                            </TableCell>
                            <TableCell sx={{ color: 'var(--theme-text)', borderRight: '1px solid var(--theme-border-color)' }}>
                              {booking.estimatedFare
                                ? `₹${booking.estimatedFare.toLocaleString('en-IN')}`
                                : '-'}
                            </TableCell>
                            <TableCell sx={{ color: 'var(--theme-text)', borderRight: '1px solid var(--theme-border-color)' }}>
                              {booking.status}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} sx={{ textAlign: 'center', color: 'var(--theme-text-secondary, #666)', py: 4 }}>
                            No bookings found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default CustomerReport
