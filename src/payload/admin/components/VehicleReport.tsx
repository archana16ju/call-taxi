'use client'

import React, { useEffect, useMemo, useState, useCallback } from 'react'
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
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
  FormControl,
  InputLabel,
  Card,
  Grid,
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'

type Vehicle = {
  id: string
  registrationNumber?: string
  vehicleDetails?: {
    vehicleBrand?: string
    vehicleModel?: string
    vehicleType?: string
    fuelType?: string
  }
  ownerDetails?: {
    ownerName?: string
    phoneNumber?: string
  }
  insuranceDetails?: {
    insuranceStatus?: string
    validTill?: string
  }
  vehicleCondition?: {
    overallCondition?: string
    remarks?: string
  }
}

export default function VehicleReport() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [fuelType, setFuelType] = useState('all')
  const [insuranceStatus, setInsuranceStatus] = useState('all')
  const [condition, setCondition] = useState('all')

  const fetchVehicles = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/vehicles?limit=100', {
        credentials: 'include',
      })
      const data = await res.json()
      setVehicles(data.docs || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      const matchSearch =
        !search ||
        v.registrationNumber?.toLowerCase().includes(search.toLowerCase()) ||
        v.vehicleDetails?.vehicleBrand?.toLowerCase().includes(search.toLowerCase()) ||
        v.ownerDetails?.ownerName?.toLowerCase().includes(search.toLowerCase())

      const matchFuel = fuelType === 'all' || v.vehicleDetails?.fuelType === fuelType

      const matchInsurance =
        insuranceStatus === 'all' || v.insuranceDetails?.insuranceStatus === insuranceStatus

      const matchCondition =
        condition === 'all' || v.vehicleCondition?.overallCondition === condition

      return matchSearch && matchFuel && matchInsurance && matchCondition
    })
  }, [vehicles, search, fuelType, insuranceStatus, condition])

  const handleRefresh = () => {
    setSearch('')
    setFuelType('all')
    setInsuranceStatus('all')
    setCondition('all')
    fetchVehicles()
  }

  // Stats
  const stats = useMemo(() => {
    return {
      total: vehicles.length,
      activeInsurance: vehicles.filter((v) => v.insuranceDetails?.insuranceStatus === 'active')
        .length,
      goodCondition: vehicles.filter((v) => v.vehicleCondition?.overallCondition === 'good').length,
    }
  }, [vehicles])

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: 'var(--theme-bg-page)',
        minHeight: '100vh',
        color: 'var(--theme-text)',
      }}
    >
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Vehicle Report
      </Typography>

      {/* Filter Bar */}
      <Card
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: 'var(--theme-bg-card)',
          color: 'var(--theme-text)',
          border: '1px solid var(--theme-border-color)',
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <TextField
            placeholder="Search Registration, Brand, Owner..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              flexGrow: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'var(--theme-border-color)' },
                '&:hover fieldset': { borderColor: 'var(--theme-elevation-500)' },
              },
              backgroundColor: 'var(--theme-bg-input, var(--theme-elevation-50))',
              borderRadius: 1,
              input: { color: 'var(--theme-text)' },
            }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel sx={{ color: 'var(--theme-text-secondary, #aaa)' }}>Fuel Type</InputLabel>
            <Select
              value={fuelType}
              label="Fuel Type"
              onChange={(e) => setFuelType(e.target.value)}
              sx={{
                color: 'var(--theme-text)',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--theme-border-color)' },
              }}
            >
              <MenuItem value="all">All Fuel</MenuItem>
              <MenuItem value="petrol">Petrol</MenuItem>
              <MenuItem value="diesel">Diesel</MenuItem>
              <MenuItem value="electric">Electric</MenuItem>
              <MenuItem value="cng">CNG</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel sx={{ color: 'var(--theme-text-secondary, #aaa)' }}>Insurance</InputLabel>
            <Select
              value={insuranceStatus}
              label="Insurance"
              onChange={(e) => setInsuranceStatus(e.target.value)}
              sx={{
                color: 'var(--theme-text)',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--theme-border-color)' },
              }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="expired">Expired</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel sx={{ color: 'var(--theme-text-secondary, #aaa)' }}>Condition</InputLabel>
            <Select
              value={condition}
              label="Condition"
              onChange={(e) => setCondition(e.target.value)}
              sx={{
                color: 'var(--theme-text)',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--theme-border-color)' },
              }}
            >
              <MenuItem value="all">All Condition</MenuItem>
              <MenuItem value="good">Good</MenuItem>
              <MenuItem value="poor">Poor</MenuItem>
              <MenuItem value="maintenance">Maintenance</MenuItem>
            </Select>
          </FormControl>

          <IconButton onClick={handleRefresh} sx={{ color: 'var(--theme-text)' }}>
            <RefreshIcon />
          </IconButton>
        </Stack>
      </Card>

      {/* Summary Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card
            sx={{
              p: 2,
              backgroundColor: 'var(--theme-bg-card)',
              color: 'var(--theme-text)',
              textAlign: 'center',
              border: '1px solid var(--theme-border-color)',
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: 'var(--theme-text-secondary, #aaa)', mb: 1 }}
            >
              TOTAL VEHICLES
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {stats.total}
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card
            sx={{
              p: 2,
              backgroundColor: 'var(--theme-bg-card)',
              color: 'var(--theme-text)',
              textAlign: 'center',
              border: '1px solid var(--theme-border-color)',
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: 'var(--theme-text-secondary, #aaa)', mb: 1 }}
            >
              ACTIVE INSURANCE
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
              {stats.activeInsurance}
            </Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card
            sx={{
              p: 2,
              backgroundColor: 'var(--theme-bg-card)',
              color: 'var(--theme-text)',
              textAlign: 'center',
              border: '1px solid var(--theme-border-color)',
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: 'var(--theme-text-secondary, #aaa)', mb: 1 }}
            >
              GOOD CONDITION
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
              {stats.goodCondition}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Data Table */}
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: 'var(--theme-bg-card)',
          border: '1px solid var(--theme-border-color)',
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'var(--theme-bg-card)' }}>
              <TableCell
                sx={{
                  color: 'var(--theme-text-secondary, #aaa)',
                  fontWeight: 'bold',
                  borderRight: '1px solid var(--theme-border-color)',
                  borderBottom: '1px solid var(--theme-border-color)',
                }}
              >
                S.NO
              </TableCell>
              <TableCell
                sx={{
                  color: 'var(--theme-text-secondary, #aaa)',
                  fontWeight: 'bold',
                  borderRight: '1px solid var(--theme-border-color)',
                  borderBottom: '1px solid var(--theme-border-color)',
                }}
              >
                REG NO
              </TableCell>
              <TableCell
                sx={{
                  color: 'var(--theme-text-secondary, #aaa)',
                  fontWeight: 'bold',
                  borderRight: '1px solid var(--theme-border-color)',
                  borderBottom: '1px solid var(--theme-border-color)',
                }}
              >
                BRAND / MODEL
              </TableCell>
              <TableCell
                sx={{
                  color: 'var(--theme-text-secondary, #aaa)',
                  fontWeight: 'bold',
                  borderRight: '1px solid var(--theme-border-color)',
                  borderBottom: '1px solid var(--theme-border-color)',
                }}
              >
                FUEL
              </TableCell>
              <TableCell
                sx={{
                  color: 'var(--theme-text-secondary, #aaa)',
                  fontWeight: 'bold',
                  borderRight: '1px solid var(--theme-border-color)',
                  borderBottom: '1px solid var(--theme-border-color)',
                }}
              >
                OWNER
              </TableCell>
              <TableCell
                sx={{
                  color: 'var(--theme-text-secondary, #aaa)',
                  fontWeight: 'bold',
                  borderRight: '1px solid var(--theme-border-color)',
                  borderBottom: '1px solid var(--theme-border-color)',
                }}
              >
                INSURANCE
              </TableCell>
              <TableCell
                sx={{
                  color: 'var(--theme-text-secondary, #aaa)',
                  fontWeight: 'bold',
                  borderRight: '1px solid var(--theme-border-color)',
                  borderBottom: '1px solid var(--theme-border-color)',
                }}
              >
                CONDITION
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                  sx={{ color: 'var(--theme-text)', py: 3 }}
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                  sx={{ color: 'var(--theme-text)', py: 3 }}
                >
                  No vehicles found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((v, i) => (
                <TableRow
                  key={v.id}
                  sx={{
                    backgroundColor:
                      i % 2 === 0 ? 'var(--theme-bg-input, var(--theme-elevation-50))' : 'inherit',
                    '& td': { borderBottom: '1px solid var(--theme-border-color)' },
                  }}
                >
                  <TableCell
                    sx={{
                      color: 'var(--theme-text)',
                      borderRight: '1px solid var(--theme-border-color)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {i + 1}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'var(--theme-text)',
                      fontWeight: 'bold',
                      borderRight: '1px solid var(--theme-border-color)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {v.registrationNumber}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'var(--theme-text)',
                      borderRight: '1px solid var(--theme-border-color)',
                      textTransform: 'uppercase',
                    }}
                  >
                    <Stack>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {v.vehicleDetails?.vehicleBrand}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: 'var(--theme-text-secondary, #aaa)' }}
                      >
                        {v.vehicleDetails?.vehicleModel}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'var(--theme-text)',
                      borderRight: '1px solid var(--theme-border-color)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {v.vehicleDetails?.fuelType}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'var(--theme-text)',
                      borderRight: '1px solid var(--theme-border-color)',
                      textTransform: 'uppercase',
                    }}
                  >
                    <Stack>
                      <Typography variant="body2">{v.ownerDetails?.ownerName}</Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: 'var(--theme-text-secondary, #aaa)' }}
                      >
                        {v.ownerDetails?.phoneNumber}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'var(--theme-text)',
                      borderRight: '1px solid var(--theme-border-color)',
                      textTransform: 'uppercase',
                    }}
                  >
                    <Chip
                      label={v.insuranceDetails?.insuranceStatus?.toUpperCase()}
                      size="small"
                      color={
                        v.insuranceDetails?.insuranceStatus === 'active' ? 'success' : 'error'
                      }
                      sx={{ fontWeight: 'bold' }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      color: 'var(--theme-text)',
                      borderRight: '1px solid var(--theme-border-color)',
                      textTransform: 'uppercase',
                    }}
                  >
                    <Chip
                      label={v.vehicleCondition?.overallCondition?.toUpperCase()}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontWeight: 'bold',
                        borderColor:
                          v.vehicleCondition?.overallCondition === 'good' ? '#4caf50' : '#f44336',
                        color:
                          v.vehicleCondition?.overallCondition === 'good' ? '#4caf50' : '#f44336',
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
