'use client'

import { ROLE_PERMISSIONS } from '@/access/rolePermissions'
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  Switch,
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
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
  active: boolean
}

const ALL_PERMISSIONS = [
  '/admin',

  '/admin/collections/users',
  '/admin/collections/drivers',
  '/admin/collections/customers',
  '/admin/collections/slider-images',
  '/admin/collections/media',
  '/admin/collections/vehicles',

  '/admin/collections/bookings',
  '/admin/driver-allocation',
  '/admin/voice-dispatch',
  '/admin/collections/ride-preferences',

  '/live-tracking',
  '/admin/collections/driver-offline-logs',

  '/admin/globals/general-settings',
  '/admin/collections/ai-chat-conversations',

  '/admin/globals/cancellation-control',
  '/admin/collections/trip-otps',
  '/admin/collections/trip-sharing',

  '/admin/collections/revenue-settlements',

  '/admin/collections/invoices',
  '/admin/globals/payment-settings',
  '/admin/collections/payment-methods',
  '/admin/collections/tariffs',
  '/admin/collections/coupons',

  '/admin/collections/alerts',
  '/admin/collections/contacts',

  '/admin/globals/customer-report',
  '/admin/globals/booking-report',
  '/admin/globals/vehicle-report',

  '/admin/collections/reviews',

  '/admin/collections/roles',
]

export default function RolesPage() {

    const [search, setSearch] = useState('')
    const [roles, setRoles] = useState<RoleType[]>([])
    const [loading, setLoading] = useState(true)

    const [openEdit, setOpenEdit] = useState(false)

   const [selectedRole, setSelectedRole] = useState<any>(null)

const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

const [roleActive, setRoleActive] = useState(true)

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

   const roleData: RoleType[] = Object.keys(ROLE_PERMISSIONS).map(
  (roleName, index) => {
    const roleConfig = ROLE_PERMISSIONS[roleName]

    return {
      id: String(index + 1),
      name: roleName,

      active: roleConfig.active ?? true, // ✅ ADD THIS

      permissions:
        roleConfig.permissions[0] === '*'
          ? ['Full System Access']
          : roleConfig.permissions.map((path: string) =>
              path
                .replace('/admin/collections/', '')
                .replace('/admin/globals/', '')
                .replace('/admin/', '')
                .replaceAll('-', ' '),
            ),

      users: groupedRoles[roleName] || 0,
    }
  },
)

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

  const handleEdit = (role: any) => {
  const roleConfig = ROLE_PERMISSIONS[role.name]

  setSelectedRole(role)

  setSelectedPermissions(roleConfig.permissions)

  setRoleActive(roleConfig.active)

  setOpenEdit(true)
}

const handlePermissionToggle = (permission: string) => {
  setSelectedPermissions((prev) =>
    prev.includes(permission)
      ? prev.filter((p) => p !== permission)
      : [...prev, permission],
  )
}

const handleSaveRole = async () => {
  if (!selectedRole) return

await fetch(`/api/roles/${selectedRole.id}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    active: roleActive,
    permissions: selectedPermissions.map((p) => ({ path: p })),
  }),
})

setRoles((prev) =>
  prev.map((r) =>
    r.id === selectedRole.id
      ? { ...r, active: roleActive }
      : r,
  ),
)

  fetchRoles()

  setOpenEdit(false)
}

const handleDelete = (roleName: string) => {
  if (roleName === 'superadmin') return

  delete ROLE_PERMISSIONS[roleName]

  fetchRoles()
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

  const filteredRoles = roles.filter((role) =>
  role.name
    .toLowerCase()
    .includes(search.toLowerCase()),
)

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
  value={search}
  onChange={(e) => setSearch(e.target.value)}
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
            gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr',
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
          <Typography>TOTAL PERMISSIONS</Typography>
          <Typography>STATUS</Typography>
          <Typography>ACTIONS</Typography>
        </Box>

        {/* Roles */}
        <Stack spacing={2}>
          {filteredRoles.map((role) => (
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
                  gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr',
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
  label={
    role.active
      ? 'Active'
      : 'Inactive'
  }
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

                {/* Total Permissions */}
<Box>
  <Typography
    sx={{
      color: '#fff',
      fontWeight: 800,
      fontSize: '1.4rem',
    }}
  >
    {ROLE_PERMISSIONS[role.name]?.permissions[0] === '*'
      ? 'ALL'
      : ROLE_PERMISSIONS[role.name]?.permissions.length}
  </Typography>

  <Typography
    sx={{
      color: '#94a3b8',
    }}
  >
    permissions
  </Typography>
</Box>

                {/* Status */}
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
  <Box
    sx={{
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: role.active ? '#10b981' : '#ef4444',
    }}
  />

  <Typography
    variant="caption"
    sx={{
      fontWeight: 700,
      color: role.active ? '#166534' : '#991b1b',
      backgroundColor: role.active ? '#dcfce7' : '#fee2e2',
      px: 1,
      py: 0.25,
      borderRadius: '999px',
    }}
  >
    {role.active ? 'ACTIVE' : 'INACTIVE'}
  </Typography>
</Box>

                {/* Actions */}
                <Stack direction="row" spacing={1}>
                  <IconButton
  onClick={() => handleEdit(role)}
  sx={{
    border: '1px solid rgba(255,255,255,0.08)',
  }}
>
                    <EditIcon sx={{ color: '#fff' }} />
                  </IconButton>

                  {role.name !== 'superadmin' && (
                   <IconButton
  onClick={() => handleDelete(role.name)}
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
         Showing 1 to {filteredRoles.length} of {roles.length} roles
        </Typography>
      </Paper>
      <Dialog
  open={openEdit}
  onClose={() => setOpenEdit(false)}
  maxWidth="md"
  fullWidth
>
  <DialogTitle>Edit Role Permissions</DialogTitle>

  <DialogContent>
    <Box sx={{ mt: 2 }}>
      <FormControlLabel
        control={
          <Switch
            checked={roleActive}
            onChange={(e) =>
              setRoleActive(e.target.checked)
            }
          />
        }
        label={roleActive ? 'Active' : 'Inactive'}
      />
    </Box>

    <Typography
      sx={{
        mt: 3,
        mb: 2,
        fontWeight: 700,
      }}
    >
      Permissions
    </Typography>

    <Stack spacing={1}>
      {ALL_PERMISSIONS.map((permission) => (
        <FormControlLabel
          key={permission}
          control={
            <Checkbox
              checked={selectedPermissions.includes(
                permission,
              )}
              onChange={() =>
                handlePermissionToggle(permission)
              }
            />
          }
          label={permission}
        />
      ))}
    </Stack>
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setOpenEdit(false)}>
      Cancel
    </Button>

    <Button
      variant="contained"
      onClick={handleSaveRole}
    >
      Save Changes
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  )
}