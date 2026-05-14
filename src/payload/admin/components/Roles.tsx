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
  active?: boolean
}

type PermissionGroup = {
  label: string
  color: string
  permissions: string[]
}

const PERMISSION_GROUPS: PermissionGroup[] = [
  {
     label: 'Super Admin',
    color: '#fbbf24',
    permissions: ['Full System Access'],
  },

  {
    label: 'Admin',
    color: '#3b82f6',
    permissions: [
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
    '/admin/collections/alerts',
    '/admin/collections/contacts',
    '/admin/globals/customer-report',
    '/admin/globals/booking-report',
    '/admin/globals/vehicle-report',
    '/admin/collections/reviews',
  ],
},

 {
    label: 'Accounts',
    color: '#22c55e',
    permissions: [
    '/admin',
    '/admin/collections/invoices',
    '/admin/globals/payment-settings',
    '/admin/collections/payment-methods',
    '/admin/collections/tariffs',
    '/admin/collections/coupons',
    '/admin/collections/alerts',
  ],
},
]

export default function RolesPage() {

  const [roleConfig, setRoleConfig] = useState<any>({})
  const normalizePermission = (p: string) =>
  p
    .replace('/admin/collections/', '')
    .replace('/admin/globals/', '')
    .replace('/admin/', '')
 const fetchRoleConfig = async () => {
  const res = await fetch('/api/roles')
  const data = await res.json()

  const fresh = data || {}

  setRoleConfig(fresh)
  fetchRoles(fresh)
}

  const [search, setSearch] = useState('')
  const [roles, setRoles] = useState<RoleType[]>([])
  const [loading, setLoading] = useState(true)

  const [openEdit, setOpenEdit] = useState(false)

const [selectedRole, setSelectedRole] = useState<any>(null)

const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

const [roleActive, setRoleActive] = useState(true)

  useEffect(() => {
  const init = async () => {
    await fetchRoleConfig()
    await fetchRoles()
  }

  init()
}, [])

  const fetchRoles = async (configOverride?: any) => {
  try {
    setLoading(true)

    const res = await fetch('/api/users?limit=100')
    const response = await res.json()
const data = response.data || response

    const users = data.docs || []

    const groupedRoles: Record<string, number> = {}

    users.forEach((user: any) => {
      const role = user.role || 'admin'
      groupedRoles[role] = (groupedRoles[role] || 0) + 1
    })

    const config = configOverride ?? roleConfig ?? {}

    const roleData: RoleType[] = Object.keys(ROLE_PERMISSIONS).map(
      (roleName, index) => {
        const dbConfig = config[roleName]
        const baseConfig = ROLE_PERMISSIONS[roleName]

        const permissionsSource =
  dbConfig?.permissions ?? baseConfig.permissions

        return {
          id: String(index + 1),
          name: roleName,

          permissions:
            permissionsSource[0] === '*'
              ? ['Full System Access']
              : permissionsSource.map((path: string) =>
                  path
                    .replace('/admin/collections/', '')
                    .replace('/admin/globals/', '')
                    .replace('/admin/', '')
                    .replaceAll('-', ' ')
                ),

          users: groupedRoles[roleName] || 0,
          active: dbConfig?.active ?? baseConfig.active ?? true,
        }
      }
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
  setSelectedRole(role)

  const basePermissions =
    ROLE_PERMISSIONS[role.name]?.permissions || []

  const normalizedSelected = role.permissions.map((p: string) =>
    p.startsWith('/admin') ? p : `/admin/collections/${p}`
  )

  setSelectedPermissions(normalizedSelected.length ? normalizedSelected : basePermissions)

  setRoleActive(role.active ?? true)
  setOpenEdit(true)
}

const handlePermissionToggle = (permission: string) => {
  const fullPermission = permission.startsWith('/admin')
    ? permission
    : `/admin/collections/${permission}`

  setSelectedPermissions((prev) =>
    prev.includes(fullPermission)
      ? prev.filter((p) => p !== fullPermission)
      : [...prev, fullPermission],
  )
}

const handleSaveRole = async () => {
  if (!selectedRole) return

  const res = await fetch('/api/roles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      role: selectedRole.name,
      permissions: selectedPermissions,
      active: roleActive,
    }),
  })

  const data = await res.json()

  if (data.success) {
    await fetchRoleConfig()
    await fetchRoles()

    setOpenEdit(false)
  } else {
    console.error('Save failed:', data)
  }
}

const handleDelete = async (roleName: string) => {
  if (roleName === 'superadmin') return

  await fetch(`/api/roles/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: roleName }),
  })

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
          {roles
  .filter((role) =>
    role.name.toLowerCase().includes(search.toLowerCase())
  )
  .map((role) => (
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

                   {/* Status */}
<Chip
  label={role.active ? 'Active' : 'Inactive'}
  sx={{
    width: 90,
    background: role.active
      ? 'rgba(34,197,94,0.15)'
      : 'rgba(239,68,68,0.15)',

    color: role.active
      ? '#22c55e'
      : '#ef4444',

    fontWeight: 800,
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
                    background: role.active
  ? 'rgba(34,197,94,0.15)'
  : 'rgba(239,68,68,0.15)',

color: role.active
  ? '#22c55e'
  : '#ef4444',
                    fontWeight: 800,
                  }}
                />

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
          Showing 1 to {roles.length} of {roles.length} roles
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
  <Box sx={{ mt: 1 }} />

  {/* ROLE STATUS */}
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      mb: 3,
      p: 2,
      borderRadius: '14px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
    }}
  >
    <Typography sx={{ fontWeight: 800, color: '#fff' }}>
      Role Status
    </Typography>

    <Switch
      checked={roleActive}
      onChange={(e) => setRoleActive(e.target.checked)}
      color="success"
    />
  </Box>

  {/* PERMISSIONS TITLE */}
  <Typography
    sx={{
      mt: 2,
      mb: 2,
      fontWeight: 900,
      color: '#fff',
      fontSize: '1.1rem',
    }}
  >
    Permissions
  </Typography>

  {/* GROUPED PERMISSIONS */}
  <Stack spacing={3}>
    {PERMISSION_GROUPS.map((group) => (
      <Box
        key={group.label}
        sx={{
          p: 2,
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        {/* GROUP HEADER */}
        <Typography
          sx={{
            color: group.color,
            fontWeight: 900,
            mb: 1.5,
            fontSize: '0.95rem',
          }}
        >
          {group.label}
        </Typography>

        {/* CHIPS */}
       <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
  {group.permissions.map((permission: string) => {

    const normalizedPermission = normalizePermission(permission)

    const fullPermission = permission.startsWith('/admin')
  ? permission
  : `/admin/collections/${permission}`

const isSelected = selectedPermissions.includes(fullPermission)

    return (
      <Box
        key={permission}
        onClick={() => handlePermissionToggle(permission)}
        sx={{
          cursor: 'pointer',
          px: 1.5,
          py: 1,
          borderRadius: '12px',
          fontSize: '0.85rem',
          fontWeight: 700,
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 1,

          background: isSelected
            ? 'rgba(34,197,94,0.15)'
            : 'rgba(255,255,255,0.03)',

          color: isSelected ? '#22c55e' : '#94a3b8',

          border: isSelected
            ? '1px solid rgba(34,197,94,0.5)'
            : '1px solid rgba(255,255,255,0.06)',

          transition: '0.2s',

          '&:hover': {
            background: isSelected
              ? 'rgba(34,197,94,0.25)'
              : 'rgba(255,255,255,0.06)',
            transform: 'scale(1.02)',
          },
        }}
      >
        <Checkbox
          checked={isSelected}
          size="small"
          sx={{ color: '#22c55e', p: 0 }}
        />

        {normalizePermission(permission)}
      </Box>
    )
  })}
</Stack>
      </Box>
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