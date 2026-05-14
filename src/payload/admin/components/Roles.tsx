'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Avatar,
  CircularProgress,
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import RefreshIcon from '@mui/icons-material/Refresh'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SecurityIcon from '@mui/icons-material/Security'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'

type RoleType = {
  id: string
  name: string
  permissions: string[]
  users: number
}

export default function RolesPage() {
  const [roles, setRoles] = useState<RoleType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      setLoading(true)

      const res = await fetch('/api/users?limit=100')

      const data = await res.json()

      const users = data.docs || []

      const groupedRoles: Record<string, number> = {}

      users.forEach((user: any) => {
        const role = user.role || 'admin'

        if (!groupedRoles[role]) {
          groupedRoles[role] = 0
        }

        groupedRoles[role]++
      })

      const roleData: RoleType[] = [
        {
          id: '1',
          name: 'superadmin',
          permissions: ['Full System Access'],
          users: groupedRoles.superadmin || 0,
        },
        {
          id: '2',
          name: 'admin',
          permissions: [
            'Dashboard',
            'Users',
            'Drivers',
            'Bookings',
            'Vehicles',
          ],
          users: groupedRoles.admin || 0,
        },
        {
          id: '3',
          name: 'accounts',
          permissions: [
            'Invoices',
            'Payments',
            'Tariffs',
            'Coupons',
          ],
          users: groupedRoles.accounts || 0,
        },
      ]

      setRoles(roleData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return '#fbbf24'

      case 'admin':
        return '#3b82f6'

      case 'accounts':
        return '#22c55e'

      default:
        return '#a855f7'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'superadmin':
        return <SecurityIcon />

      case 'admin':
        return <AdminPanelSettingsIcon />

      case 'accounts':
        return <AccountBalanceWalletIcon />

      default:
        return <SecurityIcon />
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: '#081120',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress sx={{ color: '#fbbf24' }} />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top, #0f2747 0%, #081120 50%, #050b16 100%)',
        p: 4,
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          <Typography
            variant="h3"
            sx={{
              color: '#fff',
              fontWeight: 900,
              mb: 1,
            }}
          >
            Roles Management
          </Typography>

          <Typography
            sx={{
              color: '#94a3b8',
              fontSize: '1rem',
            }}
          >
            Manage system roles and permissions
          </Typography>
        </Box>
      </Stack>

      {/* Main Card */}
      <Paper
        sx={{
          background: 'rgba(10,20,40,0.9)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '28px',
          p: 3,
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Top Actions */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <TextField
            placeholder="Search roles..."
            sx={{
              width: 350,

              '& .MuiOutlinedInput-root': {
                borderRadius: '14px',
                color: '#fff',
                background: 'rgba(255,255,255,0.03)',

                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.06)',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
            }}
          />

          <Stack direction="row" spacing={2}>
            <IconButton
              sx={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <FilterListIcon sx={{ color: '#cbd5e1' }} />
            </IconButton>

            <IconButton
              onClick={fetchRoles}
              sx={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <RefreshIcon sx={{ color: '#cbd5e1' }} />
            </IconButton>
          </Stack>
        </Stack>

        {/* Table Header */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr',
            p: 2,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            color: '#94a3b8',
            fontWeight: 700,
            mb: 2,
          }}
        >
          <Typography>ROLE NAME</Typography>
          <Typography>PERMISSIONS</Typography>
          <Typography>USERS</Typography>
          <Typography>STATUS</Typography>
          <Typography>ACTIONS</Typography>
        </Box>

        {/* Roles */}
        <Stack spacing={2}>
          {roles.map((role) => (
            <Paper
              key={role.id}
              sx={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '20px',
                p: 3,
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                {/* Role */}
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      background: `${getRoleColor(role.name)}20`,
                      color: getRoleColor(role.name),
                    }}
                  >
                    {getRoleIcon(role.name)}
                  </Avatar>

                  <Box>
                    <Typography
                      sx={{
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: '1.2rem',
                        textTransform: 'capitalize',
                      }}
                    >
                      {role.name}
                    </Typography>

                    <Chip
                      label={role.name}
                      size="small"
                      sx={{
                        mt: 1,
                        background: 'rgba(255,255,255,0.05)',
                        color: '#cbd5e1',
                      }}
                    />
                  </Box>
                </Stack>

                {/* Permissions */}
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  useFlexGap
                >
                  {role.permissions.map((permission, index) => (
                    <Chip
                      key={index}
                      label={permission}
                      sx={{
                        background: `${getRoleColor(role.name)}15`,
                        color: getRoleColor(role.name),
                        fontWeight: 700,
                        borderRadius: '10px',
                      }}
                    />
                  ))}
                </Stack>

                {/* Users */}
                <Box>
                  <Typography
                    sx={{
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: '1.4rem',
                    }}
                  >
                    {role.users}
                  </Typography>

                  <Typography
                    sx={{
                      color: '#94a3b8',
                    }}
                  >
                    users
                  </Typography>
                </Box>

                {/* Status */}
                <Chip
                  label="Active"
                  sx={{
                    width: 90,
                    background: 'rgba(34,197,94,0.15)',
                    color: '#22c55e',
                    fontWeight: 800,
                  }}
                />

                {/* Actions */}
                <Stack direction="row" spacing={1}>
                  <IconButton
                    sx={{
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <EditIcon sx={{ color: '#fff' }} />
                  </IconButton>

                  {role.name !== 'superadmin' && (
                    <IconButton
                      sx={{
                        border: '1px solid rgba(239,68,68,0.3)',
                        background: 'rgba(239,68,68,0.1)',
                      }}
                    >
                      <DeleteIcon sx={{ color: '#ef4444' }} />
                    </IconButton>
                  )}
                </Stack>
              </Box>
            </Paper>
          ))}
        </Stack>

        {/* Footer */}
        <Typography
          sx={{
            mt: 4,
            color: '#94a3b8',
          }}
        >
          Showing 1 to {roles.length} of {roles.length} roles
        </Typography>
      </Paper>
    </Box>
  )
}